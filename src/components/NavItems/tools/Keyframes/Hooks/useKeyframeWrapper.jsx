import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setKeyframesResult,
  setKeyframesLoading,
  cleanKeyframesState,
} from "../../../../../redux/actions/tools/keyframesActions";
import { setError } from "redux/reducers/errorReducer";

export const useKeyframeWrapper = (url, keyword) => {
  const dispatch = useDispatch();
  const keyframe_url = process.env.REACT_APP_KEYFRAME_API;

  useEffect(() => {
    let source = axios.CancelToken.source();

    let jsonData = {
      video_url: url,
      user_key: process.env.REACT_APP_KEYFRAME_TOKEN,
      overwrite: 0,
    };

    const handleError = (e) => {
      if (keyword(e) !== "") dispatch(setError(keyword(e)));
      else dispatch(setError(keyword("keyframes_error_default")));
      dispatch(setKeyframesLoading(false));
    };

    const lastGet = (itiUrl, video_id) => {
      axios
        .get(itiUrl)
        .then((response) => {
          dispatch(
            setKeyframesResult({
              url: url,
              result: response.data,
              notification: false,
              loading: false,
              video_id: video_id,
            }),
          );
        })
        .catch((error) => handleError(error));
    };

    const getUntil = (url, video_id) => {
      let data = null;
      const interval = setInterval(() => {
        if (data) {
          switch (data["status"]) {
            case "VIDEO_WAITING_IN_QUEUE":
            case "VIDEO_DOWNLOAD_STARTED":
            case "SUBSHOT_DETECTION_ANALYSIS_STARTED":
            case "VIDEO_SUBSHOT_SEGMENTATION_STARTED":
              axios
                .get(url, { cancelToken: source.token })
                .then((response) => {
                  data = response["data"];
                })
                .catch((errors) => {
                  //console.log("Errors ", errors)
                  handleError("keyframes_error_" + errors);
                });
              break;
            case "VIDEO_SUBSHOT_SEGMENTATION_COMPLETED":
            case "SUBSHOT_DETECTION_ANALYSIS_COMPLETED":
              lastGet(keyframe_url + "/result/" + video_id + "_json", video_id);
              clearInterval(interval);
              break;
            default:
              //console.log("default code ", data["status"])
              handleError("keyframes_error_" + data["status"]);
              clearInterval(interval);
              break;
          }
        } else {
          axios
            .get(url, { cancelToken: source.token })
            .then((response) => {
              data = response["data"];
            })
            .catch((errors) => {
              //console.log("Errors ", errors)
              handleError("keyframes_error_" + errors);
            });
        }
      }, 3000);
    };

    const postUrl = (multimediaUrl, data) => {
      axios
        .post(multimediaUrl, data, { cancelToken: source.token })
        .then((response) => {
          getUntil(
            keyframe_url + "/status/" + response.data.video_id,
            response.data.video_id,
          );
        })
        .catch((errors) => handleError(errors));
    };

    if (url === undefined || url === "") return;
    dispatch(cleanKeyframesState());
    dispatch(setKeyframesLoading(true));
    postUrl(keyframe_url + "/subshot", jsonData);
    return () => {};
  }, [url]);
};
