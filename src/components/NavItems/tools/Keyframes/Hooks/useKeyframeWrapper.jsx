import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

import {
  useCreateKeyframeJob,
  useFetchKeyframeFeatures,
  useFetchKeyframes,
  usePollKeyframeJobStatus,
} from "@/components/NavItems/tools/Keyframes/api";
import { KeyframeInputType } from "@/components/NavItems/tools/Keyframes/api/createKeyframeJob";
import { isValidUrl } from "@Shared/Utils/URLUtils";

export const useProcessKeyframes = (url) => {
  const urlToJobIdRef = useRef(new Map());

  const [status, setStatus] = useState(null);

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
  const fetchKeyframeFeaturesQuery = useQuery({
    queryKey: ["keyframeFeatures", url],
    queryFn: async ({ queryKey }) => {
      const [, url] = queryKey;
      const jobId = urlToJobIdRef.current.get(url);
      if (!jobId) throw new Error("No jobId available for url");

      setStatus("Retrieving features...");
      return await fetchKeyframeFeatures(jobId);
    },
    enabled: status === "Processing... completed 100%",
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });

  const fetchKeyframesQuery = useQuery({
    queryKey: ["keyframes", url],
    queryFn: async ({ queryKey }) => {
      const [, url] = queryKey;
      const jobId = urlToJobIdRef.current.get(url);
      if (!jobId) throw new Error("No jobId available for url");

      const kf = await fetchKeyframes(jobId);
      setStatus("Completed");
      return kf;
    },
    enabled: status === "Processing... completed 100%",
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });

  // Execute the whole process
  const executeProcess = async (url) => {
    // Snapshot the previous value
    const previousKeyframes = queryClient.getQueryData(["keyframes", url]);
    const previousKeyframeFeatures = queryClient.getQueryData([
      "keyframeFeatures",
      url,
    ]);

    if (url && previousKeyframes && previousKeyframeFeatures) {
      queryClient.setQueryData(["keyframes", url], previousKeyframes);
      queryClient.setQueryData(
        ["keyframeFeatures", url],
        previousKeyframeFeatures,
      );
      return {
        data: previousKeyframes,
        featureData: previousKeyframeFeatures,
        fromCache: true,
      };
    } else {
      try {
        const jobId = await sendUrlMutation.mutateAsync({ url });

        urlToJobIdRef.current.set(url, jobId);

        await checkStatusMutation.mutateAsync(jobId);

        return {
          data: undefined,
          featureData: undefined,
          fromCache: false,
        };
      } catch (error) {
        console.error("Process failed:", error);
        setStatus("Error occurred");
        throw error;
      }
    }
  };

  const resetFetchingKeyframes = () => {
    sendUrlMutation.reset();
    checkStatusMutation.reset();
    setStatus(null);
  };

  const cachedKeyframes = queryClient.getQueryData(["keyframes", url]);
  const cachedKeyframeFeatures = queryClient.getQueryData([
    "keyframeFeatures",
    url,
  ]);

  return {
    executeProcess,
    resetFetchingKeyframes,
    status, //Keyframes status
    isPending:
      sendUrlMutation.isPending ||
      checkStatusMutation.isPending ||
      fetchKeyframesQuery.isFetching,
    data: fetchKeyframesQuery.data ?? cachedKeyframes,
    error:
      sendUrlMutation.error ||
      checkStatusMutation.error ||
      fetchKeyframesQuery.error,

    isFeatureDataPending: fetchKeyframeFeaturesQuery.isFetching,
    featureData: fetchKeyframeFeaturesQuery.data ?? cachedKeyframeFeatures,
    featureDataError: fetchKeyframeFeaturesQuery.error,
  };
};
