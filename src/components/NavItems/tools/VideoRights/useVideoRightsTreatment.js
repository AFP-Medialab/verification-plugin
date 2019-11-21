import {useEffect, useState} from "react";
import axios from "axios";
import * as querystring from "querystring";
import {useDispatch, useSelector} from "react-redux";
import {setAnalysisLoading, setError, setVideoRightsLoading, setVideoRightsResult} from "../../../../redux/actions";

const useVideoRightsTreatment = (url) => {
    const dispatch = useDispatch();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    useEffect(() => {
        const handleError = (error) => {
            if (keyword(error) !== undefined)
                dispatch(setError((keyword(error))));
            else
                dispatch(setError("Unknown error"));
            dispatch(setVideoRightsLoading(false));
        };

        let kind = "";
        if (url && url !== "" && url !== undefined) {
            let api_url = "https://rights-api.invid.udl.cat/";
            if (url.startsWith("https://www.youtube.com/"))
                kind = "youTubeVideos";
            else if (url.startsWith("https://www.facebook.com/"))
                kind = "facebookVideos";
            else if (url.startsWith("https://twitter.com/"))
                kind = "twitterVideos";
            else {
                handleError("table_error_unavailable");
                return;
            }
            api_url += kind

            dispatch(setVideoRightsLoading(true));
            axios.post(api_url, {"url" : url},  {headers: {ContentType: 'application/json'}})
                .then(response => {
                    let result = response.data;
                    result.kind = kind;
                    result.RIGHTS_APP = api_url;
                    dispatch(setVideoRightsResult(url, result, false, false));
                })
                .catch(errors => {
                    handleError(errors)
                });
        }
    }, [url]);
};
export default useVideoRightsTreatment