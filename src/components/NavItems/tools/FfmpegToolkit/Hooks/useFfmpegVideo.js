import { useDispatch, useSelector } from "react-redux";

import useAuthenticatedRequest from "@/components/Shared/Authentication/useAuthenticatedRequest";
import { preprocessFileUpload } from "@/components/Shared/Utils/fileUtils";
import {
  setBeginCutTime,
  setBottomLoading,
  setEndCutTime,
  setFfmpegToolkitFile,
  setFfmpegToolkitFileName,
  setFfmpegToolkitLoading,
  setFfmpegToolkitResult,
  setIframes,
  setProgress,
} from "@/redux/actions/tools/ffmpegToolkitActions";
import { setError } from "@/redux/reducers/errorReducer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const useFfmpegVideo = ({
  videoFile,
  sliderRange,
  formatSeconds,
  setVideoFile,
  setType,
}) => {
  const dispatch = useDispatch();
  const authenticatedRequest = useAuthenticatedRequest();
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const role = useSelector((state) => state.userSession.user.roles);
  const result = useSelector((state) => state.ffmpegToolkit.result);
  const fileName = useSelector((state) => state.ffmpegToolkit.fileName) ?? "";
  const accessToken = useSelector((state) => state.userSession?.accessToken);

  const progress = useSelector((state) => state.ffmpegToolkit.progress);

  const getNameFromFileName = (name) => name.split(".")[0];

  const preprocessingSuccess = (file) => {
    setVideoFile(file);
    setType("local");
    return file;
  };

  const preprocessingError = () => {
    dispatch(setError(keywordWarning("warning_file_too_big")));
  };

  const preprocessVideo = (file) => {
    return preprocessFileUpload(
      file,
      role,
      undefined,
      preprocessingSuccess,
      preprocessingError,
    );
  };

  const getVideoFile = async (fileId) => {
    try {
      const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
      const downloadResponse = await authenticatedRequest({
        method: "GET",
        url: `${apiUrl}api/ffmpeg/download?fileId=${fileId}`,
        responseType: "blob",
      });
      const contentType =
        downloadResponse.headers["content-type"] || "video/mp4";
      return new Blob([downloadResponse.data], { type: contentType });
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
      throw error;
    }
  };

  const fetchVideoEventSource = async (
    onProgress,
    videoToSend,
    {
      startTime = null,
      endTime = null,
      isCompressed = null,
      isScaled = null,
    } = {},
  ) => {
    try {
      const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
      const sseHeaders = {
        "Content-Type": "video/mp4",
        Accept: "text/event-stream",
      };
      if (accessToken) sseHeaders["Authorization"] = `Bearer ${accessToken}`;

      const params = new URLSearchParams();
      if (startTime !== null) params.append("startTime", startTime);
      if (endTime !== null) params.append("endTime", endTime);
      if (isCompressed !== null) params.append("isCompressed", isCompressed);
      if (isScaled !== null) params.append("isScaled", isScaled);
      params.append("wantsStream", "true");

      const url = `${apiUrl}api/ffmpeg/extractvideo?${params.toString()}`;

      const res = await fetch(url, {
        method: "POST",
        headers: sseHeaders,
        body: videoToSend,
        duplex: "half",
      });

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
            throw new Error(data.error || "video processing failed");
          if (data.status === "completed" && data.fileId) fileId = data.fileId;
        }
      }

      if (!fileId) throw new Error("Flux terminé sans réception du fileId.");
      return await getVideoFile(fileId);
    } catch (error) {
      console.log(error);
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!videoFile) return;

    dispatch(setFfmpegToolkitFile(videoFile));
    dispatch(setFfmpegToolkitFileName(videoFile.name));

    const startTime = formatSeconds(sliderRange[0]);
    const endTime = formatSeconds(sliderRange[1]);

    dispatch(setBeginCutTime(startTime));
    dispatch(setEndCutTime(endTime));
    dispatch(setIframes(null));
    dispatch(setFfmpegToolkitLoading(true));

    try {
      const blob = await fetchVideoEventSource(
        (data) => {
          console.log("Message en temps réel :", data);
          if (data.progress) {
            dispatch(setProgress(data.progress));
          }
        },
        videoFile,
        { startTime: startTime, endTime: endTime },
      );

      const resultUrl = URL.createObjectURL(blob);

      dispatch(setFfmpegToolkitResult({ url: resultUrl }));
    } catch (e) {
      dispatch(setError(e.message));
    }
    dispatch(setFfmpegToolkitLoading(false));
    dispatch(setProgress(0));
  };

  const handleDownloadVideo = async ({ compress, scaleDown } = {}) => {
    try {
      const name = getNameFromFileName(fileName);
      const suffix = [compress && "compressed", scaleDown && "scaled"]
        .filter(Boolean)
        .join("_");

      let downloadUrl = result;

      if (compress || scaleDown) {
        dispatch(setBottomLoading(true));

        const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
        const videoBlob = await fetch(result).then((r) => r.blob());
        const blob = await fetchVideoEventSource(
          (data) => {
            console.log("Message en temps réel :", data);
            if (data.progress) {
              dispatch(setProgress(data.progress));
            }
          },
          videoBlob,
          { isCompressed: compress, isScaled: scaleDown },
        );

        downloadUrl = URL.createObjectURL(blob);
        dispatch(setBottomLoading(false));
        dispatch(setProgress(0));
      }

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${name}_extract${suffix ? `_${suffix}` : ""}.mp4`;
      a.click();

      if (compress || scaleDown) URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
    }
  };

  return { preprocessVideo, handleSubmit, handleDownloadVideo };
};

export default useFfmpegVideo;
