import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const AudioVideoExtractionResult = ({
  result,
  onDownloadAudio,
  onDownloadVideo,
  onGoToHiya,
}) => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/AudioVideoExtraction",
  );

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <video
          key={result}
          controls
          src={result}
          style={{
            width: "80%",
            maxWidth: "80%",
            maxHeight: "65vh",
            objectFit: "contain",
            display: "block",
          }}
          data-testid="audioextraction-video-container"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          pl: 2,
          pb: 2,
          gap: 1,
        }}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={onDownloadVideo}
          data-testid="audioextraction-download-button"
        >
          {keyword("audiovideo_extraction_downloadvideobutton")}
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={onDownloadAudio}
          data-testid="audioextraction-download-button"
        >
          {keyword("audiovideo_extraction_downloadaudiobutton")}
        </Button>
        <Button
          variant="contained"
          onClick={onGoToHiya}
          data-testid="audioextraction-hiya-button"
        >
          Hiya
        </Button>
      </Box>
    </Card>
  );
};

export default AudioVideoExtractionResult;
