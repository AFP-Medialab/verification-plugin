import { useDispatch, useSelector } from "react-redux";

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

import {
  preprocessExtract,
  preprocessFfmpegVideoUpload,
} from "../../Utils/ffmpegPreprocessFile";
import useFfmpegService, {
  getNameFromFileName,
  triggerBrowserDownload,
} from "./useFfmpegSharedServices";

const useFfmpegVideo = ({
  videoFile,
  sliderRange,
  formatSeconds,
  setVideoFile,
  setType,
  videoDuration,
}) => {
  const dispatch = useDispatch();
  const { startEventSourceJob, downloadBlobFromApi } = useFfmpegService();
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const result = useSelector((state) => state.ffmpegToolkit.result);
  const fileName = useSelector((state) => state.ffmpegToolkit.fileName) ?? "";

  const keyword = i18nLoadNamespace("components/NavItems/tools/FfmpegToolkit");

  const preprocessingSuccess = (file) => {
    setVideoFile(file);
    setType("local");
    return file;
  };

  const preprocessingError = () => {
    dispatch(setError(keywordWarning("warning_file_too_big")));
  };

  const preprocessVideo = (file) => {
    return preprocessFfmpegVideoUpload(
      file,
      undefined,
      preprocessingSuccess,
      preprocessingError,
    );
  };

  // Sends a video blob to an SSE endpoint and returns the resulting video blob.
  const fetchVideoBlob = async (endpoint, videoToSend, onProgress, params) => {
    const query = new URLSearchParams({ wantsStream: "true", ...params });
    try {
      const fileId = await startEventSourceJob(
        `api/ffmpeg/${endpoint}?${query.toString()}`,
        videoToSend,
        onProgress,
        "Video processing failed",
      );
      return await downloadBlobFromApi(fileId, "video/mp4");
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
      throw error;
    }
  };

  const cutVideo = async (videoToSend, onProgress, startTime, endTime) => {
    const isExtractTooBig = preprocessExtract(
      videoToSend.size,
      startTime,
      endTime,
      videoDuration,
    );
    if (isExtractTooBig) {
      const msg = keyword("ffmpeg_toolkit_error_extract_too_large");
      dispatch(setError(msg));
      throw new Error(msg);
    }
    return fetchVideoBlob("cutVideo", videoToSend, onProgress, {
      startTime,
      endTime,
    });
  };

  const downloadVideo = (videoToSend, onProgress, options) =>
    fetchVideoBlob("downloadVideo", videoToSend, onProgress, options);

  const onProgress = (data) => {
    if (data.progress) dispatch(setProgress(data.progress));
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
      const blob = await cutVideo(videoFile, onProgress, startTime, endTime);
      dispatch(setFfmpegToolkitResult({ url: URL.createObjectURL(blob) }));
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
        const videoBlob = await fetch(result).then((r) => r.blob());
        const blob = await downloadVideo(videoBlob, onProgress, {
          isCompressed: !!compress,
          isScaled: !!scaleDown,
        });
        downloadUrl = URL.createObjectURL(blob);
        dispatch(setBottomLoading(false));
        dispatch(setProgress(0));
      }

      triggerBrowserDownload(
        downloadUrl,
        `${name}_extract${suffix ? `_${suffix}` : ""}.mp4`,
      );

      if (compress || scaleDown) URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
    }
  };

  return { preprocessVideo, handleSubmit, handleDownloadVideo };
};

export default useFfmpegVideo;
