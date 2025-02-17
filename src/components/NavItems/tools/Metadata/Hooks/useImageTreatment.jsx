import { useEffect } from "react";
import { useDispatch } from "react-redux";

import EXIF from "exif-js/exif";
import _ from "lodash";
import { setError } from "redux/reducers/errorReducer";

import { setMetadataResult } from "../../../../../redux/reducers/tools/metadataReducer";

const useImageTreatment = (mediaUrl, keyword) => {
  const dispatch = useDispatch();

  useEffect(() => {
    function isEmpty(obj) {
      for (let key in obj) {
        if (!_.isUndefined(obj.prototype)) {
          if (obj.prototype.hasOwnProperty.call(key)) return false;
        } else {
          return false;
        }
      }
      return true;
    }

    const handleErrors = () => {
      dispatch(setError(keyword("please_give_a_correct_link")));
    };

    let imageTreatment = () => {
      let img = new Image();
      img.src = mediaUrl;
      img.onload = () => {
        EXIF.getData(img, () => {
          let res = EXIF.getAllTags(img);
          if (!isEmpty(res)) {
            dispatch(
              setMetadataResult({
                url: mediaUrl,
                result: res,
                notification: false,
                loading: false,
                isImage: true,
              }),
            );
          } else
            dispatch(
              setMetadataResult({
                url: mediaUrl,
                result: { message: "metadata_img_error_exif" },
                notification: false,
                loading: false,
                isImage: true,
              }),
            );
        });
      };
      img.onerror = () => {
        handleErrors();
      };
    };
    if (!_.isNull(mediaUrl)) {
      imageTreatment();
    }
  }, [mediaUrl]);
};
export default useImageTreatment;
