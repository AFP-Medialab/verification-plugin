import axios from "axios";
import {
  setDeepfakeLoadingImage,
  setDeepfakeResultImage,
} from "../../../../../redux/actions/tools/deepfakeImageActions";
import {
  setDeepfakeLoadingVideo,
  setDeepfakeResultVideo,
} from "../../../../../redux/actions/tools/deepfakeVideoActions";
import { setError } from "../../../../../redux/actions/errorActions";

async function UseGetDeepfake(url, processURL, mode, dispatch) {
  if (!processURL || !url) {
    return;
  }

  let modeURL = "";
  let services = "";

  if (mode === "IMAGE") {
    dispatch(setDeepfakeLoadingImage(true));
    modeURL = "images/";
    services = "faceswap,gan,diffusion,unina";
  } else if (mode === "VIDEO") {
    dispatch(setDeepfakeLoadingVideo(true));
    modeURL = "videos/";
    services = "deepfake_video,ftcn,face_reenact";
  }

  if (!modeURL) {
    return;
  }

  const baseURL = process.env.REACT_APP_CAA_DEEPFAKE_URL;

  let res;

  try {
    res = await axios.post(baseURL + modeURL + "jobs", null, {
      params: { url: url, services: services },
    });
  } catch (error) {
    handleError("error_" + error.status);
  }

  const getResult = async (id) => {
    let response;
    try {
      response = await axios.get(baseURL + modeURL + "reports/" + id);
    } catch (error) {
      handleError("error_" + error.status);
    }

    if (response.data != null) {
      if (mode === "IMAGE") {
        dispatch(setDeepfakeResultImage({ url: url, result: response.data }));
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
      handleError("error_" + error.status);
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
      handleError("error_" + response.data.status);
    }
  };

  waitUntilFinish(res.data.id);

  const handleError = (e) => {
    dispatch(setError(e));
    if (mode === "IMAGE") {
      dispatch(setDeepfakeLoadingImage(false));
    } else if (mode === "VIDEO") {
      dispatch(setDeepfakeLoadingVideo(false));
    }
  };
}

function sleep(fn, param) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn(param)), 2000);
  });
}

export default UseGetDeepfake;
