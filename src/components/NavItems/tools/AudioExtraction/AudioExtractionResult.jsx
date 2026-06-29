import React, { useState } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const AudioExtractionResult = () => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/AudioExtraction",
  );
  const result = useSelector((state) => state.audioExtraction.result);

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
        <Button color="primary" variant="contained" onClick={handleDownload}>
          {keyword("audio_extraction_downloadbutton")}
        </Button>
      </Box>
    </Card>
  );
};

export default AudioExtractionResult;
