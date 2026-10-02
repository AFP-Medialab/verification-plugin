import { useDispatch, useSelector } from "react-redux";

import useAuthenticatedFetch from "@/components/Shared/Authentication/useAuthenticatedFetch";
import useAuthenticatedRequest from "@/components/Shared/Authentication/useAuthenticatedRequest";
import { setBottomLoading } from "@/redux/actions/tools/ffmpegToolkitActions";
import { setError } from "@/redux/reducers/errorReducer";

const FFMPEG_API_URL = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;

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
    console.log(`Starting ffmpeg job: ${endpoint}`);
    const res = await authenticatedFetch(`${FFMPEG_API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "video/mp4", Accept: "text/event-stream" },
      body,
      duplex: "half",
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return readEventStream(res, onProgress, defaultError);
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
      });
      const contentType =
        response.headers["content-type"] || defaultContentType;
      return new Blob([response.data], { type: contentType });
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
      throw error;
    }
  };

  const downloadTextFromApi = async (fileId) => {
    try {
      const response = await authenticatedRequest({
        method: "GET",
        url: `${FFMPEG_API_URL}api/ffmpeg/download?fileId=${fileId}`,
        responseType: "text",
      });
      return response.data;
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
      throw error;
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
