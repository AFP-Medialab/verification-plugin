import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  setGeolocationLoading,
  setGeolocationResult,
} from "../../../../../redux/reducers/tools/geolocationReducer";
import { setError } from "../../../../../redux/actions/errorActions";

const useGeolocate = (url, processURL, keyword) => {
  const dispatch = useDispatch();
  const caa_localtion_base_url = process.env.REACT_APP_CAA_LOCATION_URL;

  useEffect(() => {
    if (processURL && url !== "") {
      dispatch(setGeolocationLoading(true));

      axios
        .get(caa_localtion_base_url + "?image_url=" + url + "&use_gradcam=0")
        .then((response) => {
          console.log("response  ", response);
          if (response.data != null) {
            dispatch(
              setGeolocationResult({
                urlImage: url,
                result: response.data.predictions,
                loading: false,
              }),
            );
          } else {
            handleError("forensic_error_" + response.data.status);
          }
        })
        .catch((error) => {
          //console.log("ERROR 1");
          handleError("forensic_error_" + error.status);
        });
    }

    const handleError = (e) => {
      if (keyword(e) !== "") dispatch(setError(keyword(e)));
      else dispatch(setError(keyword("please_give_a_correct_link")));
      dispatch(setGeolocationLoading(false));
    };
    // eslint-disable-next-line
  }, [processURL, url]);
};
export default useGeolocate;
