import { React, useState } from "react";
import { useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import DownloadVideoModal from "./DownloadVideoModal";

const FfmpegToolkitResult = ({
  result,
  onDownloadAudio,
  onDownloadVideo,
  onGoToHiya,
  onGetKeyframes,
  onDownloadKeyframes,
}) => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const keyword = i18nLoadNamespace("components/NavItems/tools/FfmpegToolkit");

  const keyframes = useSelector((state) => state.ffmpegToolkit.keyframes);

  const isLoading = useSelector((state) => state.ffmpegToolkit.bottomLoading);

  const hasKeyframes = keyframes?.length > 0;

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
          data-testid="ffmpegtoolkit-video-container"
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
          onClick={() => setShowDownloadModal(true)}
          data-testid="ffmpegtoolkit-downloadvideo-button"
        >
          {keyword("ffmpeg_toolkit_downloadvideobutton")}
        </Button>
        <DownloadVideoModal
          showModal={showDownloadModal}
          setShowModal={setShowDownloadModal}
          onConfirm={onDownloadVideo}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={onDownloadAudio}
          data-testid="ffmpegtoolkit-downloadaudio-button"
        >
          {keyword("ffmpeg_toolkit_downloadaudiobutton")}
        </Button>
        <Button
          variant="contained"
          onClick={onGoToHiya}
          data-testid="ffmpegtoolkit-hiya-button"
        >
          Hiya
        </Button>
        <Button
          variant="contained"
          onClick={onGetKeyframes}
          data-testid="ffmpegtoolkit-keyframes-button"
        >
          I-frames
        </Button>
      </Box>
      {keyframes && hasKeyframes && (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              maxHeight: 450,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {keyframes.map((item, index) => {
              const imageSrc = `data:${item.mimeType};base64,${item.data}`;

              return (
                <Box
                  key={item.filename || index}
                  sx={{ width: "calc(33.33% - 8px)", flexShrink: 0 }}
                >
                  <img
                    src={imageSrc}
                    alt={item.filename}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      padding: 5,
                    }}
                  />
                </Box>
              );
            })}
          </Box>
          <Button
            variant="contained"
            onClick={onDownloadKeyframes}
            data-testid="ffmpegtoolkit-download-keyframes-button"
            sx={{ mt: 2 }}
          >
            {keyword("ffmpeg_toolkit_downloadkeyframesbutton")}
          </Button>
        </Box>
      )}
      {keyframes && !hasKeyframes && (
        <Box sx={{ p: 2 }}>
          <Alert severity="warning">No keyframes found in this video</Alert>
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

export default FfmpegToolkitResult;
