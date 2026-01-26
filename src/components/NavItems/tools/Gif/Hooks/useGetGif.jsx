import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setError } from "@/redux/reducers/errorReducer";
import {
  setStateBackResults,
  setStateDownloading,
} from "@/redux/reducers/tools/gifReducer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { saveAs } from "file-saver";

import useAuthenticatedRequest from "../../../../Shared/Authentication/useAuthenticatedRequest";

const useGetGif = (
  images,
  delayInput,
  enableDownload,
  downloadType,
  isCanvas,
) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Forensic");
  const dispatch = useDispatch();
  const authenticatedRequest = useAuthenticatedRequest();
  const baseURL = import.meta.env.VITE_WRAPPER;

  useEffect(() => {
    const handleError = (e) => {
      if (keyword(e) !== "") dispatch(setError(keyword(e)));
      else dispatch(setError(keyword("please_give_a_correct_link")));
      //dispatch(setGifLoading());
    };

    const download = (response) => {
      let contentType = response.headers["content-type"];
      //console.log("header content-type ", contentType)
      const content = new Blob([response.data], { type: contentType });
      let id;
      switch (contentType) {
        case "video/mp4":
          id = response.headers.videoid;
          saveAs(content, "vera-animated-video-" + id + ".mp4");
          break;
        case "image/gif":
          id = response.headers.imageid;
          saveAs(content, "vera-animated-image-" + id + ".gif");
          break;
        default:
          id = response.headers.imageid;
          saveAs(content, "vera-animated-image-" + id + ".gif");
          break;
      }
      dispatch(setStateBackResults());
    };

    //console.log("files", images);
    //console.log("speed", delayInput);
    //console.log("enable", enableDownload);

    if (enableDownload) {
      dispatch(setStateDownloading());
      let body = {
        inputURLs: [images.image1, images.image2],
        createVideo: downloadType === "mp4",
        delay: delayInput,
      };
      if (isCanvas) {
        body = {
          delay: delayInput,
          createVideo: downloadType === "mp4",
          original: images.image1,
          maskFilter: images.image2,
        };
      }
      //let endpoint = downloadType === "mp4" ? "/video" : "/animated";
      //let endpoint = downloadType === "mp4" ? "/video" : "/animatedbase64";
      let endpoint = isCanvas ? "/animatedbase64" : "/animated";

      const axiosConfig = {
        method: "post",
        url: baseURL + endpoint,
        data: body,
        responseType: "blob",
      };

      authenticatedRequest(axiosConfig)
        .then((response) => {
          download(response);
        })

        .catch((error) => {
          handleError("gif_error_" + error.status);
        });
    }
  }, [images, delayInput, enableDownload, downloadType, authenticatedRequest]);
};
export default useGetGif;
