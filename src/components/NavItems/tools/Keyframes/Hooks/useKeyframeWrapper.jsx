import {useEffect} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {setKeyframesResult, setKeyframesLoading, setKeyframesMessage, cleanKeyframesState} from "../../../../../redux/actions/tools/keyframesActions"
import {setError} from "../../../../../redux/actions/errorActions"

export const useKeyframeWrapper = (url, keyword) => {
    
    const dispatch = useDispatch();

    useEffect(() => {
        let source = axios.CancelToken.source();
        let jsonData = {
            "video_url": url,
            "user_key": process.env.REACT_APP_KEYFRAME_TOKEN,
            "overwrite": 0
        };

        const handleError = (e) => {
            if (keyword(e) !== "")
                dispatch(setError(keyword(e)));
            else
                dispatch(setError(keyword("keyframes_error_default")));
            dispatch(setKeyframesLoading(false));
        };

        const lastGet = (itiUrl, video_id) => {
            axios.get(itiUrl)
                .then(response => {
                    dispatch(setKeyframesResult({url:url, result:response.data, notification:false, loading:false, video_id:video_id}))
                })
                .catch(error => handleError(error));
        };

        const getUntil = (url, video_id) => {
            let data = null;
            const interval = setInterval(() => {
                if (data && data["status"].endsWith("COMPLETED"))
                {
                    lastGet("https://multimedia2.iti.gr/video_analysis/result/" + video_id + "_json", video_id);
                    clearInterval(interval);
                }
                else if (data && data["status"] !== undefined && keyword("keyframes_error_" + data["status"]) !== "") {
                    handleError("keyframes_error_" + data["status"]);
                    clearInterval(interval);
                }
                else {
                    axios.get(url, { cancelToken: source.token})
                        .then(response => {
                            data = response["data"];
                            if (keyword("keyframes_wait_" + data["status"]) !== "") {
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

        const postUrl = (multimediaUrl, data) => {
            //console.log("post ", data);
           /* chrome.runtime.sendMessage({contentScriptQuery: "keyframes", url: multimediaUrl, body: data}, (response) => {
                console.log("response ", response);
            })*/
           
            axios.post(multimediaUrl, data, { cancelToken: source.token})
                .then(response => {
                    getUntil("https://multimedia2.iti.gr/video_analysis/status/" + response.data.video_id, response.data.video_id)
                })
                .catch(errors => handleError(errors));
            
        };

        if (url === undefined || url === "")
            return;
        dispatch(cleanKeyframesState());
        dispatch(setKeyframesLoading(true));
        postUrl("https://multimedia2.iti.gr/video_analysis/subshot", jsonData);
        return () => {
        }
    }, [url]);
};