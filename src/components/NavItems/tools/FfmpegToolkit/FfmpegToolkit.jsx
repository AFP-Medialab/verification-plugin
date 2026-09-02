import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ContentCutIcon from "@mui/icons-material/ContentCut";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import StringFileUploadField from "@/components/Shared/StringFileUploadField";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import FfmpegToolkitResult from "./FfmpegToolkitResult";
import useFfmpegToolkit from "./useFfmpegToolkit";

const FfmpegToolkit = () => {
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keyword = i18nLoadNamespace("components/NavItems/tools/FfmpegToolkit");

  const {
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
    handleGetKeyframes,
    handleDownloadKeyframes,
  } = useFfmpegToolkit();

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <HeaderTool
          name={keywordAllTools("navbar_ffmpeg_toolkit")}
          description={
            <>
              {keywordAllTools("navbar_ffmpeg_toolkit_description")}
              <Link
                href="https://en.wikipedia.org/wiki/Video_compression_picture_types"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                {keywordAllTools("navbar_ffmpeg_toolkit_iframelink")}.
              </Link>
            </>
          }
          icon={
            <ContentCutIcon
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
                resetState();
                handleSubmit();
              }}
            >
              <StringFileUploadField
                labelKeyword={keyword("ffmpeg_toolkit_label")}
                placeholderKeyword={keyword("ffmpeg_toolkit_placeholder")}
                submitButtonKeyword={keyword("ffmpeg_toolkit_extractbutton")}
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
                disableUrlInput={true}
                urlInputTestId="ffmpegtoolkit-input"
                submitButtonTestId="ffmpegtoolkit-submit"
              />

              {videoObjectUrl && (
                <Box sx={{ mt: 2 }}>
                  <video
                    ref={videoRef}
                    key={videoObjectUrl}
                    style={{
                      width: "100%",
                      maxHeight: "400px",
                      display: "block",
                    }}
                    src={videoObjectUrl}
                  />
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mt: 0.5 }}
                  >
                    <IconButton size="small" onClick={togglePlay}>
                      {isPlaying ? (
                        <PauseIcon fontSize="small" />
                      ) : (
                        <PlayArrowIcon fontSize="small" />
                      )}
                    </IconButton>
                    <Typography variant="caption">
                      {formatSeconds(Math.floor(currentTime))} /{" "}
                      {formatSeconds(videoDuration)}
                    </Typography>
                  </Stack>
                  <Slider
                    size="small"
                    value={currentTime}
                    onChange={(_, val) => handleSeek(val)}
                    min={0}
                    max={videoDuration || 1}
                    disabled={!videoDuration}
                  />
                </Box>
              )}

              <Typography
                variant="subtitle1"
                sx={{ mt: 3, mb: 1, fontWeight: "medium" }}
              >
                {keyword("ffmpeg_toolkit_cut_description")}
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Slider
                  data-testid="ffmpegtoolkit-slider"
                  value={sliderRange}
                  onChange={(_, newValue) => {
                    if (newValue[1] - newValue[0] < 1) return;
                    setSliderRange(newValue);
                  }}
                  min={0}
                  max={videoDuration || 1}
                  disabled={!videoFile}
                  disableSwap
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption">
                    {formatSeconds(sliderRange[0])}
                  </Typography>
                  <Typography variant="caption">
                    {formatSeconds(sliderRange[1])}
                  </Typography>
                </Box>
              </Box>
            </form>

            {isLoading && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress />
              </Box>
            )}
          </Box>
        </Card>

        {result && (
          <FfmpegToolkitResult
            result={result}
            onDownloadAudio={handleDownloadAudio}
            onDownloadVideo={handleDownloadVideo}
            onGoToHiya={handleGoToHiya}
            onGetKeyframes={handleGetKeyframes}
            onDownloadKeyframes={handleDownloadKeyframes}
          />
        )}
      </Stack>
    </Box>
  );
};

export default FfmpegToolkit;
