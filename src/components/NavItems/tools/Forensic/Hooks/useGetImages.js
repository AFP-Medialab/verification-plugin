import { useEffect} from "react";
import axios from "axios"
import {useDispatch} from "react-redux";
import { setForensicsLoading, setForensicsResult, setForensicMask} from "../../../../../redux/actions/tools/forensicActions";
import {setError} from "../../../../../redux/actions/errorActions";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Forensic.tsv";

const useGetImages = (url) => {
    const keyword = useLoadLanguage("components/NavItems/tools/Forensic.tsv", tsv);
    const dispatch = useDispatch();

    //const gifTransparencyMasks = [];


    useEffect(() => {

        const handleError = (e) => {
            if (keyword(e) !== "")
                dispatch(setError(keyword(e)));
            else
                dispatch(setError(keyword("please_give_a_correct_link")));
            dispatch(setForensicsLoading(false));
        };
        
        
        const getResult = (hash) => {
            //console.log("TEST3");
            axios.get("https://mever.iti.gr/envisu4/api/v4/images/reports/" + hash)
                .then(response => {
                    //console.log(response.data);
                    if (response.data != null) {
                        getTransparent(response.data.id, url, response.data )
                        //dispatch(setForensicsResult(url, response.data, false, false));
                    } else {
                        handleError("forensic_error_" + response.data.status);
                    }
                })
                .catch(error => {
                    //console.log("ERROR 1");
                    handleError("forensic_error_" + error.status);
                })
        };

        //98bd557c6aed2f21aee5aeb2a07705e0


        const getTransparent = (id, url, data) => {
            //console.log("TEST3");
            axios.get("https://mever.iti.gr/envisu4/utils/mask_all?id=" + id)
                .then(response => {
                    //console.log(response.data);
                    if (response.data != null) {
                        //dispatch(setForensicMask(response.data.mask));
                        dispatch(setForensicsResult(url, data, response.data.mask , false, false));
                    } else {
                        handleError("forensic_error_" + response.data.status);
                    }
                })
                .catch(error => {
                    //console.log("ERROR 1");
                    handleError("forensic_error_" + error.status);

                })
        };


        
        const waitUntilFinish = (id) => {
            //console.log("TEST2");
            axios.get("https://mever.iti.gr/envisu4/api/v4/images/jobs/" + id)
                .then((response) => {
                    if (response.data.status === "PROCESSING") {
                        setTimeout(function () {
                            waitUntilFinish(id);
                        }, 2000);
                    } else if (response.data.status === "COMPLETED") {
                        getResult(response.data.itemHash);
                    } else {
                        handleError("forensic_error_" + response.data.status);
                    }
                })
                .catch(error => {
                    handleError("forensic_error_" + error.status);
                })
        };


        if (url) {
            dispatch(setForensicsLoading(true));
            //console.log("TEST1");
            axios.post("https://mever.iti.gr/envisu4/api/v4/images/jobs?url=" + encodeURIComponent(url))
                .then(response => waitUntilFinish(response.data.id))
                .catch(error => {
                    handleError("forensic_error_" + error.status);
                })
        }

        

        /*
        
        const getResult = (hash) => {
            //console.log("TEST3");
            axios.get("https://reveal-mklab.iti.gr/imageforensicsv3/getreport?hash=" + hash)
                .then(response => {
                    if (response.data.status === "completed") {
                        dispatch(setForensicsResult(url, response.data, false, false));
                    } else {
                        handleError("forensic_error_" + response.data.status);
                    }
                })
                .catch(error => {
                    //console.log("ERROR 1");
                    handleError("forensic_error_" + error.status);
                })
        };

        const waitUntilFinish = (hash) => {
            //console.log("TEST2");
            axios.get("https://reveal-mklab.iti.gr/imageforensicsv3/generatereport?hash=" + hash)
                .then((response) => {
                    if (response.data.status === "processing") {
                        setTimeout(function () {
                            waitUntilFinish(hash);
                        }, 2000);
                    } else if (response.data.status === "completed") {
                        getResult(response.data.hash);
                    } else {
                        handleError("forensic_error_" + response.data.status);
                    }
                })
                .catch(error => {
                    handleError("forensic_error_" + error.status);
                })
        };

        const newForensicRequest = (data) => {
            if (data.status === "downloaded")
                waitUntilFinish(data.hash);
            else if (data.status === "exist")
                getResult(data.hash);
            else {
                handleError("forensic_error_" + data.status);
            }
        };

        if (url) {
            dispatch(setForensicsLoading(true));
            axios.get("https://reveal-mklab.iti.gr/imageforensicsv3/addurl?url=" + encodeURIComponent(url))
                .then(response => newForensicRequest(response.data))
                .catch(error => {
                    handleError("forensic_error_" + error.status);
                })
        }
        
        */

    }, [url, keyword, dispatch]);
};
export default useGetImages;