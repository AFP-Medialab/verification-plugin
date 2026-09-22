import { useDispatch, useSelector } from "react-redux";

import useAuthenticatedRequest from "@/components/Shared/Authentication/useAuthenticatedRequest";
import {
  setBottomLoading,
  setIframes,
  setProgress,
} from "@/redux/actions/tools/ffmpegToolkitActions";
import { setError } from "@/redux/reducers/errorReducer";
import JSZip from "jszip";

const useFfmpegIframes = () => {
  const dispatch = useDispatch();
  const authenticatedRequest = useAuthenticatedRequest();

  const result = useSelector((state) => state.ffmpegToolkit.result);
  const iframes = useSelector((state) => state.ffmpegToolkit.iframes);
  const fileName = useSelector((state) => state.ffmpegToolkit.fileName) ?? "";
  const accessToken = useSelector((state) => state.userSession?.accessToken);

  const progress = useSelector((state) => state.ffmpegToolkit.progress);

  const getIframesFile = async (fileId) => {
    try {
      const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
      const downloadResponse = await authenticatedRequest({
        method: "GET",
        url: `${apiUrl}api/ffmpeg/download?fileId=${fileId}`,
        responseType: "text",
      });
      return JSON.parse(downloadResponse.data).frames;
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
      throw error;
    }
  };

  const fetchIframesEventSource = async (onProgress) => {
    try {
      const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
      const sseHeaders = {
        "Content-Type": "video/mp4",
        Accept: "text/event-stream",
      };
      if (accessToken) sseHeaders["Authorization"] = `Bearer ${accessToken}`;

      const videoBlob = await fetch(result).then((r) => r.blob());
      const res = await fetch(
        `${apiUrl}api/ffmpeg/extractIframes?wantsStream=true`,
        {
          method: "POST",
          headers: sseHeaders,
          body: videoBlob,
          duplex: "half",
        },
      );

      if (!res.ok) throw new Error(`API error: ${res.status}`);

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
            throw new Error(data.error || "Iframes extraction failed");
          if (data.status === "completed" && data.fileId) fileId = data.fileId;
        }
      }

      if (!fileId) throw new Error("Flux terminé sans réception du fileId.");
      return await getIframesFile(fileId);
    } catch (error) {
      console.log(error);
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
      throw error;
    }
  };

  const handleGetIframes = async () => {
    dispatch(setBottomLoading(true));
    try {
      const frames = await fetchIframesEventSource((data) => {
        console.log("Message en temps réel :", data);
        if (data.progress) {
          dispatch(setProgress(data.progress));
        }
      });
      dispatch(setIframes(frames));
      dispatch(setBottomLoading(false));
      dispatch(setProgress(0));
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
    }
  };

  const handleDownloadIframes = async () => {
    try {
      if (!iframes || iframes.length === 0) return;
      const folderName = fileName
        ? fileName.replace(/\.[^.]+$/, "")
        : "iframes";
      const zip = new JSZip();
      const folder = zip.folder(folderName);
      iframes.forEach((frame) => {
        const binaryStr = atob(frame.data);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++)
          bytes[i] = binaryStr.charCodeAt(i);
        folder.file(frame.filename, bytes, { binary: true });
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${folderName}_iframes.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return { handleGetIframes, handleDownloadIframes };
};

export default useFfmpegIframes;
