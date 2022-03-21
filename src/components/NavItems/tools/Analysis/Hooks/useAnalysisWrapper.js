import axios from "axios"
import {useDispatch} from "react-redux";
import {setError} from "../../../../../redux/actions/errorActions";
import {useEffect, useState} from "react";

export const useAnalysisWrapper = (setAnalysisLoading, setAnalysisResult, serviceUrl, apiUrl, processUrl, keyword) => {    
    const dispatch = useDispatch();
    const [count, setCount] = useState(0);
    useEffect(() => {
        const handleError = (error) => {
            if (keyword(error) !== "")
                dispatch(setError((keyword(error))));
            else
                dispatch(setError(error.toString()));
            dispatch(setAnalysisLoading(false));
        };

        const getReport = (id, processing) => {
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
                                    dispatch(setAnalysisResult(processUrl, response.data, false, processing, responseImg.data.images[0]));
                                })
                        }else{
                            dispatch(setAnalysisResult(processUrl, response.data, false, processing, null));
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


        const waitUntilDonne = (data, cpt = 0) => {
            axios.get(serviceUrl+"/jobs/" + data.id)
                .then(response => {
                    //console.log(response);
                    if (response.status === 200 && response.data.status === "done") {
                        getReport(response.data.media_id, false)
                    } else if ( keyword("table_error_" +  response.data.status) !== "") {
                        handleError("table_error_" + response.data.status);
                    } else if (response.data.status === "unavailable"){
                        handleError("table_error_unavailable")
                    }
                    else {
                        if(cpt % 10 === 1){
                            console.log("modulo .... ", cpt)
                            getReport(response.data.media_id, true)
                        }
                        setTimeout(() => waitUntilDonne(response.data, cpt + 1), 2000);
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