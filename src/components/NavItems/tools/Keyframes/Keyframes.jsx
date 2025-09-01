import React, { memo, useCallback, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

import { useTrackEvent } from "@/Hooks/useAnalytics";
import KeyframesHeader from "@/components/NavItems/tools/Keyframes/components/KeyframesHeader";
import KeyframesInput from "@/components/NavItems/tools/Keyframes/components/KeyframesInput";
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

  const submitUrl = useCallback(
    async (maybeUrl) => {
      const finalUrl = (maybeUrl ?? input)?.trim();
      if (!finalUrl) return;

      dispatch(resetKeyframes());
      dispatch(setKeyframesUrl(finalUrl));
      resetFetchingKeyframes();

      try {
        setSubmittedUrl(finalUrl);
        setHasSubmitted(true);
        const result = await executeProcess(finalUrl, role);
        if (result?.fromCache) {
          dispatch(setKeyframesResult(result.data));
          dispatch(setKeyframesFeatures(result.featureData));
          setHasSubmitted(false);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, executeProcess, input, resetFetchingKeyframes, role],
  );

  const resetResults = useCallback(() => {
    setInput("");
    dispatch(resetKeyframes());
    resetFetchingKeyframes();
  }, [dispatch]);

  const handleTabSelectedChange = useCallback((event, newValue) => {
    setTabSelected(newValue);
  }, []);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      submitUrl();
    },
    [submitUrl],
  );

  useEffect(() => {
    if (!urlParam) return;
    const uri = decodeURIComponent(urlParam);
    setInput(uri);
  }, [urlParam]);

  useEffect(() => {
    if (!processUrl) return;
    setInput(processUrl);
    submitUrl(processUrl);
  }, [processUrl, submitUrl]);

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
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabPanel value={TAB_VALUES.URL}>
                <KeyframesInput
                  input={input}
                  onInputChange={setInput}
                  onSubmit={onSubmitForm}
                  onReset={resetResults}
                  isDisabled={isBusy}
                  keyword={keyword}
                />
              </TabPanel>
              <TabPanel value={TAB_VALUES.FILE}>
                <LocalFile />
              </TabPanel>
            </Box>
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
