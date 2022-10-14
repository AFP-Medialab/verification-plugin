import { useEffect } from "react";
import axios from "axios"
import { useDispatch } from "react-redux";
import { setForensicsLoading, setForensicsResult, setForensicDisplayItem } from "../../../../../redux/actions/tools/forensicActions";
import { setError } from "../../../../../redux/actions/errorActions";

const useGetImages = (url, type, keyword) => {
    const envisu4_base_url = process.env.REACT_APP_CAA_ENVISU4_URL
    const envisu4_utils_base_url = process.env.REACT_APP_CAA_ENVISU4_UTILS_URL

    const dispatch = useDispatch();

    //const gifTransparencyMasks = [];

    const threshold = 0.4;
    const colormap = "mako";


    useEffect(() => {

        const handleError = (e) => {
            //console.log("error key", e)
            if (keyword(e) !== "")
                dispatch(setError(keyword(e)));
            else
                dispatch(setError(keyword("please_give_a_correct_link")));
            dispatch(setForensicsLoading(false));
        };


        const getResult = (hash) => {
            //console.log("TEST3");
            axios.get(envisu4_utils_base_url+"process_filters?id=" + hash + "&threshold=" + threshold +"&cmap=" + colormap)
                .then(response => {
                    //console.log(response.data);
                    if (response.data != null) {
                        //getTransparent(response.data.id, url, response.data)                        
                        dispatch(setForensicsResult({url:url, result:response.data, notification:false, loading:false, gifAnimation:false}));
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
            axios.get(envisu4_base_url+"images/jobs/" + id)
                .then((response) => {
                    if (response.data.status === "PROCESSING") {
                        setTimeout(function () {
                            waitUntilFinish(id);
                        }, 2000);
                    } else if (response.data.status === "COMPLETED") {
                        getResult(response.data.itemHash);
                        dispatch(setForensicDisplayItem(type === "local" ? response.data.displayItem : url))
                        //getResult(id);
                    } else {
                        handleError("forensic_error_" + response.data.status);
                    }
                })
                .catch(error => {
                    handleError("forensic_error_" + error.status);
                })
        };

        const configService = (type) =>
        {
            switch (type) {
                case "local":
                    var bodyFormData = new FormData();
                    bodyFormData.append('file', url);
        
                    return {
                        method: 'post',
                        url: envisu4_base_url + "images/jobs",
                        data: bodyFormData,
                        headers: { 
                            "Content-Type": "multipart/form-data",
                        },
                    } 
                case "url":
                    return {
                        method: 'post', 
                        url: envisu4_base_url+"images/jobs?url=" + encodeURIComponent(url)
                    }
                default:
                    break;
            }
            
        }
    


        if (url) {            
            dispatch(setForensicsLoading(true));
            //console.log("TEST1");
            axios(configService(type))
            .then(response => waitUntilFinish(response.data.id))
                .catch(error => {
                    let httpStatus = error.response.status;
                    //console.log("error status", httpStatus)
                    switch (httpStatus){
                        case 400:
                            if(error.response.data){
                                let errorCode = error.response.data.error;
                                handleError("forensic_error_" + errorCode.toLowerCase());
                            }
                            else  handleError("forensic_error_" + httpStatus);
                        break;
                        default:
                            handleError("forensic_error_" + httpStatus);
                    }
                })

        }
        // eslint-disable-next-line
    }, [url]);
};
export default useGetImages;


