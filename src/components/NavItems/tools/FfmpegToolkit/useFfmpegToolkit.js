import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useUrlOrFile } from "@/Hooks/useUrlOrFile";
import { preprocessFileUpload } from "@/components/Shared/Utils/fileUtils";
import {
  resetFfmpegToolkit,
  setBeginCutTime,
  setBottomLoading,
  setEndCutTime,
  setFfmpegToolkitFile,
  setFfmpegToolkitFileName,
  setFfmpegToolkitLoading,
  setFfmpegToolkitResult,
  setKeyframes,
} from "@/redux/actions/tools/ffmpegToolkitActions";
import { setError } from "@/redux/reducers/errorReducer";
import { setHiyaFile } from "@/redux/reducers/tools/hiyaReducer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import fr from "dayjs/locale/fr";
import JSZip from "jszip";

const useFfmpegToolkit = () => {
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const isLoading = useSelector((state) => state.ffmpegToolkit.loading);
  const role = useSelector((state) => state.userSession.user.roles);
  const result = useSelector((state) => state.ffmpegToolkit.result);
  const url = useSelector((state) => state.ffmpegToolkit.url);
  const beginCutTime = useSelector((state) => state.ffmpegToolkit.beginCutTime);
  const endCutTime = useSelector((state) => state.ffmpegToolkit.endCutTime);
  const keyframes = useSelector((state) => state.ffmpegToolkit.keyframes);

  const storedFile = useSelector((state) => state.ffmpegToolkit.file);
  const fileName = useSelector((state) => state.ffmpegToolkit.fileName) ?? "";

  const [input = url || "", setInput, videoFile, setVideoFile] = useUrlOrFile();
  const [type, setType] = useState(() =>
    storedFile ? "local" : url ? "url" : "",
  );
  const [sliderRange, setSliderRange] = useState([0, 0]);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoObjectUrl, setVideoObjectUrl] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef(null);
  const prevSliderRef = useRef(sliderRange);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (storedFile && !videoFile) {
      setVideoFile(storedFile);
    }
  }, []);

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
      setVideoObjectUrl(null);
      setCurrentTime(0);
      setIsPlaying(false);
      return;
    }
    const objectUrl = URL.createObjectURL(videoFile);
    setVideoObjectUrl(objectUrl);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const seconds = Math.floor(video.duration);
      setVideoDuration(seconds);
      setSliderRange([0, seconds]);
    };
    video.src = objectUrl;
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [videoFile]);

  useEffect(() => {
    if (!videoRef.current || !videoDuration) return;
    const [prevStart, prevEnd] = prevSliderRef.current;
    const [start, end] = sliderRange;
    if (start !== prevStart) videoRef.current.currentTime = start;
    else if (end !== prevEnd) videoRef.current.currentTime = end;
    prevSliderRef.current = sliderRange;
  }, [sliderRange, videoDuration]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoObjectUrl) return;
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [videoObjectUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
  };

  const handleSeek = (time) => {
    if (videoRef.current) videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleSubmit = async () => {
    if (!videoFile) return;

    dispatch(setFfmpegToolkitFile(videoFile));
    dispatch(setFfmpegToolkitFileName(videoFile.name));

    const startTime = formatSeconds(sliderRange[0]);
    const endTime = formatSeconds(sliderRange[1]);

    dispatch(setBeginCutTime(startTime));
    dispatch(setEndCutTime(endTime));
    dispatch(setKeyframes(null));
    dispatch(setFfmpegToolkitLoading(true));

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
      dispatch(setFfmpegToolkitResult({ url: resultUrl }));
    } catch (e) {
      dispatch(setError(e.message));
      dispatch(setFfmpegToolkitLoading(false));
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
    setCurrentTime(0);
    setIsPlaying(false);
    setKeyframes(null);
    dispatch(resetFfmpegToolkit());
  };

  const fetchAudio = async () => {
    try {
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
    } catch (error) {
      dispatch(setError(error));
    }
  };

  const getNameFromFileName = (fileName) => {
    const tabFileName = fileName.split(".");
    return tabFileName[0];
  };

  const handleDownloadAudio = async () => {
    dispatch(setBottomLoading(true));
    try {
      const blob = await fetchAudio();
      const audioUrl = URL.createObjectURL(blob);

      const name = getNameFromFileName(fileName);

      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `${name}_extract.mp3`;
      a.click();
      URL.revokeObjectURL(audioUrl);
      dispatch(setBottomLoading(false));
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error));
    }
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

        const params = new URLSearchParams({
          startTime: beginCutTime,
          endTime: endCutTime,
        });
        if (compress) params.set("isCompressed", "");
        if (scaleDown) params.set("isScaled", "");

        const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
        const res = await fetch(
          `${apiUrl}/api/ffmpeg/extractvideo?${params.toString()}`,
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
        downloadUrl = URL.createObjectURL(
          new Blob([blob], { type: contentType }),
        );
        dispatch(setBottomLoading(false));
      }

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${name}_extract${suffix ? `_${suffix}` : ""}.mp4`;
      a.click();

      if (compress || scaleDown) URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error));
    }
  };

  const handleGoToHiya = async () => {
    try {
      const blob = await fetchAudio();
      const hiyaUrl = URL.createObjectURL(blob);
      const name = getNameFromFileName(fileName);
      dispatch(setHiyaFile({ name: `${name}_extract.mp3`, url: hiyaUrl }));
      navigate("/app/tools/hiya");
    } catch (error) {
      dispatch(setError(error));
    }
  };

  const handleGetKeyframes = async () => {
    dispatch(setBottomLoading(true));
    try {
      const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
      const videoBlob = await fetch(result).then((r) => r.blob());
      const res = await fetch(`${apiUrl}/api/ffmpeg/extractIframes`, {
        method: "POST",
        headers: { "Content-Type": "video/mp4" },
        body: videoBlob,
        duplex: "half",
      });
      if (!res.ok) {
        dispatch(setBottomLoading(false));
        throw new Error(`API error: ${res.status}`);
      }
      const { frames } = await res.json();
      dispatch(setKeyframes(frames));
      dispatch(setBottomLoading(false));
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error));
    }
  };

  const handleDownloadKeyframes = async () => {
    try {
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
    } catch (error) {
      dispatch(setError(error));
    }
  };

  return {
    isLoading,
    result,
    input,
    setInput,
    videoFile,
    setVideoFile,
    videoObjectUrl,
    videoRef,
    currentTime,
    isPlaying,
    togglePlay,
    handleSeek,
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

export default useFfmpegToolkit;
