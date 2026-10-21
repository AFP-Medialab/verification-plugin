import { useDispatch } from "react-redux";

import useAuthenticatedFetch from "@/components/Shared/Authentication/useAuthenticatedFetch";
import useAuthenticatedRequest from "@/components/Shared/Authentication/useAuthenticatedRequest";
import { setBottomLoading } from "@/redux/actions/tools/ffmpegToolkitActions";
import { setError } from "@/redux/reducers/errorReducer";

const FFMPEG_API_URL = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
const FFMPEG_TIMEOUT_MS =
  Number(import.meta.env.VITE_FFMPEG_TIMEOUT_MS) || 300000;

const RECONNECT_DELAY_MS = 3000;
const RECONNECT_WINDOW_MS = 180000;

const UPLOAD_MAX_RETRIES = 4;
const UPLOAD_SERVER_ERROR_STATUSES = [500, 502, 504];
const UPLOAD_SERVER_AFTER_ERROR_MAX_RETRIES = 3;

const UPLOAD_BACKOFF_BASE_MS = 2000;
const UPLOAD_BACKOFF_MAX_MS = 30000;
const UPLOAD_RETRY_AFTER_MAX_MS = 60000;

const JOB_ERROR_MESSAGES = {
  processing_failed:
    "The media could not be processed. The file may be corrupted or unsupported.",
  timeout:
    "The processing took too long. Please consider trying on a lighter content.",
  input_not_found: "The uploaded video has expired. Please try again.",
  out_of_memory:
    "The service is currently overloaded. Please try again in a few minutes.",
  worker_lost:
    "The service is currently overloaded. Please try again in a few minutes.",
  storage_error:
    "A storage error occurred on the server. Please try again in a few minutes.",
  failure: "An unexpected server error occurred. Please try again.",
};

// Retry-After is either a number of seconds or an HTTP date.
const parseRetryAfterMs = (value) => {
  if (!value) return 0;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(value);
  return Number.isNaN(date) ? 0 : Math.max(0, date - Date.now());
};

export const getNameFromFileName = (name) => name.split(".")[0];

export const triggerBrowserDownload = (url, filename) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

