import { useEffect } from "react";
import axios from "axios"
import { useDispatch } from "react-redux";
import { setForensicsLoading, setForensicsResult, setForensicMaskGif } from "../../../../../redux/actions/tools/forensicActions";
import { setError } from "../../../../../redux/actions/errorActions";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Forensic.tsv";

const useGetTransparent = (url, ready) => {
    const keyword = useLoadLanguage("components/NavItems/tools/Forensic.tsv", tsv);
    const dispatch = useDispatch();


    useEffect(() => {

        const handleError = (e) => {
            if (keyword(e) !== "")
                dispatch(setError(keyword(e)));
            else
                dispatch(setError(keyword("please_give_a_correct_link")));
            dispatch(setForensicsLoading(false));
        };




        if (url && ready) {
            console.log("TEST");
            axios.get("https://mever.iti.gr/envisu4/utils/mask?url=" + url)
                .then(response => {
                    console.log(response);
                    if (response.data != null) {
                        dispatch(setForensicMaskGif(response.data.mask));
                    } else {
                        handleError("forensic_error_" + response.data.status);
                    }
                })
                .catch(error => {
                    handleError("forensic_error_" + error.status);
                })
        }



    }, [url, ready, keyword, dispatch]);
};
export default useGetTransparent;