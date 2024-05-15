import {
  getBlob,
  isBase64,
  getImgUrl,
  getLocalImageFromSourcePath,
} from "./utils/searchUtils";

import { reverseImageSearchDBKF } from "./engines/dbkf";
import { reverseImageSearchBaidu } from "./engines/baidu";
import {
  reverseRemoteGoogleLens,
  reverseImageSearchGoogleLens,
} from "./engines/google-lens";
import {
  reverseImageSearchYandexURI,
  reverseImageSearchYandex,
} from "./engines/yandex";
import {
  reverseImageSearchBingURI,
  reverseImageSearchBing,
} from "./engines/bing";
import { reverseImageSearchTineye } from "./engines/tineye";
import { ImageObject, IMAGE_FORMATS } from "./utils/searchUtils";
import { reverseImageSearchGoogleFactCheck } from "./engines/google-factcheck";

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
    URI: "http://weverify-demo.ontotext.com/#!/similaritySearchResults&type=Images&params=",
    IMAGE_FORMAT: IMAGE_FORMATS.URI,
    SUPPORTED_IMAGE_FORMAT: [IMAGE_FORMATS.URI],
  },
  GOOGLE_LENS_SEARCH: {
    NAME: "Google Lens",
    CONTEXT_MENU_ID: "reverse_search_google_lens",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Google Lens",
    URI: `https://lens.google.com/upload?ep=ccm&s=&st=${Date.now()}`,
    IMAGE_FORMAT: IMAGE_FORMATS.URI,
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
    URI: "https://graph.baidu.com/upload",
    IMAGE_FORMAT: IMAGE_FORMATS.BLOB,
    SUPPORTED_IMAGE_FORMAT: [IMAGE_FORMATS.BLOB, IMAGE_FORMATS.LOCAL],
  },
  YANDEX_SEARCH: {
    NAME: "Yandex",
    CONTEXT_MENU_ID: "reverse_search_yandex",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Yandex",
    URI: 'https://yandex.com/images/touch/search?rpt=imageview&format=json&request={"blocks":[{"block":"cbir-uploader__get-cbir-id"}]}',
    IMAGE_FORMAT: IMAGE_FORMATS.URI,
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
    URI: "https://www.bing.com/images/search?view=detailv2&iss=sbiupload&FORM=SBIHMP&sbifnm=weverify-local-file",
    URI_LOCAL:
      "https://www.bing.com/images/search?view=detailv2&iss=sbiupload&FORM=SBIHMP&sbifnm=weverify-local-file",
    IMAGE_FORMAT: IMAGE_FORMATS.URI,
    SUPPORTED_IMAGE_FORMAT: [
      IMAGE_FORMATS.URI,
      IMAGE_FORMATS.B64,
      IMAGE_FORMATS.LOCAL,
      IMAGE_FORMATS.BLOB,
    ],
  },
  TINEYE_SEARCH: {
    NAME: "Tineye",
    CONTEXT_MENU_ID: "reverse_search_tineye",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Tineye",
    URI: "https://www.tineye.com/search?url=",
    IMAGE_FORMAT: IMAGE_FORMATS.URI,
    SUPPORTED_IMAGE_FORMAT: [IMAGE_FORMATS.URI],
  },
  GOOGLE_FACT_CHECK: {
    NAME: "Google Fact Check",
    CONTEXT_MENU_ID: "reverse_google_factcheck",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Google Factcheck",
    IMAGE_FORMAT: IMAGE_FORMATS.URI,
    SUPPORTED_IMAGE_FORMAT: [IMAGE_FORMATS.URI],
  },
};

/**
 * Wrapper function to open a new tab from the context menus or from the app
 * @param url The url object
 * @param {boolean} isRequestFromContextMenu
 */
export const openNewTabWithUrl = async (url, isRequestFromContextMenu) => {
  if (isRequestFromContextMenu) openTabsSearch(url);
  else await chrome.tabs.create(url);
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
 * @param {chrome.contextMenus.OnClickData} info
 * @param {string} searchEngineName
 * @returns {Promise<ImageObject>}
 */
const retrieveImgObjectForSearchEngine = async (info, searchEngineName) => {
  const searchEngine = getSearchEngineFromName(searchEngineName);
  //console.log("search engine ", searchEngine)
  console.log("content incoming ", info);
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
  console.log("inputFormat  after", inputFormat);
  console.log("engineSupportedFormat  after", engineSupportedFormat);
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
      console.log("local ", info);
      //return await getLocalImageFromSourcePath(info.srcUrl, IMAGE_FORMATS.B64);
      return await getBlob(info);
    }
  } /*else if (
    inputFormat === IMAGE_FORMATS.URI &&
    engineSupportedFormat.includes(IMAGE_FORMATS.BLOB)
  ) {
    return await getBlob(info);
  } else if (
    inputFormat === IMAGE_FORMATS.URI &&
    engineSupportedFormat.includes(IMAGE_FORMATS.B64)
  ) {
    if (isBase64(info)) {
      return new ImageObject(info, IMAGE_FORMATS.B64);
    } else {
      // if (src) return await getLocalImageFromSourcePath(src, IMAGE_FORMATS.B64);
      // else
      return await getLocalImageFromSourcePath(info, IMAGE_FORMATS.B64);
    }
  } */ else {
    // UNKNOW => LOCAL
    console.log("unknow ", info);
    return await getBlob(info);
  }

  throw new Error(
    `[retrieveImgObjectForSearchEngine] Error: Image format ${searchEngine.IMAGE_FORMAT} not supported`,
  );
};

