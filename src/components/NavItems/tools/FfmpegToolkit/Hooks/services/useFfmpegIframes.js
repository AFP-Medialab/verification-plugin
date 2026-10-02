import { useDispatch, useSelector } from "react-redux";

import {
  setBottomLoading,
  setIframes,
  setProgress,
} from "@/redux/actions/tools/ffmpegToolkitActions";
import { setError } from "@/redux/reducers/errorReducer";
import JSZip from "jszip";

import useFfmpegService from "../useFfmpegSharedServices";

const useFfmpegIframes = () => {
  const dispatch = useDispatch();
  const { fetchCurrentVideoBlob, startEventSourceJob, downloadTextFromApi } =
    useFfmpegService();

  const iframes = useSelector((state) => state.ffmpegToolkit.iframes);
  const fileName = useSelector((state) => state.ffmpegToolkit.fileName) ?? "";

  const handleGetIframes = async () => {
    dispatch(setBottomLoading(true));
    try {
      const videoBlob = await fetchCurrentVideoBlob();
      const fileId = await startEventSourceJob(
        "api/ffmpeg/extractIframes?wantsStream=true",
        videoBlob,
        (data) => {
          if (data.progress) dispatch(setProgress(data.progress));
        },
        "Iframes extraction failed",
      );
      const text = await downloadTextFromApi(fileId);
      dispatch(setIframes(JSON.parse(text).frames));
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
