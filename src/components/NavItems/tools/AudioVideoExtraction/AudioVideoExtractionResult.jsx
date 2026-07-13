import { React, useState } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import LinearProgress from "@mui/material/LinearProgress";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const AudioVideoExtractionResult = ({
  result,
  onDownloadAudio,
  onDownloadVideo,
  onGoToHiya,
  onGetKeyframes,
  onDownloadKeyframes,
}) => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/AudioVideoExtraction",
  );

  const keyframes = useSelector(
    (state) => state.audioVideoExtraction.keyframes,
  );

  const isLoading = useSelector(
    (state) => state.audioVideoExtraction.keyframesLoading,
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
        <Button
          variant="contained"
          onClick={onGetKeyframes}
          data-testid="audioextraction-keyframes-button"
        >
          Keyframes
        </Button>
      </Box>
      {keyframes && (
        <Box sx={{ p: 2 }}>
          <ImageList
            sx={{ width: "100%", height: 450 }}
            cols={3}
            rowHeight="auto"
            gap={8}
          >
            {keyframes.map((item, index) => {
              const imageSrc = `data:${item.mimeType};base64,${item.data}`;

              return (
                <ImageListItem key={item.filename || index}>
                  <img
                    src={imageSrc}
                    alt={item.filename}
                    loading="lazy"
                    style={{ padding: 5, margin: 5 }}
                  />
                </ImageListItem>
              );
            })}
          </ImageList>
          <Button
            variant="contained"
            onClick={onDownloadKeyframes}
            data-testid="audioextraction-download-keyframes-button"
          >
            {keyword("audiovideo_extraction_downloadkeyframesbutton")}
          </Button>
        </Box>
      )}
      {isLoading && (
        <Box sx={{ mt: 3 }}>
          <LinearProgress />
        </Box>
      )}
    </Card>
  );
};

export default AudioVideoExtractionResult;
