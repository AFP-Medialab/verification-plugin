import {useCallback, useEffect} from "react";
import axios from "axios"
import {useDispatch, useSelector} from "react-redux";
import{setForensicsLoading, setForensicsResult} from "../../../../../redux/actions/tools/forensicActions";
import {setError} from "../../../../../redux/actions/errorActions";

const useGetImages = (url) => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = useCallback( (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    }, [dictionary, lang]);

    const dispatch = useDispatch();


    useEffect(() => {

        const handleError = (e) => {
            if (keyword(e) !== undefined)
                dispatch(setError(keyword(e)));
            else
                dispatch(setError("Please give a correct link (TSV change)"));
            dispatch(setForensicsLoading(false));
        };

        const getResult = (hash) => {
            axios.get("https://reveal-mklab.iti.gr/imageforensicsv3/getreport?hash=" + hash)
                .then(response => {
                    if (response.data.status === "completed") {
                        dispatch(setForensicsResult(url, response.data, false, false));
                    } else {
                        handleError("forensic_error_" + response.data.status);
                    }
                })
                .catch(error => {
                    handleError("forensic_error_" + error.status);
                })
        };

        const waitUntilFinish = (hash) => {
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
    }, [url, keyword]);
};
export default useGetImages;