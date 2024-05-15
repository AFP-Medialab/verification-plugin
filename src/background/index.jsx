import { trackEvent } from "../components/Shared/GoogleAnalytics/MatomoAnalytics";
import {
  SEARCH_ENGINE_SETTINGS,
  reverseImageSearch,
  reverseImageSearchAll,
} from "../components/Shared/ReverseSearch/reverseSearchUtils";
import { openTabs } from "components/Shared/ReverseSearch/utils/openTabUtils";
import { getImgUrl } from "components/Shared/ReverseSearch/utils/searchUtils";

const page_name = "popup.html";

const mediaAssistant = (info) => {
  let url = getImgUrl(info);
  if (url !== "") {
    openTabs({
      url: page_name + "#/app/assistant/" + encodeURIComponent(url),
    });
    // Google analytics
    trackEvent("contextMenu", "contextMenuClick", "Assistant", url, "");
  }
};

const ocr = (info) => {
  let url = getImgUrl(info);
  if (url !== "") {
    openTabs({
      url: page_name + "#/app/tools/ocr/" + encodeURIComponent(url),
    });
    // Google analytics
    trackEvent("contextMenu", "contextMenuClick", "OCR", url, "");
  }
};

const thumbnailsSearch = (info) => {
  let url = info.linkUrl;
  if (url !== "" && url.startsWith("http")) {
    openTabs({
      url: page_name + "#/app/tools/thumbnails/" + encodeURIComponent(url),
    });
    // Google analytics
    trackEvent("contextMenu", "contextMenuClick", "YouTubeThumbnails", url, "");
  }
};

const videoReversesearchDBKF = (info) => {
  let search_url =
    "https://weverify-demo.ontotext.com/#!/similaritySearchResults&type=Videos&params=";
  let urlvideo = info.linkUrl;
  if (urlvideo !== "" && urlvideo.startsWith("http")) {
    let url = search_url + encodeURIComponent(urlvideo);
    openTabs({
      url: url,
      selected: false,
    });
    // Google analytics
    trackEvent(
      "contextMenu",
      "contextMenuClick",
      "Video Reverse Search - DBKF (beta)",
      url,
    );
  }
};

const analysisVideo = (info) => {
  let url = info.linkUrl;
  if (url !== "") {
    openTabs({
      url: page_name + "#/app/tools/Analysis/" + encodeURIComponent(url),
    });
    // Google analytics
    trackEvent("contextMenu", "contextMenuClick", "Analysis", url, "");
  }
};

const imageMagnifier = (info) => {
  let url = getImgUrl(info);
  if (url !== "") {
    openTabs({
      url: page_name + "#/app/tools/magnifier/" + encodeURIComponent(url),
    });
    // Google analytics
    trackEvent("contextMenu", "contextMenuClick", "Magnifier", url, "");
  }
};

const imageForensic = (info) => {
  let url = getImgUrl(info);
  if (url !== "") {
    openTabs({
      url: page_name + "#/app/tools/forensic/" + encodeURIComponent(url),
    });
    // Google analytics
    trackEvent("contextMenu", "contextMenuClick", "Forensic", url, "");
  }
};

function contextClick(info) {
  const { menuItemId } = info;

  switch (menuItemId) {
    case "assistant":
      mediaAssistant(info);
      break;
    case "ocr":
      ocr(info);
      break;
    case "thumbnail":
      thumbnailsSearch(info);
      break;
    case "dbkf":
      videoReversesearchDBKF(info);
      break;
    case "video_analysis":
      analysisVideo(info);
      break;
    case "magnifier":
      imageMagnifier(info);
      break;
    case "forensic":
      imageForensic(info);
      break;
    case SEARCH_ENGINE_SETTINGS.ALL.CONTEXT_MENU_ID:
      reverseImageSearchAll(info, false);
      break;
    case SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.CONTEXT_MENU_ID:
      reverseImageSearch(info, false, SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.CONTEXT_MENU_ID:
      reverseImageSearch(
        info,
        false,
        SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.NAME,
      );
      break;
    case SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.CONTEXT_MENU_ID:
      reverseImageSearch(
        info,
        false,
        SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.NAME,
      );
      break;
    case SEARCH_ENGINE_SETTINGS.BING_SEARCH.CONTEXT_MENU_ID:
      reverseImageSearch(info, false, SEARCH_ENGINE_SETTINGS.BING_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.CONTEXT_MENU_ID:
      reverseImageSearch(
        info,
        false,
        SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.NAME,
      );
      break;
    case SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.CONTEXT_MENU_ID:
      reverseImageSearch(info, false, SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.GOOGLE_FACT_CHECK.CONTEXT_MENU_ID:
      reverseImageSearch(
        info,
        false,
        SEARCH_ENGINE_SETTINGS.GOOGLE_FACT_CHECK.NAME,
      );
      break;
    default:
      break;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "assistant",
    title: "Open with assistant",
    contexts: ["image", "video"],
  });
  chrome.contextMenus.create({
    id: "ocr",
    title: "Open with OCR",
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: "thumbnail",
    title: "Youtube thumbnails reverse search",
    contexts: ["link", "video"],
    targetUrlPatterns: ["https://www.youtube.com/*", "https://youtu.be/*"],
  });
  chrome.contextMenus.create({
    id: "dbkf",
    title: "Video Reverse Search - DBKF (beta)",
    contexts: ["link", "video"],
  });
  chrome.contextMenus.create({
    id: "video_analysis",
    title: "Video contextual Analysis",
    contexts: ["link", "video"],
    targetUrlPatterns: [
      "https://www.youtube.com/*",
      "https://youtu.be/*",
      "https://www.facebook.com/*/videos/*",
      "https://www.facebook.com/*",
      "https://twitter.com/*",
    ],
  });
  chrome.contextMenus.create({
    id: "magnifier",
    title: "Image Magnifier",
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: "forensic",
    title: "Image Forensic",
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: SEARCH_ENGINE_SETTINGS.ALL.CONTEXT_MENU_ID,
    title: SEARCH_ENGINE_SETTINGS.ALL.CONTEXT_MENU_TITLE,
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.CONTEXT_MENU_ID,
    title: SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.CONTEXT_MENU_TITLE,
    contexts: ["image"],
    targetUrlPatterns: ["http://*:*/*", "https://*:*/*"],
  });
  chrome.contextMenus.create({
    id: SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.CONTEXT_MENU_ID,
    title: SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.CONTEXT_MENU_TITLE,
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.CONTEXT_MENU_ID,
    title: SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.CONTEXT_MENU_TITLE,
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: SEARCH_ENGINE_SETTINGS.BING_SEARCH.CONTEXT_MENU_ID,
    title: SEARCH_ENGINE_SETTINGS.BING_SEARCH.CONTEXT_MENU_TITLE,
    contexts: ["image"],
    targetUrlPatterns: ["http://*:*/*", "https://*:*/*"],
  });
  chrome.contextMenus.create({
    id: SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.CONTEXT_MENU_ID,
    title: SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.CONTEXT_MENU_TITLE,
    contexts: ["image"],
    targetUrlPatterns: ["http://*:*/*", "https://*:*/*"],
  });
  chrome.contextMenus.create({
    id: SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.CONTEXT_MENU_ID,
    title: SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.CONTEXT_MENU_TITLE,
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: SEARCH_ENGINE_SETTINGS.GOOGLE_FACT_CHECK.CONTEXT_MENU_ID,
    title: SEARCH_ENGINE_SETTINGS.GOOGLE_FACT_CHECK.CONTEXT_MENU_TITLE,
    contexts: ["image"],
  });
});
chrome.contextMenus.onClicked.addListener(contextClick);
