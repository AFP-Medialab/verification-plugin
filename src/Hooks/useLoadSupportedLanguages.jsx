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

      // const filterLanguages = () => {
      //   const languageKeyToFilter = "ja";
      //
      //   return Object.entries(languages)
      //     .filter(([languageKey]) => languageKey !== languageKeyToFilter)
      //     .reduce((filteredList, [key, value]) => {
      //       filteredList[key] = value;
      //       return filteredList;
      //     }, {});
      // };
      //
      // const filteredLanguages =
      //   role.includes(ROLES.EXTRA_FEATURE) ||
      //   role.includes(ROLES.BETA_LANGUAGES)
      //     ? languages
      //     : filterLanguages();

      dispatch(loadLanguages(languages));
    });
  }, [userAuthenticated]);
};

export default useLoadSupportedLanguage;
