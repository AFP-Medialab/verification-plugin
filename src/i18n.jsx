import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HTTPBackend from "i18next-http-backend";
import ChainedBackend from "i18next-chained-backend";
//import resourcesToBackend from "i18next-resources-to-backend";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(ChainedBackend)
  .init({
    debug: true,
    ns: ["components/PopUp"],
    defaultNS: "components/PopUp",
    fallbackLng: "en",
    saveMissing: true,
    interpolation: {
      escapeValue: false,
    },
    load: "languageOnly",
    backend: {
      backends: [
        HTTPBackend,
        //resourcesToBackend((lng, ns) => import(`./LocaLDictionary/locales/${lng}/${ns}.json`))
        HTTPBackend,
      ],

      backendOptions: [
        {
          loadPath:
            "https://weverify-medialab.afp.com/translate/dictionaries/{{ns}}.tsv?lang={{lng}}&tag=v0.77",
          //loadPath: "http://localhost:8080/dictionaries/{{ns}}.tsv?lang={{lng}}",

          crossDomain: true,
          requestOptions: {
            // used for fetch, can also be a function (payload) => ({ method: 'GET' })
            mode: "cors",
            credentials: "same-origin",
          },
        },
        {
          loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
      ],
    },
  });
