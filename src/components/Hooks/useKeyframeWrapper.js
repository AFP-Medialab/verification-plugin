import {useEffect, useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";

export const useKeyframeWrapper = (url) => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage ] = useState(null);

    let jsonData = {
        "video_url": url,
        "user_key": process.env.REACT_APP_KEYFRAME_TOKEN,
        "overwrite": 0
    };

    useEffect(() => {

        const lastGet = (url) => {
            axios.get(url)
                .then(response => {
                    setResult(response.data);
                    setLoading(false);
                })
                .catch(errors => {
                    setLoading(false);
                    setError(errors)
                });
        };

        const getUntil = (url, video_id) => {
            let data = null;
            const interval = setInterval(() => {
                setLoading(true);
                if (data && data["status"] === "VIDEO_SEGMENTATION_ANALYSIS_COMPLETED")
                {
                    lastGet("http://multimedia2.iti.gr/video_analysis/result/" + video_id + "_json");
                    clearInterval(interval);
                }
                else if (data && data["status"] !== undefined && keyword("keyframes_error_" + data["status"]) !== undefined) {
                    setLoading(false);
                    setError("keyframes_error_" + data["status"]);
                    clearInterval(interval);
                }
                else {
                    axios.get(url)
                        .then(response => {
                            data = response["data"];
                            if (keyword("keyframes_wait_" + data["status"]) !== undefined) {
                                setMessage(keyword("keyframes_wait_" + data["status"]));
                            } else if (data["status"].endsWith("STARTED")) {
                                setMessage(keyword("keyframes_wait_STARTED") + data["step"] + " (" + data["process"] + ") " + (data["progress"] === "N/A" ? "" : data["progress"]))
                            }
                        })
                        .catch(errors => {
                            setLoading(false);
                            setError("keyframes_error_" +errors)
                        });
                }
            }, 2000);
        };

        const postUrl = (url, data) => {
            axios.post(url, data)
                .then(response => {
                    getUntil("http://multimedia2.iti.gr/video_analysis/status/" + response.data.video_id, response.data.video_id)
                })
                .catch(errors => {
                    setError(errors);
                    setLoading(false);
                });
        };
        if (url === undefined)
            return;
        setLoading(true);
        postUrl("http://multimedia2.iti.gr/video_analysis/segmentation", jsonData);
    }, [url]);

    return [result, error, isLoading, message];
};