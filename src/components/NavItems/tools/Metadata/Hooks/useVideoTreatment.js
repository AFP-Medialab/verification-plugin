import { useEffect} from "react";
import * as mp4box from "mp4box";
import {useDispatch} from "react-redux";
import {setMetadadaResult, setMetadadaLoading} from "../../../../../redux/actions/tools/metadataActions";
import {setError} from "../../../../../redux/actions/errorActions";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Metadata.tsv";

const useVideoTreatment = (mediaUrl) => {
    const keyword = useLoadLanguage("components/NavItems/tools/Metadata.tsv", tsv);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleError = (error) => {
            if (keyword(error) !== "")
                dispatch(setError((keyword(error))));
            else
                dispatch(setError("Unknown error"));
            dispatch(setMetadadaLoading(false));
        };

        let videoTreatment = () => {
            let video = mp4box.createFile();

            video.onReady = (info) => {
                dispatch(setMetadadaResult(mediaUrl, info, false, false, false));
            };

            video.onError = (error) => {
                console.log("mp4 error : " + error);
                handleError("metadata_table_error")
            };

            let fileReader = new FileReader();
            fileReader.onload = () => {
                let arrayBuffer = fileReader.result;
                arrayBuffer.fileStart = 0;
                video.appendBuffer(arrayBuffer);
                video.flush();
            };
            fileReader.onerror = () => {
                handleError("metadata_table_error")
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
                    handleError("metadata_table_error")
                }
            };
        };

        if (mediaUrl)
            videoTreatment();
    }, [mediaUrl, keyword]);

};
export default useVideoTreatment;