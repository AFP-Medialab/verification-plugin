import axios from "axios"
import {useDispatch} from "react-redux";
import {setError} from "../../../../../redux/actions/errorActions";
import {useEffect} from "react";

export const useAnalysisWrapper = (setAnalysisLoading, setAnalysisResult, serviceUrl, apiUrl, processUrl, keyword) => {    
    const dispatch = useDispatch();

    useEffect(() => {
        
        const handleError = (error) => {
            if (keyword(error) !== "")
                dispatch(setError((keyword(error))));
            else
                dispatch(setError(error.toString()));
            dispatch(setAnalysisLoading(false));
        };

        const getReport = (id) => {
            axios.get(serviceUrl+"/reports/" + id)
                .then(response => {
                    if (keyword("table_error_" + response.data.status) !== "")
                        handleError("table_error_" + response.data.status.status);
                    else if (response.data.status !== "unavailable"){

                        //console.log(response.data);

                        if (response.data.platform === "facebook"){
                            axios.get("https://weverify-assistant-dev.gate.ac.uk/scrape/facebook?url=" + processUrl)
                                .then(responseImg => {
                                    //console.log(responseImg);
                                    //console.log(responseImg.data.images[0]);
                                    dispatch(setAnalysisResult(processUrl, response.data, false, false, responseImg.data.images[0]));
                                })
                        }else{
                            dispatch(setAnalysisResult(processUrl, response.data, false, false, null));
                        }
                        
                    }
                })
                .catch(errors => handleError(errors));
        };

        const handleJob = (data) => {
            if (keyword("table_error_" + data.status) !== "") {
                handleError("table_error_" + data.status);
            } else {
                waitUntilDonne(data);
            }
        };


        const waitUntilDonne = (data) => {
            axios.get(serviceUrl+"/jobs/" + data.id)
                .then(response => {
                    //console.log(response);
                    if (response.status === 200 && response.data.status !== "unavailable") {
                        getReport(response.data.media_id)
                    } else if ( keyword("table_error_" +  response.data.status) !== "") {
                        handleError("table_error_" + response.data.status);
                    } else if (response.data.status === "unavailable"){
                        handleError("table_error_unavailable")
                    }
                    else {
                        setTimeout(() => waitUntilDonne(response.data), 2000);
                    }
                })
                .catch(error => {
                
                })
        };


        if (!apiUrl)
            return;
        if (apiUrl === "")
            handleError("table_error_empty_url");
        else if (apiUrl.includes(" "))
            handleError("table_error_unavailable");
        else if (processUrl) {           
            dispatch(setAnalysisLoading(true));
            axios.post(apiUrl)
                .then(response => handleJob(response["data"]))
                .catch(error => handleError(error))
        }
        // eslint-disable-next-line
    }, [apiUrl, keyword, dispatch, processUrl]);
};