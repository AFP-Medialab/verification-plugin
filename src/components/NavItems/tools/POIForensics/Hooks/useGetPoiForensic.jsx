import {
  setPoiForensicsLoading,
  setPoiForensicsResult,
} from "@/redux/actions/tools/poiForensicsActions";
import { setError } from "@/redux/reducers/errorReducer";
import { isValidUrl } from "@Shared/Utils/URLUtils";
import axios from "axios";

async function useGetPoiForensics(
  selectedPoi,
  keyword,
  url,
  processURL,
  dispatch,
  role,
  errorMsg,
  type,
  mediaFile,
) {
  if (!processURL || (!url && !mediaFile)) {
    return;
  }

  dispatch(setPoiForensicsLoading(true));

  let poi = Object.entries(selectedPoi)
    .filter(([name, value]) => value === true)
    .map(([name, value]) => name);

  console.log(poi);

  const servicesParams = poi.map((poi) =>
    JSON.stringify({ poi_forensics: { poi: poi, modality: "audiovideo" } }),
  );

  const baseURL = import.meta.env.VITE_CAA_DEEPFAKE_URL;

  let res;

  const handleError = (e) => {
    dispatch(setError(keyword(e)));
    dispatch(setPoiForensicsLoading(false));
  };

  if (!isValidUrl(url) && !mediaFile) {
    handleError(errorMsg);
    return;
  }

  try {
    let bodyFormData;
    switch (type) {
      case "local":
        bodyFormData = new FormData();
        bodyFormData.append("file", mediaFile);
        res = await axios.post(baseURL + "videos/jobs", bodyFormData, {
          params: {
            services: "poi_forensics",
            services_parameters: servicesParams,
          },
          paramsSerializer: (params) => {
            const result = Object.entries(params)
              .map(([key, val]) =>
                Array.isArray(val)
                  ? val.map((v) => `${key}=${encodeURIComponent(v)}`).join("&")
                  : `${key}=${encodeURIComponent(val)}`,
              )
              .join("&");
            return result;
          },
          headers: { "Content-Type": "multipart/form-data" },
        });
        break;
      // default behavior is actually when the input is an URL
      default:
        res = await axios.post(baseURL + "videos/jobs", bodyFormData, {
          params: {
            url: url,
            services: "poi_forensics",
            services_parameters: servicesParams,
          },
          paramsSerializer: (params) => {
            const result = Object.entries(params)
              .map(([key, val]) =>
                Array.isArray(val)
                  ? val.map((v) => `${key}=${encodeURIComponent(v)}`).join("&")
                  : `${key}=${encodeURIComponent(val)}`,
              )
              .join("&");
            return result;
          },
          headers: { "Content-Type": "multipart/form-data" },
        });
        break;
    }
  } catch (error) {
    handleError("poiforensics_error_" + error.response.status);
  }

  const getResult = async (id) => {
    let response;
    try {
      response = await axios.get(baseURL + "videos/reports/" + id);
    } catch (error) {
      handleError("poiforensics_error_" + error.status);
    }

    if (response.data != null) {
      dispatch(setPoiForensicsResult({ url: url, result: response.data }));
      console.log(response.data);
    } else {
      handleError("error_mode_not_supported_" + response.data.mode);
    }
  };

  const waitUntilFinish = async (id) => {
    let response;
    try {
      response = await axios.get(baseURL + "videos/reports/" + id);
    } catch (error) {
      handleError("poiforensics_error_" + error.status);
    }

    if (response && response.data && response.data.status === "PROCESSING") {
      await sleep(waitUntilFinish, id);
    } else if (
      response &&
      response.data &&
      response.data.status === "COMPLETED"
    ) {
      await getResult(id);
    } else {
      handleError("deepfake_error_" + response.data.status);
    }
  };

  res ? waitUntilFinish(res.data.id) : null;
}

function sleep(fn, param) {
  console.log("sleep");
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn(param)), 3000);
  });
}

export default useGetPoiForensics;
