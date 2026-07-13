import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ContentCutIcon from "@mui/icons-material/ContentCut";

import StringFileUploadField from "@/components/Shared/StringFileUploadField";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import AudioVideoExtractionResult from "./AudioVideoExtractionResult";
import useAudioVideoExtraction from "./useAudioVideoExtraction";

const AudioVideoExtraction = () => {
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/AudioVideoExtraction",
  );

  const {
    isLoading,
    result,
    input,
    setInput,
    videoFile,
    setVideoFile,
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
  } = useAudioVideoExtraction();

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <HeaderTool
          name={keywordAllTools("navbar_audiovideo_extraction")}
          description={keywordAllTools(
            "navbar_audiovideo_extraction_description",
          )}
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
                labelKeyword={keyword("audiovideo_extraction_label")}
                placeholderKeyword={keyword(
                  "audiovideo_extraction_placeholder",
                )}
                submitButtonKeyword={keyword(
                  "audiovideo_extraction_extractbutton",
                )}
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
                urlInputTestId="audioextraction-input"
                submitButtonTestId="audioextraction-submit"
              />

              <Typography
                variant="subtitle1"
                sx={{ mt: 3, mb: 1, fontWeight: "medium" }}
              >
                Choisissez la portion de la vidéo :
              </Typography>

              <Box sx={{ mt: 1, px: 1 }}>
                <Slider
                  data-testid="audioextraction-slider"
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
          <AudioVideoExtractionResult
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

export default AudioVideoExtraction;
