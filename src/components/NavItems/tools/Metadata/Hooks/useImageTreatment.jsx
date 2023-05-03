import { useEffect } from "react";
import EXIF from "exif-js/exif";
import { useDispatch } from "react-redux";
import { setMetadadaResult } from "../../../../../redux/reducers/tools/metadataReducer";
import { setError } from "../../../../../redux/actions/errorActions";

const useImageTreatment = (mediaUrl, keyword) => {
  const dispatch = useDispatch();

  useEffect(() => {
    function isEmpty(obj) {
      for (let key in obj) {
        if (obj.prototype.hasOwnProperty.call(key)) return false;
      }
      return true;
    }

    const handleErrors = (error) => {
      if (keyword(error) !== "") dispatch(setError(keyword(error)));
      else dispatch(setError(keyword("please_give_a_correct_link")));
    };

    let imageTreatment = () => {
      let img = new Image();
      img.src = mediaUrl;
      img.onload = () => {
        EXIF.getData(img, () => {
          let res = EXIF.getAllTags(img);

          //console.log(res);
          if (!isEmpty(res)) {
            dispatch(
              setMetadadaResult({
                url: mediaUrl,
                result: res,
                notification: false,
                loading: false,
                isImage: true,
              })
            );
          } else
            dispatch(
              setMetadadaResult({
                url: mediaUrl,
                result: { message: "metadata_img_error_exif" },
                notification: false,
                loading: false,
                isImage: true,
              })
            );
        });
      };
      img.onerror = (error) => {
        handleErrors(error);
      };
    };

    if (mediaUrl) imageTreatment();
  }, [mediaUrl]);
};
export default useImageTreatment;