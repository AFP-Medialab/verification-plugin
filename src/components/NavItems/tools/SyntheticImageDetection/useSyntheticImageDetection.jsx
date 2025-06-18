import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  setSyntheticImageDetectionLoading,
  setSyntheticImageDetectionNearDuplicates,
  setSyntheticImageDetectionResult,
} from "@/redux/actions/tools/syntheticImageDetectionActions";
import useAuthenticatedRequest from "@Shared/Authentication/useAuthenticatedRequest";
import axios from "axios";
import { setError } from "redux/reducers/errorReducer";

import { syntheticImageDetectionAlgorithms } from "./SyntheticImageDetectionAlgorithms";

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

  const mutation = useMutation({
    mutationFn: startSyntheticImageDetection,
    onError: (error) => {
      dispatch(setError(error.message));
      dispatch(setSyntheticImageDetectionLoading(false));
    },
  });

  const jobId = mutation.data?.jobId;
  const resolvedUrl = mutation.data?.resolvedUrl;

  const query = useQuery({
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

  useEffect(() => {
    if (query.data?.status === "COMPLETED") {
      dispatch(
        setSyntheticImageDetectionResult({
          url: resolvedUrl,
          result: query.data.report,
        }),
      );
      dispatch(
        setSyntheticImageDetectionNearDuplicates(query.data.similarImages),
      );
      dispatch(setSyntheticImageDetectionLoading(false));
    }

    if (query.error) {
      dispatch(setError(query.error.message));
      dispatch(setSyntheticImageDetectionLoading(false));
    }
  }, [query.data, query.error, dispatch, resolvedUrl]);

  return {
    startDetection: mutation.mutateAsync,
    detectionStatus: query.data,
    isLoading: mutation.isPending || query.isLoading || query.isFetching,
    error: mutation.error || query.error,
  };
};
