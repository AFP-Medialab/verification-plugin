import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

import { setHiyaFile } from "@/redux/reducers/tools/hiyaReducer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const AudioExtractionResult = () => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/AudioExtraction",
  );
  const result = useSelector((state) => state.audioExtraction.result);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDownload = () => {
    if (!result) return;

    const link = document.createElement("a");
    link.href = result;

    link.download = `audio_extrait_${Date.now()}.wav`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGoToHiya = () => {
    dispatch(setHiyaFile({ name: "extracted_audio.wav", url: result }));
    navigate("/app/tools/hiya");
  };

  return (
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
        <audio
          controls
          src={result}
          data-testid="audioextraction-audio-container"
        ></audio>
        <Button
          color="primary"
          variant="contained"
          onClick={handleDownload}
          data-testid="audioextraction-download-button"
        >
          {keyword("audio_extraction_downloadbutton")}
        </Button>
        <Button
          variant="contained"
          onClick={handleGoToHiya}
          data-testid="audioextraction-hiya-button"
        >
          Hiya
        </Button>
      </Box>
    </Card>
  );
};

export default AudioExtractionResult;
