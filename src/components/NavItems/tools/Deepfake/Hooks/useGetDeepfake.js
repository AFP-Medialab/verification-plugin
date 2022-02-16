import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios"
import { setDeepfakeLoading, setDeepfakeResult } from "../../../../../redux/actions/tools/deepfakeActions";
import { setError } from "../../../../../redux/actions/errorActions";


const UseGetDeepfake = (url, processURL, mode) => {

    const dispatch = useDispatch();

    const baseURL = "https://mever.iti.gr/deepfake/api/v3/";

    useEffect(() => {
        if (processURL && url !== "") {
            dispatch(setDeepfakeLoading(true));
            var modeURL = "";

            if (mode === "IMAGE"){
                modeURL = "images/";

            } else if (mode === "VIDEO"){
                modeURL = "videos/";
            }

            if (modeURL!== ""){
                axios.post(baseURL + modeURL + "jobs?url=" + url)
                    .then(response => {
                        //console.log(response.data);
                        waitUntilFinish(response.data.id)
                    })
                    .catch(error => {
                        handleError("error_" + error.status);
                    })

                const waitUntilFinish = (id) => {
                    axios.get(baseURL + modeURL + "jobs/" + id)
                        .then((response) => {
                            if (response.data.status === "PROCESSING") {
                                setTimeout(function () {
                                    waitUntilFinish(id);
                                }, 2000);
                            } else if (response.data.status === "COMPLETED") {
                                getResult(id);
                            } else {
                                handleError("error_" + response.data.status);
                            }
                        })
                        .catch(error => {
                            handleError("error_" + error.status);
                        })
                };


                const getResult = (id) => {
                    //console.log("TEST3");
                    axios.get(baseURL + modeURL + "reports/" + id)
                        .then(response => {
                            //console.log(response.data);
                            if (response.data != null) {
                                dispatch(setDeepfakeResult(url, response.data));
                                //getTransparent(response.data.id, url, response.data)
                                //dispatch(setForensicsResult(url, response.data, false, false));
                                //dispatch(setForensicsResult(url, response.data, false, false));
                            } else {
                                //handleError("forensic_error_" + response.data.status);
                            }
                        })
                        .catch(error => {
                            //console.log("ERROR 1");
                            handleError("error_" + error.status);
                        })
                };
            }
        
        }



        const handleError = (e) => {
            
            dispatch(setError(e));
            dispatch(setDeepfakeLoading(false));
        };

    }, [url, processURL, mode, dispatch]);

};
export default UseGetDeepfake;