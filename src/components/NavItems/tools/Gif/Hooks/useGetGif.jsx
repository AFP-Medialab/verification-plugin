import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setError } from "../../../../../redux/actions/errorActions";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import {
  setStateDownloading,
  setStateBackResults,
} from "../../../../../redux/reducers/tools/gifReducer";
import { saveAs } from "file-saver";
import useAuthenticatedRequest from "../../../../Shared/Authentication/useAuthenticatedRequest";

const useGetGif = (images, delayInput, enableDownload, downloadType) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Forensic");
  const dispatch = useDispatch();
  const authenticatedRequest = useAuthenticatedRequest();
  const baseURL = process.env.REACT_APP_BASEURL;

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
      var body = {
        inputURLs: [images.image1, images.image2],
        delay: delayInput,
      };
      let endpoint = downloadType === "mp4" ? "/video" : "/animated";
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
