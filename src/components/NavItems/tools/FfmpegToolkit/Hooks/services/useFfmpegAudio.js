import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setBottomLoading,
  setProgress,
} from "@/redux/actions/tools/ffmpegToolkitActions";
import { setError } from "@/redux/reducers/errorReducer";
import { setHiyaFile } from "@/redux/reducers/tools/hiyaReducer";

import useFfmpegService, {
  getNameFromFileName,
  triggerBrowserDownload,
} from "../useFfmpegSharedServices";

const useFfmpegAudio = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fetchCurrentVideoBlob, startEventSourceJob, downloadBlobFromApi } =
    useFfmpegService();

  const fileName = useSelector((state) => state.ffmpegToolkit.fileName);

  const onProgress = (data) => {
    if (data.progress) dispatch(setProgress(data.progress));
  };

  const fetchAudioBlob = async (onProgressCb) => {
    try {
      const videoBlob = await fetchCurrentVideoBlob();
      const fileId = await startEventSourceJob(
        "api/ffmpeg/extractaudio?wantsStream=true",
        videoBlob,
        onProgressCb,
        "Audio processing failed",
      );
      return await downloadBlobFromApi(fileId, "audio/mpeg");
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
      throw error;
    }
  };

  const handleDownloadAudio = async () => {
    dispatch(setBottomLoading(true));
    try {
      const blob = await fetchAudioBlob(onProgress);
      const audioUrl = URL.createObjectURL(blob);
      const name = getNameFromFileName(fileName);
      triggerBrowserDownload(audioUrl, `${name}_extract.mp3`);
      URL.revokeObjectURL(audioUrl);
      dispatch(setBottomLoading(false));
      dispatch(setProgress(0));
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
    }
  };

  const handleGoToHiya = async () => {
    try {
      const blob = await fetchAudioBlob();
      const hiyaUrl = URL.createObjectURL(blob);
      const name = getNameFromFileName(fileName);
      dispatch(setHiyaFile({ name: `${name}_extract.mp3`, url: hiyaUrl }));
      navigate("/app/tools/hiya");
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return { handleDownloadAudio, handleGoToHiya };
};

export default useFfmpegAudio;
