import {
  setSyntheticImageDetectionLoading,
  setSyntheticImageDetectionNearDuplicates,
  setSyntheticImageDetectionResult,
} from "@/redux/actions/tools/syntheticImageDetectionActions";
import useAuthenticatedRequest from "@Shared/Authentication/useAuthenticatedRequest";
import { isValidUrl } from "@Shared/Utils/URLUtils";
import axios from "axios";
import { setError } from "redux/reducers/errorReducer";

import { syntheticImageDetectionAlgorithms } from "./SyntheticImageDetectionAlgorithms";

export const useSyntheticImageDetection = ({
  dispatch,
  keyword,
  keywordWarning,
}) => {
  const authenticatedRequest = useAuthenticatedRequest();

  function sleep(fn, param) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(fn(param)), 3000);
    });
  }

  const getSyntheticImageScores = async (url, processURL, type, image) => {
    if (!processURL || (!url && !image)) return;

    dispatch(setSyntheticImageDetectionLoading(true));
    const modeURL = "images/";
    const baseURL = process.env.REACT_APP_CAA_DEEPFAKE_URL;

    const services = syntheticImageDetectionAlgorithms
      .map((algorithm) => algorithm.apiServiceName)
      .join(",");

    const getUserFriendlyError = (error) => {
      if (!error) return keyword("synthetic_image_detection_error_generic");

      if (
        error.includes("Received status code 400") ||
        error.includes("Cannot open image from")
      ) {
        return keyword("synthetic_image_detection_error_400");
      }

      return keyword("synthetic_image_detection_error_generic");
    };

    const handleError = (e) => {
      dispatch(setError(e));
      dispatch(setSyntheticImageDetectionLoading(false));
    };

    if (!isValidUrl(url) && !image) {
      handleError(keywordWarning("error_invalid_url"));
      return;
    }

    let config, res;

    if (type === "local") {
      const formData = new FormData();
      formData.append("file", image);

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
      res = await authenticatedRequest(config);
    } catch (error) {
      const processedError = getUserFriendlyError(
        error?.response?.data?.message ?? "error_" + error.status,
      );
      handleError(processedError);
      return;
    }

    const getResult = async (id) => {
      let response;
      try {
        response = await axios.get(baseURL + modeURL + "reports/" + id);
      } catch (error) {
        handleError("error_" + error.status);
      }

      if (response?.data) {
        dispatch(
          setSyntheticImageDetectionResult({
            url: image ? URL.createObjectURL(image) : url,
            result: response.data,
          }),
        );
      }

      if (response?.data?.similar_images?.completed) {
        let imgSimilarRes;

        try {
          imgSimilarRes = await axios.get(baseURL + modeURL + "similar/" + id);
        } catch (error) {
          handleError("error_" + error.status);
        }

        if (!imgSimilarRes.data?.similar_media?.length) {
          dispatch(setSyntheticImageDetectionNearDuplicates(null));
        }

        dispatch(setSyntheticImageDetectionNearDuplicates(imgSimilarRes.data));
      }
    };

    const waitUntilFinish = async (id) => {
      let response;

      try {
        response = await axios.get(baseURL + modeURL + "jobs/" + id);
      } catch (error) {
        handleError("error_" + error.status);
      }

      if (response?.data?.status === "PROCESSING") {
        await sleep(waitUntilFinish, id);
      } else if (response?.data?.status === "COMPLETED") {
        await getResult(id);
      } else {
        handleError("error_" + response?.data?.status);
      }
    };

    if (!res?.data) return;
    await waitUntilFinish(res.data.id);
  };

  return { getSyntheticImageScores };
};
