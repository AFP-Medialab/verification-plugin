import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import useAuthenticatedRequest from "@/components/Shared/Authentication/useAuthenticatedRequest";
import { setBottomLoading } from "@/redux/actions/tools/ffmpegToolkitActions";
import { setError } from "@/redux/reducers/errorReducer";
import { setHiyaFile } from "@/redux/reducers/tools/hiyaReducer";

const useFfmpegAudio = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticatedRequest = useAuthenticatedRequest();

  const result = useSelector((state) => state.ffmpegToolkit.result);
  const accessToken = useSelector((state) => state.userSession?.accessToken);
  const fileName = useSelector((state) => state.ffmpegToolkit.fileName) ?? "";

  const getNameFromFileName = (name) => name.split(".")[0];

  const getAudioFile = async (fileId) => {
    try {
      const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
      const downloadResponse = await authenticatedRequest({
        method: "GET",
        url: `${apiUrl}api/ffmpeg/download?fileId=${fileId}`,
        responseType: "blob",
      });
      const contentType =
        downloadResponse.headers["content-type"] || "audio/mpeg";
      return new Blob([downloadResponse.data], { type: contentType });
    } catch (error) {
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
      throw error;
    }
  };

  const fetchAudioEventSource = async (onProgress) => {
    try {
      const apiUrl = import.meta.env.VITE_FFMPEG_YTDLP_API_URL;
      const sseHeaders = {
        "Content-Type": "video/mp4",
        Accept: "text/event-stream",
      };
      if (accessToken) sseHeaders["Authorization"] = `Bearer ${accessToken}`;

      const videoBlob = await fetch(result).then((r) => r.blob());
      const res = await fetch(
        `${apiUrl}api/ffmpeg/extractaudio?wantsStream=true`,
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
            throw new Error(data.error || "Audio processing failed");
          if (data.status === "completed" && data.fileId) fileId = data.fileId;
        }
      }

      if (!fileId) throw new Error("Flux terminé sans réception du fileId.");
      return await getAudioFile(fileId);
    } catch (error) {
      console.log(error);
      dispatch(setBottomLoading(false));
      dispatch(setError(error.message));
      throw error;
    }
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
      dispatch(setError(error.message));
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
      dispatch(setError(error.message));
    }
  };

  return { handleDownloadAudio, handleGoToHiya };
};

export default useFfmpegAudio;
