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
import {
  ALL_FORMATS,
  BufferTarget,
  Input,
  Mp4InputFormat,
  Mp4OutputFormat,
  Output,
  Source,
} from "mediabunny";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";

const AudioExtraction = () => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/AudioExtraction",
  );
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const isLoading = useSelector((state) => state.audioExtraction.loading);
  const role = useSelector((state) => state.userSession.user.roles);
  const result = useSelector((state) => state.audioExtraction.result);
  const url = useSelector((state) => state.audioExtraction.url);
  const [input = url || "", setInput, videoFile, setVideoFile] = useUrlOrFile();
  const [type, setType] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!input && !videoFile) return;

    setAudioExtractionLoading(true);
    try {
      // 1. Déterminer la ressource brute
      const rawSource = videoFile ? videoFile : input;

      // 2. Laisser Mediabunny créer le bon wrapper de Source automatiquement
      const wrappedSource = Source.from(rawSource);

      // 3. Initialiser l'entrée
      const mediaInput = new Input({
        source: wrappedSource,
        formats: ALL_FORMATS,
      });

      // 4. Extraire la piste audio principale
      const audioTrack = await mediaInput.getPrimaryAudioTrack();
      if (!audioTrack)
        throw new Error("Aucune piste audio trouvée dans cette vidéo.");

      // 5. Configurer la sortie en mémoire
      const output = new Output({
        format: new Mp4OutputFormat(),
        target: new BufferTarget(),
      });

      output.addAudioTrack(audioTrack);

      await output.start();
      await output.finalize();

      // 6. Récupérer le résultat binaire
      const { buffer } = output.target;
      const audioBlob = new Blob([buffer], { type: "audio/mp4" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Envoi à Redux
      dispatch(setAudioExtractionResult(audioUrl));
    } catch (error) {
      console.error(error);
      dispatch(setError("Erreur lors de l'extraction audio locale."));
    } finally {
      setAudioExtractionLoading(false);
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
    setAudioExtractionResult(null);
    dispatch(resetAudioExtraction());
  };

  const handleDownload = () => {
    // implement the download of the mp3 file
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
                labelKeyword={keyword("audio_extraction_link")}
                placeholderKeyword={keyword("audio_extraction_placeholder")}
                submitButtonKeyword={keyword("submit_button")}
                localFileKeyword={keyword("button_localfile")}
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
        {result && <audio controls src={result}></audio>}
      </Stack>
    </Box>
  );
};

export default AudioExtraction;
