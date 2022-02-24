import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios"
import { setGeolocationLoading, setGeolocationResult } from "../../../../../redux/actions/tools/geolocationActions";
import { setError } from "../../../../../redux/actions/errorActions";


const useGeolacate = (url, processURL, keyword) => {

    const dispatch = useDispatch();

    useEffect(() => {
        if (processURL && url !== "") {

            dispatch(setGeolocationLoading(true));

            axios.get("https://mever.iti.gr/location/api/v3/geolocate?image_url=" + url + "&use_gradcam=0")
                .then(response => {
                    console.log(response.data);
                    if (response.data != null) {
                        dispatch(setGeolocationResult(url, response.data.predictions));
                    } else {
                        handleError("forensic_error_" + response.data.status);
                    }
                })
                .catch(error => {
                    //console.log("ERROR 1");
                    handleError("forensic_error_" + error.status);
            })
        
        }


        const handleError = (e) => {
            if (keyword(e) !== "")
                dispatch(setError(keyword(e)));
            else
                dispatch(setError(keyword("please_give_a_correct_link")));
            dispatch(setGeolocationLoading(false));
        };

    }, [processURL, dispatch, keyword, url]);

};
export default useGeolacate;