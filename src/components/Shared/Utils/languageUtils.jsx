import LanguageDictionary from "../../../LocalDictionary/iso-639-1-languages";

export const getLanguageName = (language) => {
  if (
    !language ||
    typeof language !== "string" ||
    !LanguageDictionary[language] ||
    typeof LanguageDictionary[language].name !== "string"
  ) {
    //TODO: Error handling
    // console.error(
    //   `Error: the language code ${language} is not ISO-639-1 compatible`,
    // );
    return language;
  }
  return LanguageDictionary[language].name.split(";")[0];
};

export const getLanguageCodeFromName = (name) => {
  const code = Object.keys(LanguageDictionary).find(
    (key) => LanguageDictionary[key].name === name,
  );

  return code ? code : name;
};
