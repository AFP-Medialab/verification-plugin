import {useCallback, useEffect} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {setKeyframesResult, setKeyframesLoading, setKeyframesMessage} from "../../../../../redux/actions/tools/keyframesActions"
import {setError} from "../../../../../redux/actions/errorActions"
export const useKeyframeWrapper = (url) => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = useCallback( (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    }, [dictionary, lang]);
    const dispatch = useDispatch();

    let jsonData = {
        "video_url": url,
        "user_key": process.env.REACT_APP_KEYFRAME_TOKEN,
        "overwrite": 0
    };

    useEffect(() => {

        const handleError = (e) => {
            if (keyword(e) !== undefined)
                dispatch(setError(keyword(e)));
            else
                dispatch(setError(keyword("keyframes_error_default")));
            dispatch(setKeyframesLoading(false));
        };

        const lastGet = (itiUrl) => {
            axios.get(itiUrl)
                .then(response => {
                    dispatch(setKeyframesResult(url, response.data, false, false))
                })
                .catch(error => handleError(error));
        };

        const getUntil = (url, video_id) => {
            let data = null;
            const interval = setInterval(() => {
                if (data && data["status"] === "VIDEO_SEGMENTATION_ANALYSIS_COMPLETED")
                {
                    lastGet("http://multimedia2.iti.gr/video_analysis/result/" + video_id + "_json");
                    clearInterval(interval);
                }
                else if (data && data["status"] !== undefined && keyword("keyframes_error_" + data["status"]) !== undefined) {
                    handleError("keyframes_error_" + data["status"]);
                    clearInterval(interval);
                }
                else {
                    axios.get(url)
                        .then(response => {
                            data = response["data"];
                            if (keyword("keyframes_wait_" + data["status"]) !== undefined) {
                                dispatch(setKeyframesMessage(keyword("keyframes_wait_" + data["status"])));
                            } else if (data["status"].endsWith("STARTED")) {
                                dispatch(setKeyframesMessage(keyword("keyframes_wait_STARTED") + data["step"] + " (" + data["process"] + ") " + (data["progress"] === "N/A" ? "" : data["progress"])))
                            }
                        })
                        .catch(errors => {
                            handleError("keyframes_error_" +errors)
                        });
                }
            }, 2000);
        };

        const postUrl = (url, data) => {
            axios.post(url, data)
                .then(response => {
                    getUntil("http://multimedia2.iti.gr/video_analysis/status/" + response.data.video_id, response.data.video_id)
                })
                .catch(errors => handleError(errors));
        };

        if (url === undefined || url === "")
            return;
        dispatch(setKeyframesLoading(true));
        postUrl("http://multimedia2.iti.gr/video_analysis/segmentation", jsonData);
    }, [url, keyword]);
};