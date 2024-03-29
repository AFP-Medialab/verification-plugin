import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loadLanguages } from "redux/reducers/languageSupportReducer";

const useLoadSupportedLanguage = () => {
  const dispatch = useDispatch();
  const lngurl =
    process.env.REACT_APP_TRANSLATION_URL +
    "/languages?tag=" +
    process.env.REACT_APP_TRANSLATION_TAG;

  useEffect(() => {
    axios.get(lngurl).then((result) => {
      dispatch(loadLanguages(result.data));
    });
  }, []);
};

export default useLoadSupportedLanguage;
