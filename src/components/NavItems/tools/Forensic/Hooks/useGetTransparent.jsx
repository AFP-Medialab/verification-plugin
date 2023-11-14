import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setForensicsLoading,
  setForensicMaskGif,
} from "../../../../../redux/actions/tools/forensicActions";
import { setError } from "../../../../../redux/actions/errorActions";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const useGetTransparent = (url, ready) => {
  const envisu4_utils_base_url = process.env.REACT_APP_CAA_ENVISU4_UTILS_URL;
  const keyword = i18nLoadNamespace("components/NavItems/tools/Forensic");
  const dispatch = useDispatch();

  useEffect(() => {
    const handleError = (e) => {
      if (keyword(e) !== "") dispatch(setError(keyword(e)));
      else dispatch(setError(keyword("please_give_a_correct_link")));
      dispatch(setForensicsLoading(false));
    };

    if (url && ready) {
      axios
        .get(envisu4_utils_base_url + "mask?url=" + url)
        .then((response) => {
          //console.log(response);
          if (response.data != null) {
            dispatch(setForensicMaskGif(response.data.mask));
          } else {
            handleError("forensic_error_" + response.data.status);
          }
        })
        .catch((error) => {
          handleError("forensic_error_" + error.status);
        });
    }
    // eslint-disable-next-line
  }, [url, ready]);
};
export default useGetTransparent;