export const reverseImageSearch = async (
  info,
  isImgUrl,
  searchEngineName,
  isRequestFromContextMenu = true,
) => {
  console.log("search engine ", searchEngineName);
  const imageObject = await retrieveImgObjectForSearchEngine(
    info,
    searchEngineName,
  );
  if (searchEngineName === SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.NAME) {
    if (
      imageObject.imageFormat !==
      SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.IMAGE_FORMAT
    ) {
      throw new Error(`[reverseImageSearch] Error: invalid image format`);
    }

    reverseImageSearchDBKF(imageObject.obj, isRequestFromContextMenu);
  } else if (
    searchEngineName === SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.NAME
  ) {
    //console.log("DEBUG image ", imageObject);
    if (
      imageObject.imageFormat ===
      SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.IMAGE_FORMAT_LOCAL
    )
      reverseImageSearchGoogleLens(imageObject.obj, isRequestFromContextMenu);
    else if (
      imageObject.imageFormat ===
      SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.IMAGE_FORMAT
    ) {
      reverseRemoteGoogleLens(imageObject.obj, isRequestFromContextMenu);
    }
  } else if (searchEngineName === SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.NAME) {
    if (
      imageObject.imageFormat ===
      SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.IMAGE_FORMAT
    ) {
      reverseImageSearchYandexURI(imageObject.obj, isRequestFromContextMenu);
    } else if (
      imageObject.imageFormat ===
      SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.IMAGE_FORMAT_LOCAL
    ) {
      reverseImageSearchYandex(imageObject.obj, isRequestFromContextMenu);
    } else {
      throw new Error(`[reverseImageSearch] Error: invalid image format`);
    }
  } else if (searchEngineName === SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.NAME) {
    if (
      imageObject.imageFormat !==
      SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.IMAGE_FORMAT
    ) {
      throw new Error(`[reverseImageSearch] Error: invalid image format`);
    }

    reverseImageSearchBaidu(imageObject.obj, isRequestFromContextMenu);
  } else if (searchEngineName === SEARCH_ENGINE_SETTINGS.BING_SEARCH.NAME) {
    if (
      SEARCH_ENGINE_SETTINGS.BING_SEARCH.SUPPORTED_IMAGE_FORMAT.includes(
        imageObject.imageFormat,
      )
    ) {
      if (imageObject.imageFormat === IMAGE_FORMATS.URI) {
        reverseImageSearchBingURI(imageObject.obj, isRequestFromContextMenu);
      } else {
        reverseImageSearchBing(imageObject.obj, isRequestFromContextMenu);
      }
    } else {
      throw new Error(`[reverseImageSearch] Error: invalid image format`);
    }
  } else if (searchEngineName === SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.NAME) {
    if (
      imageObject.imageFormat !==
      SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.IMAGE_FORMAT
    ) {
      throw new Error(`[reverseImageSearch] Error: invalid image format`);
    }

    reverseImageSearchTineye(imageObject.obj, isRequestFromContextMenu);
  } else if (
    searchEngineName === SEARCH_ENGINE_SETTINGS.GOOGLE_FACT_CHECK.NAME
  ) {
    if (
      imageObject.imageFormat !==
      SEARCH_ENGINE_SETTINGS.GOOGLE_FACT_CHECK.IMAGE_FORMAT
    ) {
      throw new Error(`[reverseImageSearch] Error: invalid image format`);
    }

    reverseImageSearchGoogleFactCheck(
      imageObject.obj,
      isRequestFromContextMenu,
    );
  } else {
    throw new Error("[reverseImageSearch] Error: Search Engine not supported");
  }
};

export const reverseImageSearchAll = async (
  info,
  isImageUrl,
  isRequestFromContextMenu = true,
) => {
  let promises = [];

  for (const searchEngineSetting of Object.values(SEARCH_ENGINE_SETTINGS)) {
    if (searchEngineSetting.NAME === SEARCH_ENGINE_SETTINGS.ALL.NAME) {
      continue;
    }
    promises.push(
      reverseImageSearch(
        info,
        isImageUrl,
        searchEngineSetting.NAME,
        isRequestFromContextMenu,
      ),
    );
  }
  await Promise.all(promises);
};

export const openTabs = (url) => {
  chrome.tabs.create(url, (createdTab) => {
    chrome.tabs.onUpdated.addListener(async function _(tabId) {
      if (tabId === createdTab.id) {
        chrome.tabs.onUpdated.removeListener(_);
      } else {
        await chrome.tabs.get(tabId, async () => {
          if (!chrome.runtime.lastError) {
            //console.log("tab exist ", tabId)
            await chrome.tabs.remove(tabId, () => {
              if (!chrome.runtime.lastError) {
                //nothing todo
              }
              //chrome.tabs.onUpdated.removeListener(_);
            });
          }
        });
      }
    });
  });
};

const openTabsSearch = (url) => {
  chrome.tabs.create(url, (createdTab) => {
    chrome.tabs.onUpdated.addListener(async function _(tabId, info, tab) {
      let pending_url = ns(createdTab.pendingUrl);
      let tab_url = ns(tab.url);
      if (tabId === createdTab.id && pending_url === tab_url) {
        //console.log("remove .... listerner", tabId);
        chrome.tabs.onUpdated.removeListener(_);
      } else {
        if (pending_url === tab_url) {
          //console.log("remove id ", tabId);
          await chrome.tabs.get(tabId, async () => {
            if (!chrome.runtime.lastError) {
              //console.log("tab exist ", tabId)
              await chrome.tabs.remove(tabId, async () => {
                //nothing todo
                if (!chrome.runtime.lastError) {
                  //nothing todo
                }
              });
            } else {
              //nothing todo
            }
          });
        }
      }
    });
  });
};

function ns(url) {
  let domain = new URL(url);
  return domain.hostname.replace("www.", "");
}
