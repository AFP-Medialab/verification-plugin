import LanguageDictionary from "../../../LocalDictionary/iso-639-1-languages";

export const getLanguageName = (language, locale) => {
  if (
    !locale ||
    !language ||
    typeof language !== "string" ||
    !LanguageDictionary[language] ||
    typeof LanguageDictionary[language][locale] !== "string"
  ) {
    //TODO: Error handling
    // console.error(
    //   `Error: the language code ${language} is not ISO-639-1 compatible`,
    // );
    return LanguageDictionary["en"]["en"];
  }
  return LanguageDictionary[language][locale];
};

export const getLanguageCodeFromName = (name, locale) => {
  let code;

  if (locale)
    code = Object.keys(LanguageDictionary).find(
      (key) => LanguageDictionary[key][locale] === name,
    );
  else
    code = Object.keys(LanguageDictionary).find(
      (key) => LanguageDictionary[key]["en"] === name,
    );

  return code ? code : name;
};
