import axios from "axios"
import {useDispatch, useSelector} from "react-redux";
import {setError} from "../../../../../redux/actions/errorActions";
import {useEffect, useState} from "react";
import _ from "lodash";

export const useAnalysisWrapper = (setAnalysisLoading, setAnalysisResult, serviceUrl, apiUrl, processUrl, keyword) => {    
    const assistantEndpoint = process.env.REACT_APP_ASSISTANT_URL
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.analysis.loading);
    const [data, setData] = useState(null)
    const [cpt, setCpt] = useState(0)
    const [currentURL, setCurrentURL] = useState(processUrl)

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
                        //Every 10 requests get a report content for temporary display
                        getReport(response.data.media_id, true)
                    }
                    setCpt(cpt + 1)
                }
            })
            .catch(error => {
            
            })
    };
    const getReport = (id, processing) => {
        axios.get(serviceUrl+"/reports/" + id)
            .then(response => {
                if (keyword("table_error_" + response.data.status) !== "")
                    handleError("table_error_" + response.data.status.status);
                else if (response.data.status !== "unavailable"){
                    if (response.data.platform === "facebook"){
                        axios.get(assistantEndpoint+"scrape/facebook?url=" + currentURL)
                            .then(responseImg => {
                                dispatch(setAnalysisResult(currentURL, response.data, false, processing, responseImg.data.images[0]));
                            })
                    }else{
                        dispatch(setAnalysisResult(currentURL, response.data, false, processing, null));
                    }
                    
                }
            })
            .catch(errors => handleError(errors));
    };
    const handleError = (error) => {
        if (keyword(error) !== "")
            dispatch(setError((keyword(error))));
        else
            dispatch(setError(error.toString()));
        dispatch(setAnalysisLoading(false));
    };

    useEffect(()=> {
        let timer = null
        if(!_.isNull(data)){
            timer = setTimeout(() => waitUntilDonne(data, cpt), 2000);
            if(!isLoading && !_.isNull(timer)){
                clearTimeout(timer)
                setCpt(0)
            }
        }
        return () => {
            if(!_.isNull(timer))
                clearTimeout(timer)
            }
         // eslint-disable-next-line
    }, [isLoading, data, cpt])


    useEffect(() => {
        const handleJob = (data) => {
            if (keyword("table_error_" + data.status) !== "") {
                handleError("table_error_" + data.status);
            } else {
                setData(data)
            }
        };
        if (!apiUrl)
            return;
        if (apiUrl === "")
            handleError("table_error_empty_url");
        else if (apiUrl.includes(" "))
            handleError("table_error_unavailable");
        else if (processUrl) {        
            setCurrentURL(processUrl)   
            dispatch(setAnalysisLoading(true));
            axios.post(apiUrl)
                .then(response => handleJob(response["data"]))
                .catch(error => handleError(error))
        }
        // eslint-disable-next-line
    }, [apiUrl, keyword, dispatch, processUrl]);
};