const useFfmpegService = () => {
  const dispatch = useDispatch();
  const authenticatedRequest = useAuthenticatedRequest();
  const authenticatedFetch = useAuthenticatedFetch();

  // Streams the original video to the API, returns its inputId.
  // Retries on 503 (service saturated, 4 retries) and 500/502/504 (3 retries), honoring
  // Retry-After with a bounded exponential backoff.
  const uploadInput = async (file) => {
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FFMPEG_TIMEOUT_MS);
      let res;
      try {
        res = await authenticatedFetch(`${FFMPEG_API_URL}api/ffmpeg/upload`, {
          method: "POST",
          headers: { "Content-Type": file.type || "video/mp4" },
          body: file,
          duplex: "half",
          signal: controller.signal,
        });
      } catch (error) {
        if (error.name === "AbortError")
          throw new Error("The upload timed out. Please try again.");
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }

      const maxRetries =
        res.status === 503
          ? UPLOAD_MAX_RETRIES
          : UPLOAD_SERVER_ERROR_STATUSES.includes(res.status)
            ? UPLOAD_SERVER_AFTER_ERROR_MAX_RETRIES
            : -1;
      if (maxRetries >= 0) {
        if (attempt >= maxRetries) {
          if (res.status === 503)
            throw new Error(JOB_ERROR_MESSAGES.out_of_memory);
          throw new Error(`API error: ${res.status}`);
        }
        const delay = Math.max(
          parseRetryAfterMs(res.headers.get("Retry-After")),
          Math.min(
            UPLOAD_BACKOFF_BASE_MS * 2 ** attempt,
            UPLOAD_BACKOFF_MAX_MS,
          ),
        );
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(delay, UPLOAD_RETRY_AFTER_MAX_MS)),
        );
        continue;
      }
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return (await res.json()).inputId;
    }
  };

  // Enqueues a job on an already uploaded input, returns its jobId.
  const createJob = async ({ type, inputId, params }) => {
    const res = await authenticatedFetch(`${FFMPEG_API_URL}api/ffmpeg/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, inputId, params }),
    });
    if (!res.ok) {
      const error = new Error(`API error: ${res.status}`);
      error.status = res.status;
      throw error;
    }
    return (await res.json()).jobId;
  };

  // One SSE connection on a job until it is completed, returns { fileId } or { inputId } (cut).
  // The timeout only runs while the job is processing: waiting in the queue is not bounded.
  // Errors flagged `final` must not be retried (job failure, timeout, 4xx).
  const readJobEventsOnce = async (jobId, onProgress, defaultError) => {
    const controller = new AbortController();
    let timeoutId = null;
    const stopTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = null;
    };
    const startTimer = () => {
      if (!timeoutId)
        timeoutId = setTimeout(() => controller.abort(), FFMPEG_TIMEOUT_MS);
    };

    try {
      const res = await authenticatedFetch(
        `${FFMPEG_API_URL}api/ffmpeg/jobEvents?jobId=${jobId}`,
        {
          method: "POST",
          headers: { Accept: "text/event-stream" },
          signal: controller.signal,
        },
      );
      if (!res.ok) {
        const error = new Error(`API error: ${res.status}`);
        error.final = res.status >= 400 && res.status < 500;
        throw error;
      }

      let output = null;
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const rawEvent of events) {
          const line = rawEvent.trim();
          if (!line.startsWith("data:")) continue;

          const data = JSON.parse(line.replace(/^data:\s*/, ""));
          if (data.status === "queued") stopTimer();
          else startTimer();
          if (onProgress) onProgress(data);
          if (data.status === "error") {
            const error = new Error(
              JOB_ERROR_MESSAGES[data.error] || data.error || defaultError,
            );
            error.final = true;
            // Lets callers re-upload an expired input (see cutVideo).
            if (data.error === "input_not_found") error.status = 404;
            throw error;
          }
          if (data.status === "completed")
            output = { fileId: data.fileId, inputId: data.inputId };
        }
      }

      if (!output?.fileId && !output?.inputId)
        throw new Error("Channel closed without receiving the result.");
      return output;
    } catch (error) {
      if (error.name === "AbortError") {
        const timeoutError = new Error(
          "The request timed out. Please try again.",
        );
        timeoutError.final = true;
        throw timeoutError;
      }
      throw error;
    } finally {
      stopTimer();
    }
  };

  // The job state lives on the server: if the connection drops (network, API restart),
  // reopen the stream, which first replays the current state of the job.
  const readJobEvents = async (jobId, onProgress, defaultError) => {
    const startedAt = Date.now();
    while (true) {
      try {
        return await readJobEventsOnce(jobId, onProgress, defaultError);
      } catch (error) {
        const canRetry =
          !error.final && Date.now() - startedAt < RECONNECT_WINDOW_MS;
        if (!canRetry) throw error;
        await new Promise((resolve) => setTimeout(resolve, RECONNECT_DELAY_MS));
      }
    }
  };

  // Enqueues a job and follows it until its result is available.
  const runJob = async (
    { type, inputId, params },
    onProgress,
    defaultError,
  ) => {
    const jobId = await createJob({ type, inputId, params });
    return readJobEvents(jobId, onProgress, defaultError);
  };

  // idType: "fileId" for a deliverable, "inputId" for an input / cut result.
  const downloadBlobFromApi = async (
    id,
    defaultContentType = "application/octet-stream",
    idType = "fileId",
  ) => {
    try {
      const response = await authenticatedRequest({
        method: "GET",
        url: `${FFMPEG_API_URL}api/ffmpeg/download?${idType}=${id}`,
        responseType: "blob",
        timeout: FFMPEG_TIMEOUT_MS,
      });
      const contentType =
        response.headers["content-type"] || defaultContentType;
      return new Blob([response.data], { type: contentType });
    } catch (error) {
      const message =
        error.code === "ECONNABORTED"
          ? "The request timed out. Please try again."
          : error.message;
      dispatch(setBottomLoading(false));
      dispatch(setError(message));
      throw new Error(message);
    }
  };

  const downloadTextFromApi = async (fileId) => {
    try {
      const response = await authenticatedRequest({
        method: "GET",
        url: `${FFMPEG_API_URL}api/ffmpeg/download?fileId=${fileId}`,
        responseType: "text",
        timeout: FFMPEG_TIMEOUT_MS,
      });
      return response.data;
    } catch (error) {
      const message =
        error.code === "ECONNABORTED"
          ? "The request timed out. Please try again."
          : error.message;
      dispatch(setBottomLoading(false));
      dispatch(setError(message));
      throw new Error(message);
    }
  };

  return {
    uploadInput,
    createJob,
    readJobEvents,
    runJob,
    downloadBlobFromApi,
    downloadTextFromApi,
  };
};

export default useFfmpegService;
