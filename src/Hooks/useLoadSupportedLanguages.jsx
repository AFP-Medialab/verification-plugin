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
    // If already loaded, return
    if (languageIsLoaded) {
      return;
    }

    axios.get(languagesUrl).then((result) => {
      const languages = result.data;

      dispatch(loadLanguages(languages));
    });
  }, [userAuthenticated]);
};

export default useLoadSupportedLanguage;
