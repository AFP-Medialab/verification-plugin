import {
  getBlob,
  isBase64,
  getImgUrl,
  getLocalImageFromSourcePath,
} from "./utils/searchUtils";

import { dbkfReverseSearch } from "./engines/dbkf";
import { baiduReverseSearch } from "./engines/baidu";
import { googleLensReversearch } from "./engines/google-lens";
import { yandexReverseSearch } from "./engines/yandex";
import { bingReverseSearch } from "./engines/bing";
import { tineyeReverseSearch } from "./engines/tineye";
import { ImageObject, IMAGE_FORMATS } from "./utils/searchUtils";
import { googleFactCheckReverseSearch } from "./engines/google-factcheck";
import { trackEvent } from "../GoogleAnalytics/MatomoAnalytics";

export const SEARCH_ENGINE_SETTINGS = {
  // To open all search engines at once
  ALL: {
    NAME: "All",
    CONTEXT_MENU_ID: "reverse_search_all",
    CONTEXT_MENU_TITLE: "Image Reverse Search - ALL",
  },
  DBKF_SEARCH: {
    NAME: "DBKF",
    CONTEXT_MENU_ID: "reverse_search_dbkf",
    CONTEXT_MENU_TITLE: "Image Reverse Search - DBKF (beta)",
    SUPPORTED_IMAGE_FORMAT: [IMAGE_FORMATS.URI],
  },
  GOOGLE_LENS_SEARCH: {
    NAME: "Google Lens",
    CONTEXT_MENU_ID: "reverse_search_google_lens",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Google Lens",
    SUPPORTED_IMAGE_FORMAT: [
      IMAGE_FORMATS.URI,
      IMAGE_FORMATS.BLOB,
      IMAGE_FORMATS.LOCAL,
    ],
  },
  BAIDU_SEARCH: {
    NAME: "Baidu",
    CONTEXT_MENU_ID: "reverse_search_baidu",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Baidu",
    SUPPORTED_IMAGE_FORMAT: [
      IMAGE_FORMATS.BLOB,
      IMAGE_FORMATS.LOCAL,
      IMAGE_FORMATS.URI,
    ],
  },
  YANDEX_SEARCH: {
    NAME: "Yandex",
    CONTEXT_MENU_ID: "reverse_search_yandex",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Yandex",
    SUPPORTED_IMAGE_FORMAT: [
      IMAGE_FORMATS.URI,
      IMAGE_FORMATS.BLOB,
      IMAGE_FORMATS.LOCAL,
    ],
  },
  BING_SEARCH: {
    NAME: "Bing",
    CONTEXT_MENU_ID: "reverse_search_bing",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Bing",
    SUPPORTED_IMAGE_FORMAT: [IMAGE_FORMATS.URI],
  },
  TINEYE_SEARCH: {
    NAME: "Tineye",
    CONTEXT_MENU_ID: "reverse_search_tineye",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Tineye",
    SUPPORTED_IMAGE_FORMAT: [IMAGE_FORMATS.URI],
  },
  GOOGLE_FACT_CHECK: {
    NAME: "Google Fact Check",
    CONTEXT_MENU_ID: "reverse_google_factcheck",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Google Factcheck",
    SUPPORTED_IMAGE_FORMAT: [
      IMAGE_FORMATS.URI,
      IMAGE_FORMATS.BLOB,
      IMAGE_FORMATS.LOCAL,
    ],
  },
};

const getSearchEngineFromName = (searchEngineName) => {
  if (typeof searchEngineName !== "string" || !searchEngineName) {
    throw new Error("[getSearchEngineFromName] Error: Invalid string");
  }

  for (const searchEngine of Object.values(SEARCH_ENGINE_SETTINGS)) {
    if (searchEngineName === searchEngine.NAME) {
      return searchEngine;
    }
  }

  throw new Error(
    `[getSearchEngineFromName] Error: Search Engine not found for searchEngineName ${searchEngineName}`,
  );
};

/**
 * Description
 * @param {any} info
 * @param {string} searchEngineName
 * @returns {Promise<ImageObject>}
 */
