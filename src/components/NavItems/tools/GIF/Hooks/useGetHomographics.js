import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setStateLoading, setStateShow, setStateError} from "../../../../../redux/actions/tools/gifActions";
import { setError } from "../../../../../redux/actions/errorActions";
import useAuthenticatedRequest from "../../../../Shared/Authentication/useAuthenticatedRequest"

const useGetHomographics = (files, mode, keyword) => {
    const dispatch = useDispatch();
    const toolState = useSelector(state => state.gif.toolState);
    const baseURL = process.env.REACT_APP_BASEURL

    const authenticatedRequest = useAuthenticatedRequest();

    useEffect(() => {

        const buildError = (error) => {
            //handle http error
            let httpStatus = error.response.status;
            switch (httpStatus){
                case 500:
                    handleError(error.response.data.errorCode);
                break;
                default:
                    handleError("checkGIF_".httpStatus)
            }
        } 

        
        const handleError = (e) => {
            
            if (keyword(e) !== ""){
                dispatch(setError(keyword(e)));
                //console.log("ERROR HOMO: " + keyword(e));
            }else{
                dispatch(setError(keyword("error_homo")));
            }
            
            dispatch(setStateError());

        };

        const getImages = (response) => {
            //console.log("RESPONSE RECIEVED");
            //console.log(response);

            if(response.data.status === "KO"){
                if (response.data.errorCode === "NO_MATCHES_FOUND"){
                    handleError("error_homo");
                } else if (response.data.errorCode === "IPOL_GENERIC_EROR"){
                    handleError("error_server");
                }
                
            }else{
                var homoImage1 = baseURL + response.data.results.output0;
                var homoImage2 = baseURL + response.data.results.output1;

                //console.log(homoImage1);
                //console.log(homoImage2);

                dispatch(setStateShow(homoImage1, homoImage2));
            }

        }

        if (files && mode === 1 && toolState === 3) {
            //console.log("UPLOADING IMAGES");

            dispatch(setStateLoading());
            //console.log(files.file1);
            //console.log(files.file2);

            var bodyFormData = new FormData();
            bodyFormData.append('file_0', files.file1);
            bodyFormData.append('file_1', files.file2);
        

            const axiosConfig = {
                method: "post",
                url: baseURL + "/ipol/homographic",
                data: bodyFormData,
                headers: { 
                    "Content-Type": "multipart/form-data",
                },
            } 
            
            authenticatedRequest(axiosConfig)
                .then(response => getImages(response))
                .catch(error => {
                    //console.log("ERROR", error.response);
                    //console.log("RESPONSE", response);
                    buildError(error)
            });
            
                
        };


        if (files && mode === 2 && toolState === 3) {
            //console.log("UPLOADING IMAGES");

            dispatch(setStateLoading());
            //console.log(files.file1);
            //console.log(files.file2);

            var bodyUrlFormData = new URLSearchParams();
            bodyUrlFormData.append('url_0', files.url_0);
            bodyUrlFormData.append('url_1', files.url_1);


            const axiosConfig = {
                method: "post",
                url: baseURL + "/ipol/homographic/url",
                data: bodyUrlFormData,
                headers: { 
                    "Content-Type": "application/x-www-form-urlencoded", 
                },
            }

            authenticatedRequest(axiosConfig)
                .then(response => getImages(response))
                .catch(error => {
                    buildError(error)
                });


        };

        

    }, [baseURL, toolState, files, mode, keyword, dispatch, authenticatedRequest]);
};
export default useGetHomographics;