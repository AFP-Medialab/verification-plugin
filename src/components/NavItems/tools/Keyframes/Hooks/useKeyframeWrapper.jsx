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

export const useProcessKeyframes = (input) => {
  const urlToJobIdRef = useRef(new Map());

  const [status, setStatus] = useState(null);

  const createKeyframeJob = useCreateKeyframeJob();
  const pollKeyframeJobStatus = usePollKeyframeJobStatus(setStatus);
  const fetchKeyframeFeatures = useFetchKeyframeFeatures();
  const fetchKeyframes = useFetchKeyframes();

  const queryClient = useQueryClient();

  const getInputKey = (source) => {
    if (typeof source === "string") {
      return source;
    } else if (source instanceof File) {
      const sanitizedFileName = source.name
        .trim()
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .toLowerCase();
      return `${sanitizedFileName}-${source.size}-${source.lastModified}`;
    } else {
      throw new Error("Invalid input type");
    }
  };

  const key = getInputKey(input);

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

  // Step 1: Send File
  const sendFileMutation = useMutation({
    mutationFn: async ({ file }) => {
      if (!file) throw new Error("No file provided");

      setStatus("Uploading file...");

      return await createKeyframeJob(KeyframeInputType.FILE, file);
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
    queryKey: ["keyframeFeatures", key],
    queryFn: async ({ queryKey }) => {
      const [, key] = queryKey;
      const jobId = urlToJobIdRef.current.get(key);
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
    queryKey: ["keyframes", key],
    queryFn: async ({ queryKey }) => {
      const [, key] = queryKey;
      const jobId = urlToJobIdRef.current.get(key);
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
  const executeProcess = async (input) => {
    const currentKey = getInputKey(input);

    // Snapshot the previous value
    const previousKeyframes = queryClient.getQueryData([
      "keyframes",
      currentKey,
    ]);
    const previousKeyframeFeatures = queryClient.getQueryData([
      "keyframeFeatures",
      key,
    ]);

    if (input && previousKeyframes && previousKeyframeFeatures) {
      queryClient.setQueryData(["keyframes", currentKey], previousKeyframes);
      queryClient.setQueryData(
        ["keyframeFeatures", currentKey],
        previousKeyframeFeatures,
      );
      return {
        data: previousKeyframes,
        featureData: previousKeyframeFeatures,
        fromCache: true,
      };
    } else {
      try {
        let jobId;
        if (typeof input === "string") {
          jobId = await sendUrlMutation.mutateAsync({ url: input });
        } else if (input instanceof File) {
          jobId = await sendFileMutation.mutateAsync({ file: input });
        } else {
          throw new Error("Invalid input type");
        }

        urlToJobIdRef.current.set(currentKey, jobId);

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
    sendFileMutation.reset();
    checkStatusMutation.reset();
    setStatus(null);
  };

  const cachedKeyframes = queryClient.getQueryData(["keyframes", key]);
  const cachedKeyframeFeatures = queryClient.getQueryData([
    "keyframeFeatures",
    key,
  ]);

  return {
    executeProcess,
    resetFetchingKeyframes,
    status, //Keyframes status
    isPending:
      sendUrlMutation.isPending ||
      sendFileMutation.isPending ||
      checkStatusMutation.isPending ||
      fetchKeyframesQuery.isFetching,
    data: fetchKeyframesQuery.data ?? cachedKeyframes,
    error:
      sendUrlMutation.error ||
      sendFileMutation.error ||
      checkStatusMutation.error ||
      fetchKeyframesQuery.error,

    isFeatureDataPending: fetchKeyframeFeaturesQuery.isFetching,
    featureData: fetchKeyframeFeaturesQuery.data ?? cachedKeyframeFeatures,
    featureDataError: fetchKeyframeFeaturesQuery.error,
  };
};
