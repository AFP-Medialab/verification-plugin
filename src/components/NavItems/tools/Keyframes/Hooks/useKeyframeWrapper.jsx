import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  useCreateKeyframeJob,
  useFetchKeyframeFeatures,
  useFetchKeyframes,
  usePollKeyframeJobStatus,
} from "@/components/NavItems/tools/Keyframes/api";
import { KeyframeInputType } from "@/components/NavItems/tools/Keyframes/api/createKeyframeJob";
import {
  setKeyframesFeatures,
  setKeyframesResult,
} from "@/redux/reducers/tools/keyframesReducer";
import { isValidUrl } from "@Shared/Utils/URLUtils";

export const useProcessKeyframes = () => {
  const [status, setStatus] = useState(null);
  const [featureStatus, setFeatureStatus] = useState(null);

  const dispatch = useDispatch();

  const createKeyframeJob = useCreateKeyframeJob();
  const pollKeyframeJobStatus = usePollKeyframeJobStatus(setStatus);
  const fetchKeyframeFeatures = useFetchKeyframeFeatures();
  const fetchKeyframes = useFetchKeyframes();

  // Step 1: Send URL
  const sendUrlMutation = useMutation({
    mutationFn: async ({ url }) => {
      // Perform url validation
      if (!url || url === "" || !isValidUrl(url)) {
        throw new Error("Invalid URL");
      }

      setStatus("Sending URL...");

      return await createKeyframeJob(KeyframeInputType.URL, url);
    },
  });

  // Step 2: Polling for status
  const checkStatusMutation = useMutation({
    mutationFn: async (jobId) => {
      return await pollKeyframeJobStatus(jobId);
    },
  });

  // Step 3: Get Keyframes
  const fetchKeyframeFeaturesMutation = useMutation({
    mutationFn: async (jobId) => {
      setStatus("Retrieving features...");
      return await fetchKeyframeFeatures(jobId);
    },
    onSuccess: (data) => {
      setFeatureStatus("Completed");
      dispatch(setKeyframesFeatures(data));
    },
  });

  const fetchKeyframesMutation = useMutation({
    mutationFn: async (jobId) => {
      return await fetchKeyframes(jobId);
    },
    onSuccess: (data) => {
      setStatus("Completed");
      dispatch(setKeyframesResult(data));
    },
  });

  // Execute the whole process
  const executeProcess = async (url) => {
    try {
      let jobId;

      jobId = await sendUrlMutation.mutateAsync({ url });
      await checkStatusMutation.mutateAsync(jobId);
      await fetchKeyframeFeaturesMutation.mutateAsync(jobId);
      return fetchKeyframesMutation.mutateAsync(jobId);
    } catch (error) {
      console.error("Process failed:", error);
      setStatus("Error occurred");
      throw error;
    }
  };

  const resetFetchingKeyframes = () => {
    sendUrlMutation.reset();
    checkStatusMutation.reset();
    fetchKeyframesMutation.reset();

    setStatus(null);
  };

  return {
    executeProcess,
    resetFetchingKeyframes,
    status, //Keyframes status
    isPending:
      sendUrlMutation.isPending ||
      checkStatusMutation.isPending ||
      fetchKeyframesMutation.isPending,
    data: fetchKeyframesMutation.data,
    error:
      sendUrlMutation.error ||
      checkStatusMutation.error ||
      fetchKeyframesMutation.error,

    featureStatus,
    isFeatureDataPending: fetchKeyframeFeaturesMutation.isPending,
    featureData: fetchKeyframeFeaturesMutation.data,
    featureDataError: fetchKeyframeFeaturesMutation.error,
  };
};
