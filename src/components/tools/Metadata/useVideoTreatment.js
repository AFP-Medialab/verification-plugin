import {useEffect, useState} from "react";
import EXIF from "exif-js/exif";
import * as mp4box from "mp4box";

const useVideoTreatment = (mediaUrl) => {
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

        let videoTreatment = () => {
            let video = mp4box.createFile();

            video.onReady = (info) => {
                setResult(info)
            };

            video.onError = (error) => {
                console.log("mp4 error : " + error);
                setErrors("metadata_table_error")
            };


            let fileReader = new FileReader();
            fileReader.onload = () => {
                let arrayBuffer = fileReader.result;
                arrayBuffer.fileStart = 0;
                video.appendBuffer(arrayBuffer);
                video.flush();
            };
            fileReader.onerror = () => {
                setErrors("metadata_table_error")
            };

            let blob = null;
            let xhr = new XMLHttpRequest();

            xhr.open("GET", mediaUrl);
            xhr.responseType = "blob";
            xhr.onload = function () {
                blob = xhr.response; //xhr.response is now a blob object
                fileReader.readAsArrayBuffer(blob);
            };
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status !== 200) {
                    setErrors("metadata_table_error")
                }
            };
        };

        if (mediaUrl)
                videoTreatment();
        else
            setResult(null);
    }, [mediaUrl]);

    return [result, error]
};
export default useVideoTreatment;