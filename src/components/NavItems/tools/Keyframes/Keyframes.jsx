import React, { memo, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
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
    role,
  } = useKeyframesState();

  const [input, setInput] = useState(resultUrl || "");
  const [videoFile, setVideoFile] = useState(null);
  const [submittedUrl, setSubmittedUrl] = useState(undefined);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [tabSelected, setTabSelected] = useState(TAB_VALUES.URL);

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
  } = useProcessKeyframes(input);

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

    try {
      if (file) {
        setHasSubmitted(true);
        await executeProcess(file, role);
      } else if (finalUrl) {
        dispatch(setKeyframesUrl(finalUrl));
        setSubmittedUrl(finalUrl);
        setHasSubmitted(true);
        const result = await executeProcess(finalUrl, role);
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