const retrieveImgObjectForSearchEngine = async (info, searchEngineName) => {
  const searchEngine = getSearchEngineFromName(searchEngineName);
  //console.log("search engine ", searchEngine)
  //console.log("content incoming ", info);
  // get incoming format
  // Can be :
  // - Object
  // - String URL
  // - Data content
  // check if engine supported format
  // if not convert to supported if possible

  let inputFormat;

  if (info && info.srcUrl) {
    //info is object
    let srcURL = info.srcUrl;
    if (srcURL.startsWith("file")) inputFormat = IMAGE_FORMATS.LOCAL;
    else inputFormat = IMAGE_FORMATS.URI;
  } else if (typeof info === "string") {
    //is String
    inputFormat =
      // @ts-ignore
      info.startsWith("http")
        ? IMAGE_FORMATS.URI
        : // @ts-ignore
        info.startsWith("file")
        ? IMAGE_FORMATS.LOCAL
        : IMAGE_FORMATS.UNKNOW;
  } else {
    // is data content
    inputFormat = IMAGE_FORMATS.UNKNOW;
  }
  let engineSupportedFormat = searchEngine.SUPPORTED_IMAGE_FORMAT;
  //console.log("inputFormat  after", inputFormat);
  //console.log("engineSupportedFormat  after", engineSupportedFormat);
  if (engineSupportedFormat.includes(inputFormat)) {
    if (inputFormat === IMAGE_FORMATS.URI) {
      return new ImageObject(getImgUrl(info), IMAGE_FORMATS.URI);
    }

    if (inputFormat === IMAGE_FORMATS.BLOB) {
      return await getBlob(info);
    }

    if (inputFormat === IMAGE_FORMATS.B64) {
      if (isBase64(info)) {
        return new ImageObject(info, IMAGE_FORMATS.B64);
      } else {
        return await getLocalImageFromSourcePath(info, IMAGE_FORMATS.B64);
      }
      // TODO: local image
    }
    if (inputFormat === IMAGE_FORMATS.LOCAL) {
      //console.log("local ", info);
      return await getBlob(info);
    }
  } else {
    // UNKNOW => LOCAL
    //console.log("unknow ", info);
    return await getBlob(info);
  }

  throw new Error(
    `[retrieveImgObjectForSearchEngine] Error: Image format ${searchEngine.IMAGE_FORMAT} not supported`,
  );
};

export const reverseImageSearch = async (
  /** @type {any} */ content,
  /** @type {string} */ searchEngineName,
  isRequestFromContextMenu = true,
) => {
  const imageObject = await retrieveImgObjectForSearchEngine(
    content,
    searchEngineName,
  );
  trackEvent(
    "submission",
    "reverseImageSearch",
    searchEngineName,
    imageObject.imageFormat === IMAGE_FORMATS.URI
      ? imageObject.obj
      : "local bundle",
    null,
  );
  switch (searchEngineName) {
    case SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.NAME:
      dbkfReverseSearch(imageObject, isRequestFromContextMenu);
      break;
    case SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.NAME:
      googleLensReversearch(imageObject, isRequestFromContextMenu);
      break;
    case SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.NAME:
      yandexReverseSearch(imageObject, isRequestFromContextMenu);
      break;
    case SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.NAME:
      baiduReverseSearch(imageObject, isRequestFromContextMenu);
      break;
    case SEARCH_ENGINE_SETTINGS.BING_SEARCH.NAME:
      bingReverseSearch(imageObject, isRequestFromContextMenu);
      break;
    case SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.NAME:
      tineyeReverseSearch(imageObject, isRequestFromContextMenu);
      break;
    case SEARCH_ENGINE_SETTINGS.GOOGLE_FACT_CHECK.NAME:
      googleFactCheckReverseSearch(imageObject, isRequestFromContextMenu);
      break;
  }
};

export const reverseImageSearchAll = async (
  /** @type {any} */ content,
  isRequestFromContextMenu = true,
) => {
  let promises = [];

  for (const searchEngineSetting of Object.values(SEARCH_ENGINE_SETTINGS)) {
    if (searchEngineSetting.NAME === SEARCH_ENGINE_SETTINGS.ALL.NAME) {
      continue;
    }
    promises.push(
      reverseImageSearch(
        content,
        searchEngineSetting.NAME,
        isRequestFromContextMenu,
      ),
    );
  }
  await Promise.all(promises);
};
