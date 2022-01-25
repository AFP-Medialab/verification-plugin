import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setKeyframesSimilarityLoading, setSimilarity } from "../../../../../redux/actions/tools/keyframesActions"
import { setError } from "../../../../../redux/actions/errorActions"

export const useVideoSimilarity = (url, keyword) => {

    const dispatch = useDispatch();

    useEffect(() => {
    
        const handleError = (e) => {
            if (keyword(e) !== "")
                dispatch(setError(keyword(e)));
            else
                dispatch(setError(keyword("keyframes_error_default")));
            dispatch(setKeyframesSimilarityLoading(false));
        };

        const getData = (dbkfApiUrl) => {
            axios.get(dbkfApiUrl)
                .then(response => {
                    //console.log(response);
                    var resultData = [];

                    Object.values(response.data).forEach(value => {
                        resultData.push(value);
                    });

                    dispatch(setSimilarity(resultData));
                    dispatch(setKeyframesSimilarityLoading(false));
                })
                .catch(errors => {
                    handleError("keyframes_error_" + errors)
                });
        };

        if (url === undefined || url === ""){
            return;
        }else{
            dispatch(setKeyframesSimilarityLoading(true));
            getData("https://weverify-demo.ontotext.com/similarity/similarVideos?collection_id=similarity&threshold_similarity=0.5&url=" + url);
        }
            
        //postUrl("http://multimedia2.iti.gr/video_analysis/segmentation", jsonData);
    }, [url, keyword, dispatch]);
};