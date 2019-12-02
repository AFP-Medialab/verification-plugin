import axios from "axios"
import {useDispatch, useSelector} from "react-redux";
import {setAnalysisLoading, setAnalysisResult} from "../../../../../redux/actions/tools/analysisActions";
import {setError} from "../../../../../redux/actions/errorActions";
import {useEffect} from "react";

export const useAnalysisWrapper = (url, reprocess) => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };
    const dispatch = useDispatch();
    useEffect(() => {
        const handleError = (error) => {
            if (keyword(error) !== undefined)
                dispatch(setError((keyword(error))));
            else
                dispatch(setError("Unknown error"));
            dispatch(setAnalysisLoading(false));
        };

        const getReport = (id) => {
            axios.get("http://mever.iti.gr/caa/api/v4/videos/reports/" + id)
                .then(response => {
                    if (keyword("table_error_" + response.data.status) !== undefined)
                        handleError("table_error_" + response.data.status.status);
                    else if (response.data.status !== "unavailable")
                        dispatch(setAnalysisResult(url, response.data, false, false))
                })
                .catch(errors => handleError(errors));
        };

        const handleJob = (data) => {
            if (keyword("table_error_" + data.status) !== undefined) {
                handleError("table_error_" + data.status);
            } else {
                waitUntilDonne(data);
            }
        };


        const waitUntilDonne = (data) => {
            axios.get("http://mever.iti.gr/caa/api/v4/videos/jobs/" + data.id)
                .then(response => {
                    if (response.data.status === "done") {
                        getReport(response.data.media_id)
                    } else if ( keyword("table_error_" +  response.data.status) !== undefined) {
                        handleError("table_error_" + response.data.status);
                    } else if (response.data.status === "unavailable"){
                        dispatch(setError("Url not available"));
                        dispatch(setAnalysisLoading(false));
                    }
                    else {
                        getReport(response.data.id);
                        setTimeout(() => waitUntilDonne(response.data), 2000);
                    }
                })
        };


        if (!url)
            return;
        if (url === "")
            handleError("table_error_empty_url");
        else if (url.includes(" "))
            handleError("table_error_unavailable");
        else {
            let analysis_url = "http://mever.iti.gr/caa/api/v4/videos/jobs?url=" + url.replace("&", "%26");
            if (reprocess)
                analysis_url += "&reprocess=1";
            dispatch(setAnalysisLoading(true));
            axios.post(analysis_url)
                .then(response => handleJob(response["data"]))
                .catch(error => handleError(error))
        }

    }, [url]);
};