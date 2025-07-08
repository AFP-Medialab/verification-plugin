import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  useCreateKeyframeJob,
  useFetchKeyframeFeatures,
  useFetchKeyframes,
  usePollKeyframeJobStatus,
} from "@/components/NavItems/tools/Keyframes/api";
import { KeyframeInputType } from "@/components/NavItems/tools/Keyframes/api/createKeyframeJob";
import { setKeyframesResult } from "@/redux/reducers/tools/keyframesReducer";
import { isValidUrl } from "@Shared/Utils/URLUtils";

export const useProcessKeyframes = (url) => {
  const [status, setStatus] = useState(null);
  const [featureStatus, setFeatureStatus] = useState(null);

  const [jobId, setJobId] = useState(null);

  const dispatch = useDispatch();

  const createKeyframeJob = useCreateKeyframeJob();
  const pollKeyframeJobStatus = usePollKeyframeJobStatus(setStatus);
  const fetchKeyframeFeatures = useFetchKeyframeFeatures();
  const fetchKeyframes = useFetchKeyframes();

  const queryClient = useQueryClient();

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
  const fetchKeyframeFeaturesMutation = useQuery({
    queryKey: ["keyframeFeatures", url],
    queryFn: async () => {
      setStatus("Retrieving features...");
      return await fetchKeyframeFeatures(jobId);
    },
    enabled: status === "Processing... completed 100%",
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 60, // 1 hour
  });

  // const fetchKeyframeFeaturesMutation = useMutation({
  //   mutationFn: async (jobId) => {
  //     setStatus("Retrieving features...");
  //     return await fetchKeyframeFeatures(jobId);
  //   },
  //   onSuccess: (data) => {
  //     setFeatureStatus("Completed");
  //     dispatch(setKeyframesFeatures(data));
  //   }
  // });

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
      const jobId = await sendUrlMutation.mutateAsync({ url });

      setJobId(jobId);
      await checkStatusMutation.mutateAsync(jobId);
      // await fetchKeyframeFeaturesMutation.(jobId);
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
    isFeatureDataPending: fetchKeyframeFeaturesMutation.isFetching,
    featureData: fetchKeyframeFeaturesMutation.data,
    featureDataError: fetchKeyframeFeaturesMutation.error,
  };
};
