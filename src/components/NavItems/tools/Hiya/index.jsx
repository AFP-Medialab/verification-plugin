import React from "react";
import { useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";

import HiyaHeader from "@/components/NavItems/tools/Hiya/components/HiyaHeader";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import StringFileUploadField from "@Shared/StringFileUploadField";

import HiyaResults from "./components/HiyaResults";
import { useHiyaAudioAnalysis } from "./hooks/useHiyaAudioAnalysis";

/**
 * Hiya Component - Audio authenticity verification tool
 * Provides functionality to analyze audio files for synthetic/cloned voice detection
 * @returns {JSX.Element} The Hiya tool interface
 */
const Hiya = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Hiya");

  // Redux selectors for UI state
  const result = useSelector((state) => state.syntheticAudioDetection.result);
  const isInconclusive = useSelector(
    (state) => state.syntheticAudioDetection.isInconclusive,
  );
  const url = useSelector((state) => state.syntheticAudioDetection.url);
  const chunks = useSelector((state) => state.syntheticAudioDetection.chunks);

  // Use the custom hook for all audio analysis logic
  const {
    getAnalysisResultsForAudio,
    handleSubmit,
    resetState,
    preprocessLocalFile,
    input,
    setInput,
    audioFile,
    setAudioFile,
  } = useHiyaAudioAnalysis();

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <HiyaHeader />
        <Card variant="outlined" sx={{ p: 4 }}>
          <form>
            <StringFileUploadField
              labelKeyword={keyword("hiya_link")}
              placeholderKeyword={keyword("hiya_placeholder")}
              submitButtonKeyword={keyword("hiya_submit_button")}
              localFileKeyword={keyword("button_localfile")}
              urlInput={input}
              setUrlInput={setInput}
              fileInput={audioFile}
              setFileInput={setAudioFile}
              handleSubmit={handleSubmit}
              fileInputTypesAccepted={"audio/*"}
              handleCloseSelectedFile={resetState}
              preprocessLocalFile={preprocessLocalFile}
              isParentLoading={getAnalysisResultsForAudio.isPending}
              handleClearUrl={resetState}
            />
          </form>
          {getAnalysisResultsForAudio.isPending && (
            <>
              <Box
                sx={{
                  m: 2,
                }}
              />
              <Box
                sx={{
                  mt: 3,
                }}
              >
                <LinearProgress />
              </Box>
            </>
          )}
        </Card>

        {getAnalysisResultsForAudio.isError && (
          <Alert severity="error">{keyword("hiya_generic_error")}</Alert>
        )}
        {result && (
          <HiyaResults
            result={result}
            isInconclusive={isInconclusive}
            url={url}
            handleClose={resetState}
            chunks={chunks}
          />
        )}
      </Stack>
    </Box>
  );
};
export default Hiya;
