import React from "react";
import { useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import HiyaHeader from "@/components/NavItems/tools/Hiya/components/HiyaHeader";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import StringFileUploadField from "@Shared/StringFileUploadField";

import HiyaResults from "./components/HiyaResults";
import { ERROR_MESSAGE_KEYS } from "./constants/detectionConstants";
import { useHiyaAudioAnalysis } from "./hooks/useHiyaAudioAnalysis";

// Utility functions
/**
 * Maps error data to the appropriate main message translation key
 * @param {Object} errorData - Error data from Redux state
 * @returns {string} Translation key for the main error message
 */
const getMainMessageKey = (errorData) => {
  if (errorData.errorType === "all") {
    return ERROR_MESSAGE_KEYS.ALL_ERRORS;
  } else if (errorData.errorType === "partial") {
    return ERROR_MESSAGE_KEYS.PARTIAL_ERRORS;
  }
  return "hiya_generic_error"; // fallback
};

/**
 * Maps error labels to suggestion translation keys
 * @param {string[]} errorLabels - Array of error labels from API
 * @returns {string[]} Array of translation keys for suggestions
 */
const getSuggestionKeys = (errorLabels) => {
  if (!errorLabels || errorLabels.length === 0) {
    return [];
  }

  return errorLabels
    .map((label) => ERROR_MESSAGE_KEYS.SUGGESTIONS[label])
    .filter(Boolean); // Remove any undefined values
};

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
  const resultUrl = useSelector(
    (state) => state.syntheticAudioDetection.resultUrl,
  );
  const chunks = useSelector((state) => state.syntheticAudioDetection.chunks);
  const hasError = useSelector(
    (state) => state.syntheticAudioDetection.hasError,
  );
  const errorData = useSelector(
    (state) => state.syntheticAudioDetection.errorData,
  );
  const hasPartialWarning = useSelector(
    (state) => state.syntheticAudioDetection.hasPartialWarning,
  );
  const warningData = useSelector(
    (state) => state.syntheticAudioDetection.warningData,
  );

  // Use the custom hook for all audio analysis logic
  const {
    getAnalysisResultsForAudio,
    handleSubmit,
    resetState,
    preprocessLocalFile,
    input,
    handleInputChange,
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
              setUrlInput={handleInputChange}
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
        {hasError && errorData && (
          <Alert severity="error">
            <Typography variant="body2" gutterBottom>
              {keyword(getMainMessageKey(errorData))}
            </Typography>
            {getSuggestionKeys(errorData.errorLabels).length > 0 && (
              <List dense sx={{ mt: 1, pl: 2 }}>
                {getSuggestionKeys(errorData.errorLabels).map(
                  (suggestionKey, index) => (
                    <ListItem key={index} sx={{ py: 0, px: 0 }}>
                      <ListItemText
                        primary={keyword(suggestionKey)}
                        slotProps={{ primary: { variant: "body2" } }}
                      />
                    </ListItem>
                  ),
                )}
              </List>
            )}
          </Alert>
        )}
        {hasPartialWarning && warningData && (
          <Alert severity="warning">
            <Typography variant="body2" gutterBottom>
              {keyword(getMainMessageKey(warningData))}
            </Typography>
            {getSuggestionKeys(warningData.errorLabels).length > 0 && (
              <List dense sx={{ mt: 1, pl: 2 }}>
                {getSuggestionKeys(warningData.errorLabels).map(
                  (suggestionKey, index) => (
                    <ListItem key={index} sx={{ py: 0, px: 0 }}>
                      <ListItemText
                        primary={keyword(suggestionKey)}
                        slotProps={{ primary: { variant: "body2" } }}
                      />
                    </ListItem>
                  ),
                )}
              </List>
            )}
          </Alert>
        )}
        {result && !hasError && (
          <HiyaResults
            result={result}
            isInconclusive={isInconclusive}
            url={resultUrl}
            handleClose={resetState}
            chunks={chunks}
          />
        )}
      </Stack>
    </Box>
  );
};
export default Hiya;
