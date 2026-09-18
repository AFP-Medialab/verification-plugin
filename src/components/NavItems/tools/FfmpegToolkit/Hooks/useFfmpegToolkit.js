import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useUrlOrFile } from "@/Hooks/useUrlOrFile";
import { resetFfmpegToolkit } from "@/redux/actions/tools/ffmpegToolkitActions";

import useFfmpegAudio from "./useFfmpegAudio";
import useFfmpegIframes from "./useFfmpegIframes";
import useFfmpegVideo from "./useFfmpegVideo";

const useFfmpegToolkit = () => {
  const isLoading = useSelector((state) => state.ffmpegToolkit.loading);
  const result = useSelector((state) => state.ffmpegToolkit.result);
  const url = useSelector((state) => state.ffmpegToolkit.url);
  const storedFile = useSelector((state) => state.ffmpegToolkit.file);

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

  const { handleDownloadAudio, handleGoToHiya } = useFfmpegAudio();
  const { preprocessVideo, handleSubmit, handleDownloadVideo } = useFfmpegVideo(
    { videoFile, sliderRange, formatSeconds, setVideoFile, setType },
  );
  const { handleGetIframes, handleDownloadIframes } = useFfmpegIframes();

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
