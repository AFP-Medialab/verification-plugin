import { useEffect } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";
import { setError } from "redux/reducers/errorReducer";

import {
  setGeolocationLoading,
  setGeolocationResult,
} from "../../../../../redux/reducers/tools/geolocationReducer";

const caa_localtion_base_url = process.env.REACT_APP_CAA_LOCATION_URL;

export const handleError = (e, keyword, dispatch) => {
  if (keyword(e) !== "") dispatch(setError(keyword(e)));
  else dispatch(setError(keyword("please_give_a_correct_link")));
  dispatch(setGeolocationLoading(false));
};

export const useGeolocate = (url, processURL, keyword) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (processURL && url !== "") {
      dispatch(setGeolocationLoading(true));

      axios
        .get(caa_localtion_base_url + "?image_url=" + url + "&use_gradcam=0")
        .then((response) => {
          if (response.data != null) {
            dispatch(
              setGeolocationResult({
                urlImage: url,
                result: response.data.predictions,
                loading: false,
              }),
            );
          } else {
            handleError("geo_error_" + response.data.status, keyword, dispatch);
          }
        })
        .catch((error) => {
          handleError("geo_error_" + error.response.status, keyword, dispatch);
        });
    }
    // eslint-disable-next-line
  }, [processURL, url]);
};

export const geolocateLocalFile = async (file) => {
  if (!file) {
    throw new Error("File is missing");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(caa_localtion_base_url, {
      method: "POST",
      body: formData,
    });

    if (response.ok && response.data !== null) {
      return await response.json();
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
