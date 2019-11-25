import {useEffect, useState} from "react";
import EXIF from "exif-js/exif";
import * as mp4box from "mp4box";
import {useDispatch, useSelector} from "react-redux";
import {setMetadadaResult} from "../../../../redux/actions/tools/metadataActions";
import {setError} from "../../../../redux/actions/errorActions";

const useImageTreatment = (mediaUrl) => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };
    const dispatch = useDispatch();

    useEffect(() => {

        function isEmpty(obj) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }

        const handleErrors = (error) => {
            if (keyword(error) !== undefined)
                dispatch(setError(keyword(error)));
            dispatch(setError("Please give a correct file (TSV change)"))
        };

        let imageTreatment = () => {
            let img = new Image();
            img.src = mediaUrl;
            img.onload = () => {
                EXIF.getData(img, () => {
                    let res = EXIF.getAllTags(img);
                    if (!isEmpty(res)) {
                        dispatch(setMetadadaResult(mediaUrl, res, false, false, true));
                    } else
                        handleErrors("metadata_img_error_exif");
                });
            };
            img.onerror = (error) => {
                handleErrors(error)
            };
        };

        if (mediaUrl)
            imageTreatment();
    }, [mediaUrl]);
};
export default useImageTreatment;