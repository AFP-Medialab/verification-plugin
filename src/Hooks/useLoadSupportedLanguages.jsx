import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { loadLanguages } from "redux/reducers/languageSupportReducer";

const useLoadSupportedLanguage = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.userSession.user.roles);
  const userAuthenticated = useSelector(
    (state) => state.userSession.userAuthenticated,
  );

  const languagesUrl =
    process.env.REACT_APP_TRANSLATION_URL +
    "/languages?tag=" +
    process.env.REACT_APP_TRANSLATION_TAG;

  useEffect(() => {
    axios.get(languagesUrl).then((result) => {
      const languages = result.data;

      dispatch(loadLanguages(languages));
    });
  }, [userAuthenticated]);
};

export default useLoadSupportedLanguage;
