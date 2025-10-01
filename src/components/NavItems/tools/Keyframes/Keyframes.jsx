import React, { memo, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";

import { useTrackEvent } from "@/Hooks/useAnalytics";
import KeyframesHeader from "@/components/NavItems/tools/Keyframes/components/KeyframesHeader";
import KeyframesResults from "@/components/NavItems/tools/Keyframes/components/KeyframesResults";
import KeyframesTabs from "@/components/NavItems/tools/Keyframes/components/KeyframesTabs";
import SimilarityResults from "@/components/NavItems/tools/Keyframes/components/SimilarityResults";
import {
  resetKeyframes,
  setKeyframesFeatures,
  setKeyframesResult,
  setKeyframesUrl,
} from "@/redux/reducers/tools/keyframesReducer";
import AdvancedSettingsContainer from "@Shared/AdvancedSettingsContainer";
import "@Shared/GoogleAnalytics/MatomoAnalytics";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import StringFileUploadField from "@Shared/StringFileUploadField";
import { TabContext, TabPanel } from "@mui/lab";

import { useProcessKeyframes } from "./Hooks/useKeyframeWrapper";
import { useVideoSimilarity } from "./Hooks/useVideoSimilarity";
import LocalFile from "./LocalFile/LocalFile";

// Constants
const TAB_VALUES = {
  URL: "url",
  FILE: "file",
};
const PROCESS_LEVEL_OPTIONS = [1, 2, 3];
const AUDIO_OPTIONS = [0, 1];
const DOWNLOAD_MAX_HEIGHT_DEFAULT = 1080;
const DOWNLOAD_MAX_HEIGHT_OPTIONS = [480, 720, 1080, 1440, 2160];
const PROCESS_LEVEL_DEFAULT = 3;
const AUDIO_DEFAULT = 0;
const PROCESS_LEVEL_DESCRIPTIONS = {
  1: "Temporal segmentation only - faster",
  2: "Segmentation + key element detection",
  3: "Full pipeline (segmentation + detection + enhancement) - slower",
};

// Utility functions
const mapErrorToKey = (error) => {
  if (error?.code === "ECONNABORTED" || error?.response?.status === 504) {
    return "error_timeout";
  }
  if (error?.response?.status === 500) {
    return "keyframes_error_unavailable";
  }
  return "keyframes_error_default";
};

// Custom hooks
const useKeyframesState = () => {
  return useSelector(
    (state) => ({
      resultUrl: state.keyframes.url,
      resultData: state.keyframes.result,
      keyframesFeaturesData: state.keyframes.keyframesFeatures,
      isLoadingSimilarity: state.keyframes.similarityLoading,
      similarityResults: state.keyframes.similarity,
      processUrl: state.assistant.processUrl,
      role: state.userSession.user.roles,
    }),
    shallowEqual,
  );
};

// Main component
const Keyframes = () => {
  const { url: urlParam } = useParams();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Keyframes");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

  const {
    resultUrl,
    resultData,
    keyframesFeaturesData,
    isLoadingSimilarity,
    similarityResults,
    processUrl,
  } = useKeyframesState();

  const [input, setInput] = useState(resultUrl || "");
  const [videoFile, setVideoFile] = useState(null);
  const [submittedUrl, setSubmittedUrl] = useState(undefined);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [tabSelected, setTabSelected] = useState(TAB_VALUES.URL);

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showResetAdvancedSettings, setShowResetAdvancedSettings] =
    useState(false);

  // Controlled state hooks for advanced settings
  const [downloadMaxHeight, setDownloadMaxHeight] = useState(
    DOWNLOAD_MAX_HEIGHT_DEFAULT,
  );
  const [processLevel, setProcessLevel] = useState(PROCESS_LEVEL_DEFAULT);
  const [audioEnabled, setAudioEnabled] = useState(AUDIO_DEFAULT);

  const resetSearchSettings = () => {
    setShowResetAdvancedSettings(false);
  };

  const source = videoFile || input;

  const {
    executeProcess,
    resetFetchingKeyframes,
    isPending,
    status,
    data,
    error,
    isFeatureDataPending,
    featureData,
    featureDataError,
  } = useProcessKeyframes(source);

  useVideoSimilarity(submittedUrl, keyword);
  useTrackEvent(
    "submission",
    "keyframe",
    "video key frame analysis",
    input.trim(),
    null,
    submittedUrl,
  );

  const isBusy = isPending || isLoadingSimilarity;

  const submitUrl = async (maybeUrl, maybeFile) => {
    const finalUrl = maybeUrl?.trim();
    const file = maybeFile;

    if (!finalUrl && !file) return;

    dispatch(resetKeyframes());
    resetFetchingKeyframes();

    const options = {
      download_max_height: downloadMaxHeight,
      process_level: processLevel,
      audio: audioEnabled,
    };

    try {
      if (file) {
        setHasSubmitted(true);
        await executeProcess(file, options);
      } else if (finalUrl) {
        dispatch(setKeyframesUrl(finalUrl));
        setSubmittedUrl(finalUrl);
        setHasSubmitted(true);
        const result = await executeProcess(finalUrl, options);
        if (result?.fromCache) {
          dispatch(setKeyframesResult(result.data));
          dispatch(setKeyframesFeatures(result.featureData));
          setHasSubmitted(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  function resetResults() {
    setInput("");
    dispatch(resetKeyframes());
    resetFetchingKeyframes();
  }

  function handleTabSelectedChange(event, newValue) {
    setTabSelected(newValue);
  }

  function onSubmitForm() {
    submitUrl(input, videoFile);
  }

  useEffect(() => {
    if (!urlParam) return;
    const uri = decodeURIComponent(urlParam);
    setInput(uri);
  }, [urlParam]);

  useEffect(() => {
    if (!processUrl) return;
    setInput(processUrl);
    submitUrl(processUrl);
  }, [processUrl]);

  useEffect(() => {
    if (featureData && data && hasSubmitted) {
      dispatch(setKeyframesFeatures(featureData));
      dispatch(setKeyframesResult(data));
      setHasSubmitted(false);
    }
  }, [featureData, data, hasSubmitted, dispatch]);

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <KeyframesHeader keywordAllTools={keywordAllTools} />

        <TabContext value={tabSelected}>
          <KeyframesTabs
            value={tabSelected}
            onChange={handleTabSelectedChange}
            keyword={keyword}
          />

          <Card variant="outlined">
            <TabPanel value={TAB_VALUES.URL}>
              <form>
                <Stack direction="column" spacing={2}>
                  <StringFileUploadField
                    labelKeyword={keyword("keyframes_input")}
                    placeholderKeyword={keyword("keyframes_input")}
                    submitButtonKeyword={keyword("button_submit")}
                    localFileKeyword={keyword("button_localfile")}
                    urlInput={input}
                    setUrlInput={setInput}
                    fileInput={videoFile}
                    setFileInput={setVideoFile}
                    handleSubmit={onSubmitForm}
                    fileInputTypesAccepted={"video/*"}
                    handleCloseSelectedFile={resetResults}
                    // preprocessLocalFile={}
                    isParentLoading={isBusy}
                    handleClearUrl={resetResults}
                  />

                  <AdvancedSettingsContainer
                    showAdvancedSettings={showAdvancedSettings}
                    setShowAdvancedSettings={setShowAdvancedSettings}
                    showResetAdvancedSettings={showResetAdvancedSettings}
                    resetSearchSettings={resetSearchSettings}
                    keywordFn={keyword}
                    keywordShow={"keyframes_advanced_settings_show"}
                    keywordHide={"keyframes_advanced_settings_hide"}
                    keywordReset={"keyframes_advanced_settings_reset"}
                  >
                    <Box display="flex" gap={2} flexWrap="wrap" sx={{ p: 2 }}>
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="download-max-height-label">
                          {keyword("download_max_height")}
                        </InputLabel>
                        <Select
                          variant="outlined"
                          labelId="download-max-height-label"
                          id="download-max-height-select"
                          disabled={isBusy}
                          value={downloadMaxHeight}
                          label={keyword("download_max_height")}
                          onChange={(e) =>
                            setDownloadMaxHeight(Number(e.target.value))
                          }
                        >
                          {DOWNLOAD_MAX_HEIGHT_OPTIONS.map((val) => (
                            <MenuItem key={val} value={val}>
                              {val}p
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="process-level-label">
                          {keyword("process_level")}
                        </InputLabel>
                        <Select
                          variant="outlined"
                          labelId="process-level-label"
                          id="process-level-select"
                          disabled={isBusy}
                          value={processLevel}
                          label={keyword("process_level")}
                          onChange={(e) =>
                            setProcessLevel(Number(e.target.value))
                          }
                        >
                          {PROCESS_LEVEL_OPTIONS.map((val) => (
                            <MenuItem key={val} value={val}>
                              {PROCESS_LEVEL_DESCRIPTIONS[val]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="audio-enabled-label">
                          {keyword("enable_audio_processing")}
                        </InputLabel>
                        <Select
                          variant="outlined"
                          labelId="audio-enabled-label"
                          id="audio-enabled-select"
                          value={audioEnabled}
                          label={keyword("audio")}
                          disabled={isBusy}
                          onChange={(e) =>
                            setAudioEnabled(Number(e.target.value))
                          }
                        >
                          {AUDIO_OPTIONS.map((val) => (
                            <MenuItem key={val} value={val}>
                              {val === 0 ? "False" : "True"}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </AdvancedSettingsContainer>
                </Stack>
              </form>
            </TabPanel>
            <TabPanel value={TAB_VALUES.FILE}>
              <LocalFile />
            </TabPanel>
          </Card>

          <SimilarityResults
            results={similarityResults}
            isLoading={isLoadingSimilarity}
            keyword={keyword}
          />

          {status && isPending && (
            <Alert icon={<CircularProgress size={20} />} severity="info">
              {status}
            </Alert>
          )}

          {error && (
            <Alert severity="error">{keyword(mapErrorToKey(error))}</Alert>
          )}

          <KeyframesResults
            data={resultData}
            features={keyframesFeaturesData}
            tabSelected={tabSelected}
            handleClose={resetResults}
            isPending={isPending}
            isFeatureDataPending={isFeatureDataPending}
          />

          {featureDataError && (
            <Alert severity="error">{featureDataError.message}</Alert>
          )}
        </TabContext>
      </Stack>
    </Box>
  );
};

export default memo(Keyframes);
