import { useEffect } from "react";
import * as mp4box from "mp4box";
import { useDispatch } from "react-redux";
import {
  setMetadadaResult,
  setMetadadaLoading,
} from "../../../../../redux/reducers/tools/metadataReducer";
import { setError } from "redux/reducers/errorReducer";

const useVideoTreatment = (mediaUrl, keyword) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleError = (error) => {
      if (keyword(error) !== "") dispatch(setError(keyword(error)));
      else dispatch(setError("Unknown error"));
      dispatch(setMetadadaLoading(false));
    };

    let videoTreatment = () => {
      // let extension = mediaUrl.slice(-3);

      /* if (extension !== "mp4" || extension !== "m4v") {
                handleError("description_limitations")
            }*/

      let video = mp4box.createFile();

      video.onReady = (info) => {
        dispatch(
          setMetadadaResult({
            url: mediaUrl,
            result: info,
            notification: false,
            loading: false,
            isImage: false,
          }),
        );
      };

      video.onError = (error) => {
        console.error("mp4 error : " + error);
        handleError("metadata_table_error");
      };

      let fileReader = new FileReader();
      fileReader.onload = () => {
        let arrayBuffer = fileReader.result;
        arrayBuffer.fileStart = 0;
        video.appendBuffer(arrayBuffer);
        video.flush();
      };
      fileReader.onerror = () => {
        handleError("metadata_table_error");
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
          handleError("metadata_table_error");
        }
      };
    };

    if (mediaUrl) videoTreatment();
  }, [mediaUrl, keyword, dispatch]);
};
export default useVideoTreatment;
