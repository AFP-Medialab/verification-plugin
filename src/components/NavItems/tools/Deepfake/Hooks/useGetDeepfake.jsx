import { isValidUrl } from "@Shared/Utils/URLUtils";
import axios from "axios";
import { setError } from "redux/reducers/errorReducer";

import { ROLES } from "../../../../../constants/roles";
import {
  setDeepfakeLoadingImage,
  setDeepfakeResultImage,
} from "../../../../../redux/actions/tools/deepfakeImageActions";
import {
  setDeepfakeLoadingVideo,
  setDeepfakeResultVideo,
} from "../../../../../redux/actions/tools/deepfakeVideoActions";

async function UseGetDeepfake(
  keyword,
  url,
  processURL,
  mode,
  dispatch,
  role,
  errorMsg,
  type,
  mediaFile,
) {
  if (!processURL || (!url && !mediaFile)) {
    return;
  }

  let modeURL = "";
  let services = "";

  if (mode === "IMAGE") {
    dispatch(setDeepfakeLoadingImage(true));
    modeURL = "images/";
    services = "faceswap_ens_mever";
  } else if (mode === "VIDEO") {
    dispatch(setDeepfakeLoadingVideo(true));
    modeURL = "videos/";
    // services = "deepfake_video,ftcn,face_reenact";
    services = "deepfake_video";
    if (role.includes(ROLES.EVALUATION)) services += ",faceswap_fsfm";
    if (role.includes(ROLES.EXTRA_FEATURE)) services += ",ftcn";
  }

  if (!modeURL) {
    return;
  }

  const baseURL = process.env.REACT_APP_CAA_DEEPFAKE_URL;

  let res;

  const handleError = (e) => {
    dispatch(setError(keyword(e)));
    if (mode === "IMAGE") {
      dispatch(setDeepfakeLoadingImage(false));
    } else if (mode === "VIDEO") {
      dispatch(setDeepfakeLoadingVideo(false));
    }
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
        res = await axios.post(baseURL + modeURL + "jobs", bodyFormData, {
          method: "post",
          params: { services: services },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        break;

      default:
        res = await axios.post(baseURL + modeURL + "jobs", null, {
          params: { url: url, services: services },
        });
        break;
    }
  } catch (error) {
    handleError("deepfake_error_" + error.response.status);
  }

  const getResult = async (id) => {
    let response;
    try {
      response = await axios.get(baseURL + modeURL + "reports/" + id);
    } catch (error) {
      handleError("deepfake_error_" + error.status);
    }

    if (response.data != null) {
      if (mode === "IMAGE") {
        dispatch(
          setDeepfakeResultImage({
            url: mediaFile ? URL.createObjectURL(mediaFile) : url,
            result: response.data,
          }),
        );
      } else if (mode === "VIDEO") {
        dispatch(setDeepfakeResultVideo({ url: url, result: response.data }));
      }
    } else {
      handleError("error_mode_not_supported_" + response.data.mode);
    }
  };

  const waitUntilFinish = async (id) => {
    let response;

    try {
      response = await axios.get(baseURL + modeURL + "jobs/" + id);
    } catch (error) {
      handleError("deepfake_error_" + error.status);
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
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn(param)), 3000);
  });
}

export default UseGetDeepfake;
