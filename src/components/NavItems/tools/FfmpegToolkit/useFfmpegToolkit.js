import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useUrlOrFile } from "@/Hooks/useUrlOrFile";
import useAuthenticatedRequest from "@/components/Shared/Authentication/useAuthenticatedRequest";
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
  setIframes,
} from "@/redux/actions/tools/ffmpegToolkitActions";
import { setError } from "@/redux/reducers/errorReducer";
import { setHiyaFile } from "@/redux/reducers/tools/hiyaReducer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import fr from "dayjs/locale/fr";
import JSZip from "jszip";

//in order to create an EventSource with classical fetch options

const useFfmpegToolkit = () => {
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const isLoading = useSelector((state) => state.ffmpegToolkit.loading);
  const role = useSelector((state) => state.userSession.user.roles);
  const result = useSelector((state) => state.ffmpegToolkit.result);
  const url = useSelector((state) => state.ffmpegToolkit.url);
  const beginCutTime = useSelector((state) => state.ffmpegToolkit.beginCutTime);
  const endCutTime = useSelector((state) => state.ffmpegToolkit.endCutTime);
  const iframes = useSelector((state) => state.ffmpegToolkit.iframes);
  const accessToken = useSelector((state) => state.userSession?.accessToken);

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

  const authenticatedRequest = useAuthenticatedRequest();

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
    dispatch(setIframes(null));
    dispatch(setFfmpegToolkitLoading(true));

    try {
      const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;

      const ffmpegExtractVideoRequest = {
        method: "POST",
        url: `${apiUrl}api/ffmpeg/extractvideo?startTime=${startTime}&endTime=${endTime}`,
        headers: { "Content-Type": "video/mp4" },
        data: videoFile,
        responseType: "blob",
      };

      const res = await authenticatedRequest(ffmpegExtractVideoRequest);

      const contentType = res.headers["content-type"] || "video/mp4";
      const resultUrl = URL.createObjectURL(
        new Blob([res.data], { type: contentType }),
      );
      dispatch(setFfmpegToolkitResult({ url: resultUrl }));
    } catch (e) {
      dispatch(setError(e.message));
    }
    dispatch(setFfmpegToolkitLoading(false));
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
    dispatch(resetFfmpegToolkit());
  };

  const getAudioFile = async (fileId) => {
    const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
    const downloadResponse = await authenticatedRequest({
      method: "GET",
      url: `${apiUrl}api/ffmpeg/download?fileId=${fileId}`,
      responseType: "blob",
    });

    const contentType =
      downloadResponse.headers["content-type"] || "audio/mpeg";
    return new Blob([downloadResponse.data], { type: contentType });
  };

  const fetchAudioEventSource = async (onProgress) => {
    const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
    const sseHeaders = {
      "Content-Type": "video/mp4",
      Accept: "text/event-stream",
    };
    if (accessToken) sseHeaders["Authorization"] = `Bearer ${accessToken}`;

    const res = await fetch(
      `${apiUrl}api/ffmpeg/extractaudio?startTime=${beginCutTime}&endTime=${endCutTime}&wantsStream=true`,
      { method: "POST", headers: sseHeaders, body: videoFile, duplex: "half" },
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
          throw new Error(data.error || "Audio processing failed");
        if (data.status === "completed" && data.fileId) fileId = data.fileId;
      }
    }

    if (!fileId) throw new Error("Flux terminé sans réception du fileId.");
    return await getAudioFile(fileId);
  };

  const getNameFromFileName = (fileName) => {
    const tabFileName = fileName.split(".");
    return tabFileName[0];
  };

  const handleDownloadAudio = async () => {
    dispatch(setBottomLoading(true));
    try {
      const blob = await fetchAudioEventSource((data) => {
        console.log("Message en temps réel :", data);

        if (data.progress) {
          console.log(data.progress);
        }
      });

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
        const res = await authenticatedRequest({
          method: "POST",
          url: `${apiUrl}api/ffmpeg/extractvideo?${params.toString()}`,
          headers: { "Content-Type": "video/mp4" },
          data: videoFile,
          responseType: "blob",
        });

        const contentType = res.headers["content-type"] || "video/mp4";
        downloadUrl = URL.createObjectURL(
          new Blob([res.data], { type: contentType }),
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
      const blob = await fetchAudioEventSource();
      const hiyaUrl = URL.createObjectURL(blob);
      const name = getNameFromFileName(fileName);
      dispatch(setHiyaFile({ name: `${name}_extract.mp3`, url: hiyaUrl }));
      navigate("/app/tools/hiya");
    } catch (error) {
      dispatch(setError(error));
    }
  };

  const handleGetIframes = async () => {
    dispatch(setBottomLoading(true));
    try {
      const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
      const videoBlob = await fetch(result).then((r) => r.blob());
      const res = await authenticatedRequest({
        method: "POST",
        url: `${apiUrl}api/ffmpeg/extractIframes`,
        headers: { "Content-Type": "video/mp4" },
        data: videoBlob,
      });
      const { frames } = res.data;
      dispatch(setIframes(frames));
      dispatch(setBottomLoading(false));
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error));
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
    handleGetIframes,
    handleDownloadIframes,
  };
};

export default useFfmpegToolkit;
