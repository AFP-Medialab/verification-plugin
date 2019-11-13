import {useEffect, useState} from "react";
import EXIF from "exif-js/exif";
import * as mp4box from "mp4box";

const useImageTreatment = (mediaUrl) => {
    const [result, setResult] = useState(null);
    const [error, setErrors] = useState(null);


    useEffect(() => {

        function isEmpty(obj) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }

        let imageTreatment = () => {
            let img = new Image();
            img.src = mediaUrl;
            img.onload = () => {
                EXIF.getData(img, () => {
                    let res = EXIF.getAllTags(img);
                    if (!isEmpty(res)) {
                        setResult(res);
                    } else
                        setErrors("metadata_img_error_exif");
                });
            };
            img.onerror = (error) => {
                setErrors(error)
            };
        };

        if (mediaUrl)
            imageTreatment();
        else
            setResult(null)
    }, [mediaUrl]);

    return [result, error]
};
export default useImageTreatment;