import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setError } from "../../../../../redux/actions/errorActions";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Forensic.tsv";
import { setStateBackResults } from "../../../../../redux/actions/tools/gifActions";
import { saveAs } from 'file-saver';
import useAuthenticatedRequest from "../../../../Shared/Authentication/useAuthenticatedRequest"

const useGetGif = (images, delayInput, downloading) => {
    const keyword = useLoadLanguage("components/NavItems/tools/Forensic.tsv", tsv);
    const dispatch = useDispatch();
    const authenticatedRequest = useAuthenticatedRequest();
    const baseURL = process.env.REACT_APP_BASEURL


    useEffect(() => {
        console.log("gi use effect 1 ",  downloading);
        console.log("gi use effect 2",  images);
        console.log("gi use effect 3",  delayInput);
        const handleError = (e) => {
            if (keyword(e) !== "")
                dispatch(setError(keyword(e)));
            else
                dispatch(setError(keyword("please_give_a_correct_link")));
            //dispatch(setGifLoading());
        };


        const downloadGif = (response) => {
            console.log(response.data);
            const file = new Blob([response.data], { type: 'image/gif' });
            saveAs(file, "image.gif");
           
        }

        if (images && delayInput && downloading === 7) {
            console.log("download .... ", downloading);
            dispatch(setStateBackResults());
            var body = {
                inputURLs: [
                    images.image1,
                    images.image2,
                ],
                delay: delayInput
            }

            const axiosConfig = {
                method: "post",
                url: baseURL + "/animated",
                data: body,
                responseType: 'blob',
            }

            authenticatedRequest(axiosConfig)
                .then(response => downloadGif(response))
                .catch(error => {
                    handleError("gif_error_" + error.status);
                });


        };



    }, [images, delayInput, downloading, keyword, dispatch, baseURL, authenticatedRequest]);
};
export default useGetGif;