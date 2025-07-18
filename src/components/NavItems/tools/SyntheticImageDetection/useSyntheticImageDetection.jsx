import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getToolkitSettings } from "@/components/NavItems/tools/C2pa/Hooks/useGetC2paData";
import {
  setSyntheticImageDetectionLoading,
  setSyntheticImageDetectionNearDuplicates,
  setSyntheticImageDetectionResult,
} from "@/redux/actions/tools/syntheticImageDetectionActions";
import useAuthenticatedRequest from "@Shared/Authentication/useAuthenticatedRequest";
import axios from "axios";
import { createC2pa, selectGenerativeInfo } from "c2pa";
import { setError } from "redux/reducers/errorReducer";

import { syntheticImageDetectionAlgorithms } from "./SyntheticImageDetectionAlgorithms";

const fetchGenerativeInfoFromC2pa = async (url) => {
  const settings = await getToolkitSettings();
  const c2pa = await createC2pa({
    wasmSrc: "./c2paAssets/toolkit_bg.wasm",
    workerSrc: "./c2paAssets/c2pa.worker.min.js",
  });

  const { manifestStore } = await c2pa.read(url, { settings });
  const activeManifest = manifestStore?.activeManifest;
  if (!activeManifest) return null;

  let genInfo = null;

  if (!manifestStore.manifests) return null;

  for (const manifestValue of Object.values(manifestStore.manifests)) {
    const generativeInfo = selectGenerativeInfo(manifestValue);

    if (generativeInfo) {
      genInfo = generativeInfo;
    }
  }

  return genInfo;
};

/**
 * Hook for managing synthetic image detection lifecycle.
 * Starts a detection job (local image or remote) and polls for the result.
 * Automatically dispatches Redux actions with results or errors.
 *
 * @param {Object} params - Parameters object
 * @param {Function} params.dispatch - Redux dispatch function
 * @returns {{
 *   startDetection: function({url: string, type: "local" | "url", imageFile: File | null}): Promise<void>,
 *   detectionStatus: Object | undefined,
 *   isLoading: boolean,
 *   error: Error | null
 * }}
 */
export const useSyntheticImageDetection = ({ dispatch }) => {
  const authenticatedRequest = useAuthenticatedRequest();

  /**
   * Starts a synthetic image detection job.
   *
   * @param {Object} options
   * @param {string} options.url - URL of the image (for remote detection)
   * @param {"local" | "url"} options.type - Type of image (local image or url)
   * @param {File} [options.imageFile] - Local file to upload
   * @returns {Promise<{jobId: string, resolvedUrl: string}>}
   */
  const startSyntheticImageDetection = async ({ type, url, imageFile }) => {
    if (!url && !imageFile) throw new Error("Missing URL or image");

    const modeURL = "images/";
    const baseURL = process.env.REACT_APP_CAA_DEEPFAKE_URL;
    const services = syntheticImageDetectionAlgorithms
      .map((algorithm) => algorithm.apiServiceName)
      .join(",");

    let config;

    if (type === "local") {
      const formData = new FormData();
      formData.append("file", imageFile);

      config = {
        method: "post",
        maxBodyLength: Infinity,
        url: baseURL + modeURL + "jobs",
        params: { services, search_similar: true },
        data: formData,
      };
    } else {
      config = {
        method: "post",
        maxBodyLength: Infinity,
        url: baseURL + modeURL + "jobs",
        params: { url, services, search_similar: true },
      };
    }

    try {
      const res = await authenticatedRequest(config);
      if (!res?.data?.id) throw new Error("No job id returned");

      const resolvedUrl = imageFile ? URL.createObjectURL(imageFile) : url;
      return { jobId: res.data.id, resolvedUrl };
    } catch (error) {
      const msg =
        error?.response?.data?.message ?? error.message ?? "Unknown error";
      throw new Error(msg);
    }
  };

  /**
   * Polls job status and fetches a report and similar images if available.
   *
   * @param {string} jobId - Job ID returned from the detection start
   * @returns {Promise<{status: string, report?: Object, similarImages?: Object}>}
   */
  const fetchJobStatusAndReport = async (jobId) => {
    const modeURL = "images/";
    const baseURL = process.env.REACT_APP_CAA_DEEPFAKE_URL;

    const statusRes = await axios.get(baseURL + modeURL + "jobs/" + jobId);
    const status = statusRes.data?.status;

    if (!status) throw new Error("No status from job");

    if (status === "FAILED") {
      throw new Error("Job failed");
    }

    if (status === "COMPLETED") {
      const reportRes = await axios.get(baseURL + modeURL + "reports/" + jobId);

      let similarImages = null;

      if (reportRes.data?.similar_images?.completed) {
        const similarRes = await axios.get(
          baseURL + modeURL + "similar/" + jobId,
        );
        similarImages = similarRes.data;
      }

      return { status, report: reportRes.data, similarImages };
    }

    return { status };
  };

  const fetchMimeType = async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
          Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        },
      });
      return (await response.blob()).type;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const startSyntheticImageDetectionMutation = useMutation({
    mutationFn: startSyntheticImageDetection,
    onError: (error) => {
      dispatch(setError(error.message));
      dispatch(setSyntheticImageDetectionLoading(false));
    },
  });

  const jobId = startSyntheticImageDetectionMutation.data?.jobId;
  const resolvedUrl = startSyntheticImageDetectionMutation.data?.resolvedUrl;

  const detectionQuery = useQuery({
    queryKey: ["syntheticImageDetectionStatus", jobId],
    queryFn: () => fetchJobStatusAndReport(jobId),
    enabled: !!jobId,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "COMPLETED" ? false : 3000;
    },
  });

  const c2paQuery = useQuery({
    queryKey: ["c2paData", resolvedUrl],
    queryFn: () => fetchGenerativeInfoFromC2pa(resolvedUrl),
    enabled: !!resolvedUrl,
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });

  const mimeTypeQuery = useQuery({
    queryKey: ["mimeType", resolvedUrl],
    queryFn: () => fetchMimeType(resolvedUrl),
    enabled: !!resolvedUrl,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (detectionQuery.data?.status === "COMPLETED") {
      dispatch(
        setSyntheticImageDetectionResult({
          url: resolvedUrl,
          result: detectionQuery.data.report,
        }),
      );
      dispatch(
        setSyntheticImageDetectionNearDuplicates(
          detectionQuery.data.similarImages,
        ),
      );
      dispatch(setSyntheticImageDetectionLoading(false));
    }

    if (detectionQuery.error) {
      dispatch(setError(detectionQuery.error.message));
      dispatch(setSyntheticImageDetectionLoading(false));
    }
  }, [detectionQuery.data, detectionQuery.error, dispatch, resolvedUrl]);

  const startDetection = async (params) => {
    startSyntheticImageDetectionMutation.reset();

    return await startSyntheticImageDetectionMutation.mutateAsync(params);
  };

  return {
    startDetection,
    detectionStatus: detectionQuery.data,
    isLoading:
      startSyntheticImageDetectionMutation.isPending ||
      detectionQuery.isLoading ||
      detectionQuery.isFetching,
    error: startSyntheticImageDetectionMutation.error || detectionQuery.error,
    c2paData: c2paQuery.data,
    c2paLoading: c2paQuery.isLoading,
    c2paError: c2paQuery.error,
    imageType: mimeTypeQuery.data,
  };
};
