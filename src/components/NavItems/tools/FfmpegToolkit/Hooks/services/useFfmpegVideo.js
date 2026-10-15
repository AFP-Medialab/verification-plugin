import { useDispatch, useSelector } from "react-redux";

import {
  setBeginCutTime,
  setBottomLoading,
  setEndCutTime,
  setFfmpegCutInputId,
  setFfmpegInputId,
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
  const { uploadInput, runJob, downloadBlobFromApi } = useFfmpegService();
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const result = useSelector((state) => state.ffmpegToolkit.result);
  const storedFile = useSelector((state) => state.ffmpegToolkit.file);
  const storedInputId = useSelector((state) => state.ffmpegToolkit.inputId);
  const cutInputId = useSelector((state) => state.ffmpegToolkit.cutInputId);
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

  // Uploads the original video once; later cuts reuse the same inputId.
  const ensureInputId = async (file, force = false) => {
    if (!force && storedInputId && storedFile === file) return storedInputId;
    const inputId = await uploadInput(file);
    dispatch(setFfmpegInputId(inputId));
    return inputId;
  };

  // Cuts the original video on the server, returns the cut as a blob (and keeps its cutInputId).
  const cutVideo = async (file, onProgress, startTime, endTime) => {
    const isExtractTooBig = preprocessExtract(
      file.size,
      startTime,
      endTime,
      videoDuration,
    );
    if (isExtractTooBig) {
      const msg = keyword("ffmpeg_toolkit_error_extract_too_large");
      dispatch(setError(msg));
      throw new Error(msg);
    }

    const job = (inputId) =>
      runJob(
        { type: "cutVideo", inputId, params: { startTime, endTime } },
        onProgress,
        "Video processing failed",
      );

    try {
      let output;
      try {
        output = await job(await ensureInputId(file));
      } catch (error) {
        // The stored input has expired: upload the file again once.
        if (error.status !== 404) throw error;
        output = await job(await ensureInputId(file, true));
      }
      dispatch(setFfmpegCutInputId(output.inputId));
      return await downloadBlobFromApi(output.inputId, "video/mp4", "inputId");
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
      throw error;
    }
  };

  // Re-encodes the cut (compression / scale) on the server, returns the blob.
  const downloadVideo = async (onProgress, options) => {
    try {
      const { fileId } = await runJob(
        { type: "downloadVideo", inputId: cutInputId, params: options },
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
        const blob = await downloadVideo(onProgress, {
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
