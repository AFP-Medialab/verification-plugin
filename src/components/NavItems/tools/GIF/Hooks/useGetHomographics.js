import { useEffect } from "react";
import axios from "axios"
import { useDispatch } from "react-redux";
import { setHomogroaphic, setGifLoading } from "../../../../../redux/actions/tools/gifActions";
import { setError } from "../../../../../redux/actions/errorActions";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Forensic.tsv";

const useGetHomographics = (files, showHomo) => {
    const keyword = useLoadLanguage("components/NavItems/tools/Forensic.tsv", tsv);
    const dispatch = useDispatch();


    useEffect(() => {

        const handleError = (e) => {
            if (keyword(e) !== "")
                dispatch(setError(keyword(e)));
            else
                dispatch(setError(keyword("please_give_a_correct_link")));
            dispatch(setGifLoading());
        };

        const getImages = (response) => {
            console.log("RESPONSE RECIEVED");
            console.log(response);

            var homoImage1 = "https://ipolcore.ipol.im/" + response.data.work_url + "output_0.png";
            var homoImage2 = "https://ipolcore.ipol.im/" + response.data.work_url + "output_1.png";

            //console.log(homoImage1);
            //console.log(homoImage2);

            dispatch(setHomogroaphic(homoImage1, homoImage2));

        }

        if (files && !showHomo) {
            console.log("UPLOADING IMAGES");

            dispatch(setGifLoading());
            //console.log(files.file1);
            //console.log(files.file2);

            var bodyFormData = new FormData();
            bodyFormData.append('file_0', files.file1);
            bodyFormData.append('file_1', files.file2);

            axios({
                method: "post",
                url: "https://demo-medialab.afp.com/envisu-tools/open/ipol/homographic",
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(response => getImages(response))
                .catch(error => {
                    handleError("gif_error_" + error.status);
            });
            
                
        };

        

    }, [keyword, dispatch]);
};
export default useGetHomographics;