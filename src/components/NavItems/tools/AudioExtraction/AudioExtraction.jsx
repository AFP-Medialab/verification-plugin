import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AudioFile from "@mui/icons-material/AudioFile";

import { useUrlOrFile } from "@/Hooks/useUrlOrFile";
import StringFileUploadField from "@/components/Shared/StringFileUploadField";
import { preprocessFileUpload } from "@/components/Shared/Utils/fileUtils";
import {
  resetAudioExtraction,
  setAudioExtractionLoading,
  setAudioExtractionResult,
  setAudioExtractionUrl,
} from "@/redux/actions/tools/audioExtractionActions";
import { setError } from "@/redux/reducers/errorReducer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import audioBufferToWav from "audiobuffer-to-wav";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";

const AudioExtraction = () => {
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const isLoading = useSelector((state) => state.audioExtraction.loading);
  const role = useSelector((state) => state.userSession.user.roles);
  const result = useSelector((state) => state.audioExtraction.result);
  const url = useSelector((state) => state.audioExtraction.url);
  const [input = url || "", setInput, videoFile, setVideoFile] = useUrlOrFile();
  const [type, setType] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    dispatch(setAudioExtractionLoading(true));
    // in order to free space for the new URL incoming
    if (result) {
      URL.revokeObjectURL(result);
    }
    let audioUrl = null;
    if (type === "local" && videoFile) {
      try {
        audioUrl = URL.createObjectURL(videoFile);

        dispatch(setAudioExtractionResult({ url: audioUrl }));
      } catch (error) {
        console.error("Erreur lors de l'extraction audio :", error);
        dispatch(setAudioExtractionLoading(false));
      }
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
    dispatch(resetAudioExtraction());
  };

  const handleDownload = () => {
    if (!result) return;

    const link = document.createElement("a");
    link.href = result;

    link.download = `audio_extrait_${Date.now()}.mp3`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <HeaderTool
          name="Audio extraction"
          description="A tool to extract audio from a video"
          icon={
            <AudioFile
              style={{
                fill: "var(--mui-palette-primary-main)",
                height: "40px",
                width: "auto",
              }}
            />
          }
        />

        <Card variant="outlined">
          <Box sx={{ p: 4 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <StringFileUploadField
                labelKeyword="Please upload a file from your local storage"
                placeholderKeyword="Insert the file"
                submitButtonKeyword="Extract"
                localFileKeyword="Local file"
                urlInput={input}
                setUrlInput={setInput}
                fileInput={videoFile}
                setFileInput={setVideoFile}
                handleSubmit={handleSubmit}
                fileInputTypesAccepted={"video/*"}
                handleCloseSelectedFile={resetState}
                preprocessLocalFile={preprocessVideo}
                isParentLoading={isLoading}
                handleClearUrl={resetState}
                disableUrlInput={true}
                urlInputTestId="audioextraction-input"
                submitButtonTestId="audioextraction-submit"
              />
            </form>

            {isLoading && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress />
              </Box>
            )}
          </Box>
        </Card>
        {result && (
          <Card>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                p: 3,
                gap: 3,
              }}
            >
              <audio controls src={result}></audio>
              <Button
                color="primary"
                variant="contained"
                onClick={handleDownload}
              >
                Download file
              </Button>
            </Box>
          </Card>
        )}
      </Stack>
    </Box>
  );
};

export default AudioExtraction;
