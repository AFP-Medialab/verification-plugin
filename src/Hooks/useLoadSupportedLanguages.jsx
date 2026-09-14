import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loadLanguages } from "@/redux/reducers/languageSupportReducer";
import axios from "axios";

const useLoadSupportedLanguage = () => {
  const dispatch = useDispatch();
  const userAuthenticated = useSelector(
    (state) => state.userSession.userAuthenticated,
  );
  const languageIsLoaded = useSelector(
    (state) => state.languageSupport.alreadyLoaded,
  );

  const languagesUrl =
    import.meta.env.VITE_TRANSLATION_URL +
    "/languages?tag=" +
    import.meta.env.VITE_TRANSLATION_TAG;

  useEffect(() => {
    if (languageIsLoaded) return;

    if (!navigator.onLine) {
      dispatch(loadLanguages({ en: "English", ar: "عربي" }));
      return;
    }

    axios
      .get(languagesUrl)
      .then((result) => {
        dispatch(loadLanguages(result.data));
      })
      .catch(() => {
        dispatch(loadLanguages({ en: "English", ar: "عربي" }));
      });
  }, [userAuthenticated]);
};

export default useLoadSupportedLanguage;
