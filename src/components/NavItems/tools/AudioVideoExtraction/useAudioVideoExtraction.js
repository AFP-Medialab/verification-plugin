import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useUrlOrFile } from "@/Hooks/useUrlOrFile";
import { preprocessFileUpload } from "@/components/Shared/Utils/fileUtils";
import {
  resetAudioVideoExtraction,
  setAudioVideoExtractionLoading,
  setAudioVideoExtractionResult,
  setBeginCutTime,
  setEndCutTime,
  setKeyframes,
  setKeyframesLoading,
} from "@/redux/actions/tools/audioVideoExtractionActions";
import { setError } from "@/redux/reducers/errorReducer";
import { setHiyaFile } from "@/redux/reducers/tools/hiyaReducer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import fr from "dayjs/locale/fr";
import JSZip from "jszip";

const useAudioVideoExtraction = () => {
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const isLoading = useSelector((state) => state.audioVideoExtraction.loading);
  const role = useSelector((state) => state.userSession.user.roles);
  const result = useSelector((state) => state.audioVideoExtraction.result);
  const url = useSelector((state) => state.audioVideoExtraction.url);
  const beginCutTime = useSelector(
    (state) => state.audioVideoExtraction.beginCutTime,
  );
  const endCutTime = useSelector(
    (state) => state.audioVideoExtraction.endCutTime,
  );
  const keyframes = useSelector(
    (state) => state.audioVideoExtraction.keyframes,
  );

  const [input = url || "", setInput, videoFile, setVideoFile] = useUrlOrFile();
  const [type, setType] = useState("");
  const [sliderRange, setSliderRange] = useState([0, 0]);
  const [videoDuration, setVideoDuration] = useState(0);

  const [fileName, setFileName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formatSeconds = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    if (!videoFile) {
      setVideoDuration(0);
      setSliderRange([0, 0]);
      return;
    }
    const objectUrl = URL.createObjectURL(videoFile);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const seconds = Math.floor(video.duration);
      setVideoDuration(seconds);
      setSliderRange([0, seconds]);
      URL.revokeObjectURL(objectUrl);
    };
    video.src = objectUrl;
  }, [videoFile]);

  const handleSubmit = async () => {
    if (!videoFile) return;

    setFileName(videoFile.name);

    const startTime = formatSeconds(sliderRange[0]);
    const endTime = formatSeconds(sliderRange[1]);

    dispatch(setBeginCutTime(startTime));
    dispatch(setEndCutTime(endTime));
    dispatch(setAudioVideoExtractionLoading(true));

    try {
      const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
      const res = await fetch(
        `${apiUrl}/api/ffmpeg/extractvideo?startTime=${startTime}&endTime=${endTime}`,
        {
          method: "POST",
          headers: { "Content-Type": "video/mp4" },
          body: videoFile,
          duplex: "half",
        },
      );

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const contentType = res.headers.get("content-type") || "video/mp4";
      const blob = await res.blob();
      const resultUrl = URL.createObjectURL(
        new Blob([blob], { type: contentType }),
      );
      dispatch(setAudioVideoExtractionResult({ url: resultUrl }));
    } catch (e) {
      dispatch(setError(e.message));
      dispatch(setAudioVideoExtractionLoading(false));
    }
  };

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

  const resetState = () => {
    setInput("");
    setVideoFile(null);
    setType("");
    setSliderRange([0, 0]);
    setVideoDuration(0);
    setKeyframes(null);
    dispatch(resetAudioVideoExtraction());
  };

  const fetchAudio = async () => {
    const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
    const res = await fetch(
      `${apiUrl}/api/ffmpeg/extractaudio?startTime=${beginCutTime}&endTime=${endCutTime}`,
      {
        method: "POST",
        headers: { "Content-Type": "video/mp4" },
        body: videoFile,
        duplex: "half",
      },
    );
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const contentType = res.headers.get("content-type") || "audio/mpeg";
    const blob = await res.blob();
    return new Blob([blob], { type: contentType });
  };

  const getNameFromFileName = (fileName) => {
    const tabFileName = fileName.split(".");
    return tabFileName[0];
  };

  const handleDownloadAudio = async () => {
    const blob = await fetchAudio();
    const audioUrl = URL.createObjectURL(blob);

    const name = getNameFromFileName(fileName);

    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `${name}_extract.mp3`;
    a.click();
    URL.revokeObjectURL(audioUrl);
  };

  const handleDownloadVideo = () => {
    const name = getNameFromFileName(fileName);
    const a = document.createElement("a");
    a.href = result;
    a.download = `${name}_extract.mp4`;
    a.click();
  };

  const handleGoToHiya = async () => {
    const blob = await fetchAudio();
    const hiyaUrl = URL.createObjectURL(blob);
    const name = getNameFromFileName(fileName);
    dispatch(setHiyaFile({ name: `${name}_extract.mp3`, url: hiyaUrl }));
    navigate("/app/tools/hiya");
  };

  const handleGetKeyframes = async () => {
    dispatch(setKeyframesLoading(true));
    const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
    const videoBlob = await fetch(result).then((r) => r.blob());
    const res = await fetch(`${apiUrl}/api/ffmpeg/extractkeyframes`, {
      method: "POST",
      headers: { "Content-Type": "video/mp4" },
      body: videoBlob,
      duplex: "half",
    });
    if (!res.ok) {
      dispatch(setKeyframesLoading(false));
      throw new Error(`API error: ${res.status}`);
    }
    const { frames } = await res.json();
    dispatch(setKeyframes(frames));
    dispatch(setKeyframesLoading(false));
  };

  const handleDownloadKeyframes = async () => {
    if (!keyframes || keyframes.length === 0) return;
    const folderName = fileName
      ? fileName.replace(/\.[^.]+$/, "")
      : "keyframes";
    const zip = new JSZip();
    const folder = zip.folder(folderName);
    keyframes.forEach((frame) => {
      const binaryStr = atob(frame.data);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++)
        bytes[i] = binaryStr.charCodeAt(i);
      folder.file(frame.filename, bytes, { binary: true });
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${folderName}_keyframes.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return {
    isLoading,
    result,
    input,
    setInput,
    videoFile,
    setVideoFile,
    sliderRange,
    setSliderRange,
    videoDuration,
    formatSeconds,
    handleSubmit,
    preprocessVideo,
    resetState,
    handleDownloadAudio,
    handleDownloadVideo,
    handleGoToHiya,
    handleGetKeyframes,
    handleDownloadKeyframes,
  };
};

export default useAudioVideoExtraction;
