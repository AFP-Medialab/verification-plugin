import { useDispatch, useSelector } from "react-redux";

import useAuthenticatedFetch from "@/components/Shared/Authentication/useAuthenticatedFetch";
import useAuthenticatedRequest from "@/components/Shared/Authentication/useAuthenticatedRequest";
import { setBottomLoading } from "@/redux/actions/tools/ffmpegToolkitActions";
import { setError } from "@/redux/reducers/errorReducer";

const FFMPEG_API_URL = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
const FFMPEG_TIMEOUT_MS =
  Number(import.meta.env.VITE_FFMPEG_TIMEOUT_MS) || 300000;

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
  const result = useSelector((state) => state.ffmpegToolkit.result);

  const fetchCurrentVideoBlob = () => fetch(result).then((r) => r.blob());

  // Reads an SSE response stream until the server closes it, returns fileId.
  const readEventStream = async (res, onProgress, defaultError) => {
    let fileId = null;
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
        if (line.startsWith(":")) continue;
        if (!line.startsWith("data:")) continue;

        const data = JSON.parse(line.replace(/^data:\s*/, ""));
        if (onProgress) onProgress(data);
        if (data.status === "error")
          throw new Error(data.error || defaultError);
        if (data.status === "completed" && data.fileId) fileId = data.fileId;
      }
    }

    if (!fileId) throw new Error("Channel closed without receiving fileId.");
    return fileId;
  };

  // Posts a video blob to a ffmpeg SSE endpoint and reads the stream, returns fileId.
  const startEventSourceJob = async (
    endpoint,
    body,
    onProgress,
    defaultError,
  ) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FFMPEG_TIMEOUT_MS);
    try {
      const res = await authenticatedFetch(`${FFMPEG_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "video/mp4", Accept: "text/event-stream" },
        body,
        duplex: "half",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return await readEventStream(res, onProgress, defaultError);
    } catch (error) {
      if (error.name === "AbortError")
        throw new Error("The request timed out. Please try again.");
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const downloadBlobFromApi = async (
    fileId,
    defaultContentType = "application/octet-stream",
  ) => {
    try {
      const response = await authenticatedRequest({
        method: "GET",
        url: `${FFMPEG_API_URL}api/ffmpeg/download?fileId=${fileId}`,
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
    fetchCurrentVideoBlob,
    startEventSourceJob,
    downloadBlobFromApi,
    downloadTextFromApi,
  };
};

export default useFfmpegService;
