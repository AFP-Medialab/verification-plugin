import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios"
import { setDeepfakeLoading, setDeepfakeResult } from "../../../../../redux/actions/tools/deepfakeActions";
import { setError } from "../../../../../redux/actions/errorActions";


const UseDeepfakeImage = (url, processURL, keyword) => {

    const dispatch = useDispatch();

    useEffect(() => {
        if (processURL && url !== "") {

            dispatch(setDeepfakeLoading(true));

            var body = {
                url: url
            }
            

            axios.post("https://mever.iti.gr/deepfake/api/v3/images/jobs" + "?url=" + url)
                .then(response => {
                    //console.log(response.data);
                    waitUntilFinish(response.data.id)
                })
                .catch(error => {
                    handleError("error_" + error.status);
            })

            const waitUntilFinish = (id) => {
                axios.get("https://mever.iti.gr/deepfake/api/v3/images/jobs/" + id)
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
                axios.get("https://mever.iti.gr/deepfake/api/v3/images/reports/" + id)
                    .then(response => {
                        //console.log(response.data);
                        if (response.data != null) {
                            dispatch(setDeepfakeResult(url, response.data ));
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


        const handleError = (e) => {
            if (keyword(e) !== "")
                dispatch(setError(keyword(e)));
            else
                dispatch(setError(keyword("please_give_a_correct_link")));
            dispatch(setDeepfakeLoading(false));
        };

    }, [processURL, dispatch, keyword, url]);

};
export default UseDeepfakeImage;