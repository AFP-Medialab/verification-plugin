import {
  localImageGoogleSearch,
  localImageYandexSearch,
  localImageBingSearch,
  localImageBaiduSearch,
  loadImage,
  loadImageContent,
  SEARCH_ENGINE_SETTINGS,
} from "../components/Shared/ReverseSearch/reverseSearchUtils";

let page_name = "popup.html";

const rightClickEvent = (toolName, media) => {
  return true;
};

const getUrlImg = (info) => {
  var query = info.pageUrl;
  if (info.mediaType === "image") {
    return info.srcUrl;
  }
  return query;
};

const mediaAssistant = (info) => {
  let url = getUrlImg(info);
  if (url !== "") {
    chrome.tabs.create({
      url: page_name + "#/app/assistant/" + encodeURIComponent(url),
    });
    // Google analytics
    rightClickEvent("Assistant", url);
  }
};

const ocr = (info) => {
  let url = getUrlImg(info);
  if (url !== "") {
    chrome.tabs.create({
      url: page_name + "#/app/tools/ocr/" + encodeURIComponent(url),
    });
    // Google analytics
    rightClickEvent("OCR", url);
  }
};

const thumbnailsSearch = (info) => {
  let url = info.linkUrl;
  if (url !== "" && url.startsWith("http")) {
    let lst = get_images(url);
    for (let index in lst) {
      chrome.tabs.create({
        url: lst[index],
      });
    }
    // Google analytics
    rightClickEvent("YouTubeThumbnails", url);
  }
};

const videoReversesearchDBKF = (info) => {
  let search_url =
    "https://weverify-demo.ontotext.com/#!/similaritySearchResults&type=Videos&params=";
  let urlvideo = info.linkUrl;
  if (urlvideo !== "" && urlvideo.startsWith("http")) {
    let url = search_url + encodeURIComponent(urlvideo);
    chrome.tabs.create({
      url: url,
      selected: false,
    });
    // Google analytics
    rightClickEvent("Video Reverse Search - DBKF (beta)", url);
  }
};

const analysisVideo = (info) => {
  let url = info.linkUrl;
  if (url !== "") {
    chrome.tabs.create({
      url: page_name + "#/app/tools/Analysis/" + encodeURIComponent(url),
    });
    // Google analytics
    rightClickEvent("Analysis", url);
  }
};

const imageMagnifier = (info) => {
  let url = getUrlImg(info);
  if (url !== "") {
    chrome.tabs.create({
      url: page_name + "#/app/tools/magnifier/" + encodeURIComponent(url),
    });
    // Google analytics
    rightClickEvent("Magnifier", url);
  }
};

const imageForensic = (info) => {
  let url = getUrlImg(info);
  if (url !== "" && url.startsWith("http")) {
    chrome.tabs.create({
      url: page_name + "#/app/tools/forensic/" + encodeURIComponent(url),
    });
    // Google analytics
    rightClickEvent("Forensic", url);
  }
};

const imageReversesearchDBKF = (info) => {
  let search_url =
    "http://weverify-demo.ontotext.com/#!/similaritySearchResults&type=Images&params=";
  let img = getUrlImg(info);
  if (img !== "" && img.startsWith("http")) {
    let url = search_url + encodeURIComponent(img);
    chrome.tabs.create({
      url: url,
      selected: false,
    });
    // Google analytics
    rightClickEvent("Image Reverse Search - DBKF (beta)", url);
  }
};

const imageReversesearch = (info, searchEngine) => {
  let img = getUrlImg(info);

  if (img === "") {
    // TODO: Error handling
    throw new Error("[imageReversesearch] Error: Empty string");
  }

  if (searchEngine === SEARCH_ENGINE_SETTINGS.GOOGLE_SEARCH.NAME)
    loadImageContent(img, localImageGoogleSearch);
  else if (searchEngine === SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.NAME)
    loadImageContent(img, localImageYandexSearch);
  else if (searchEngine === SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.NAME)
    loadImageContent(img, localImageBaiduSearch);
  else if (searchEngine === SEARCH_ENGINE_SETTINGS.BING_SEARCH.NAME) {
    // TODO: move all the logic in one single function
    const search_url = "https://www.bing.com/images/search?q=imgurl:";
    const img = getUrlImg(info);
    if (img !== "" && img.startsWith("http")) {
      const url =
        search_url + encodeURIComponent(img) + "&view=detailv2&iss=sbi";
      chrome.tabs.create({ url: url });
    } else if (img !== "") {
      loadImageContent(img, localImageBingSearch);
    }
  } else if (searchEngine === SEARCH_ENGINE_SETTINGS.REDDIT_SEARCH.NAME) {
    // TODO
  } else if (searchEngine === SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.NAME) {
    // TODO
  }
};

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
    id: "reverse_search_all",
    title: "Image Reverse Search - ALL",
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: "dbkf_image",
    title: "Image Reverse Search - DBKF (beta)",
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: SEARCH_ENGINE_SETTINGS.GOOGLE_SEARCH.CONTEXT_MENU_ID,
    title: SEARCH_ENGINE_SETTINGS.GOOGLE_SEARCH.CONTEXT_MENU_TITLE,
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
  });
  chrome.contextMenus.create({
    id: "reverse_search_tineye",
    title: "Image Reverse Search - Tineye",
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.CONTEXT_MENU_ID,
    title: SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.CONTEXT_MENU_TITLE,
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: "reverse_search_reddit",
    title: "Image Reverse Search - Reddit",
    contexts: ["image"],
  });
});

function contextClick(info, tab) {
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
    case "reverse_search_all":
      imageReversesearchAll(info);
      break;
    case "dbkf_image":
      imageReversesearchDBKF(info);
      break;
    case SEARCH_ENGINE_SETTINGS.GOOGLE_SEARCH.CONTEXT_MENU_ID:
      imageReversesearch(info, SEARCH_ENGINE_SETTINGS.GOOGLE_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.CONTEXT_MENU_ID:
      imageReversesearch(info, SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.BING_SEARCH.CONTEXT_MENU_ID:
      imageReversesearch(info, SEARCH_ENGINE_SETTINGS.BING_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.CONTEXT_MENU_ID:
      imageReversesearch(info, SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.CONTEXT_MENU_ID:
      imageReversesearch(info, SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.REDDIT_SEARCH.CONTEXT_MENU_ID:
      imageReversesearch(info, SEARCH_ENGINE_SETTINGS.REDDIT_SEARCH.NAME);
      break;
    default:
      break;
  }
}

chrome.contextMenus.onClicked.addListener(contextClick);
