import { openTabs } from "components/Shared/ReverseSearch/utils/openTabUtils";
import { getImgUrl } from "components/Shared/ReverseSearch/utils/searchUtils";
import Dexie from "dexie";

import { trackEvent } from "../components/Shared/GoogleAnalytics/MatomoAnalytics";
import {
  SEARCH_ENGINE_SETTINGS,
  reverseImageSearch,
  reverseImageSearchAll,
} from "../components/Shared/ReverseSearch/reverseSearchUtils";

const db = new Dexie("tweetTest");
db.version(1).stores({
  tweets: "id,tweet,collectionID",
  collections: "id",
  recording: "id,state",
});
const page_name = "popup.html";

const mediaAssistant = (info) => {
  let url = getImgUrl(info);
  if (url !== "") {
    openTabs({
      url: page_name + "#/app/assistant/" + encodeURIComponent(url),
    });
    // Analytics
    trackEvent("contextMenu", "contextMenuClick", "Assistant", url, "");
  }
};

const ocr = (info) => {
  let url = getImgUrl(info);
  if (url !== "") {
    openTabs({
      url: page_name + "#/app/tools/ocr/" + encodeURIComponent(url),
    });
    // Analytics
    trackEvent("contextMenu", "contextMenuClick", "OCR", url, "");
  }
};

const thumbnailsSearch = (info) => {
  let url = info.linkUrl;
  if (url !== "" && url.startsWith("http")) {
    openTabs({
      url: page_name + "#/app/tools/thumbnails/" + encodeURIComponent(url),
    });
    // Analytics
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
    // Analytics
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
    // Analytics
    trackEvent("contextMenu", "contextMenuClick", "Analysis", url, "");
  }
};

const imageMagnifier = (info) => {
  let url = getImgUrl(info);
  if (url !== "") {
    openTabs({
      url: page_name + "#/app/tools/magnifier/" + encodeURIComponent(url),
    });
    // Analytics
    trackEvent("contextMenu", "contextMenuClick", "Magnifier", url, "");
  }
};

const imageForensic = (info) => {
  let url = getImgUrl(info);
  if (url !== "") {
    openTabs({
      url: page_name + "#/app/tools/forensic/" + encodeURIComponent(url),
    });
    // Analytics
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
      reverseImageSearchAll(info);
      break;
    case SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.CONTEXT_MENU_ID:
      reverseImageSearch(info, SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.CONTEXT_MENU_ID:
      reverseImageSearch(info, SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.CONTEXT_MENU_ID:
      reverseImageSearch(info, SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.BING_SEARCH.CONTEXT_MENU_ID:
      reverseImageSearch(info, SEARCH_ENGINE_SETTINGS.BING_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.CONTEXT_MENU_ID:
      reverseImageSearch(info, SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.CONTEXT_MENU_ID:
      reverseImageSearch(info, SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.NAME);
      break;
    case SEARCH_ENGINE_SETTINGS.GOOGLE_FACT_CHECK.CONTEXT_MENU_ID:
      reverseImageSearch(info, SEARCH_ENGINE_SETTINGS.GOOGLE_FACT_CHECK.NAME);
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
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
chrome.contextMenus.onClicked.addListener(contextClick);
chrome.webNavigation.onCommitted.addListener(async () => {
  let recordingState = await db.recording.toArray();
  let recordingSession = recordingState[0].state;
  console.log(recordingSession);
  if (recordingSession === false) {
    return;
  }
  let currentTab = await getCurrentTab();
  if (
    !currentTab.url.includes(".x.com") &&
    !currentTab.url.includes("/x.com")
  ) {
    return;
  }
  try {
    chrome.scripting.executeScript({
      target: { tabId: currentTab.id, allFrames: true },
      function: () => {
        let pluginId = chrome.runtime.id;
        var s = document.createElement("script");
        s.dataset.params = pluginId;
        // must be listed in web_accessible_resources in manifest.json
        s.src = chrome.runtime.getURL("inject.js");
        s.onload = function () {
          this.remove();
        };
        (document.head || document.documentElement).appendChild(s);
      },
    });
  } catch (e) {
    console.log(e);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  (async (request) => {
    const jp = require("jsonpath");

    if (request.prompt === "getTweets") {
      const t = await db.tweets.toArray();

      console.log(t);
      const ts = jp.query(t, "$..tweet_results");
      console.log(ts);
      let y = t.map((tw) => {
        return {
          collID: tw.collectionID,
          res: jp.query(tw, "$..tweet_results")[0],
        };
      });
      console.log(y);
      let x = y.map((ent) => ({
        collectionID: ent.collID,
        id: jp.query(ent.res, "$.result..rest_id")[0],
        username: "@" + jp.query(ent.res, "$..user_results..screen_name")[0],
        display_name: jp.query(ent.res, "$..user_results..name")[0],
        account_created: jp.query(ent.res, "$..user_results..created_at")[0],
        followers: jp.query(ent.res, "$..user_results..followers_count")[0],
        total_posts: jp.query(ent.res, "$..user_results..statuses_count")[0],
        tweet_text: jp.query(ent.res, "$..result.legacy.full_text")[0],
        replying_to:
          jp.query(ent, "$..result.legacy.in_reply_to_screen_name")[0] || false,
        isQuote: jp.query(ent, "$..result.legacy.is_quote_status")[0] || false,
        retweeted: jp.query(ent, "$..result.legacy.retweeted")[0] || false,
        links: jp
          .query(ent, "$..result.legacy.entities.urls")
          .flat(1)
          .map((obj) => (obj.expanded_url ? obj.expanded_url : {})),
        mentions: jp
          .query(ent, "$..result.legacy.entities.user_mentions")
          .flat(1)
          .map((obj) => (obj.screen_name ? obj.screen_name : {})),
        hashtags: jp
          .query(ent, "$..result.legacy.entities.hashtags")
          .flat(1)
          .map((obj) => (obj.text ? obj.text : {})),
        date: jp.query(ent.res, "$.result.legacy.created_at")[0],
        likes: jp.query(ent.res, "$..favorite_count")[0],
        quotes: jp.query(ent.res, "$..quote_count")[0],
        retweets: jp.query(ent.res, "$..retweet_count")[0],
        replies: jp.query(ent.res, "$..reply_count")[0],
        views: jp.query(ent.res, "$..result.views.count")[0]
          ? jp.query(ent.res, "$..result.views.count")[0]
          : 0,
        TweetLink:
          "https://x.com/" +
          jp.query(ent.res, "$..user_results..screen_name")[0] +
          "/status/" +
          jp.query(ent.res, "$.result..rest_id")[0],
      }));
      console.log(x);
      sendResponse(x);
    } else if (request.prompt === "viewTweets") {
      const t = await db.tweets.toArray();
      console.log(t);
    } else if (request.prompt === "delete") {
      db.delete().then(() => db.open());
    } else if (request.prompt === "deleteTweets") {
      console.log("del");
      const x = await db.tweets
        .where("collectionID")
        .equalsIgnoreCase(request.collection)
        .toArray();
      console.log(x);
      await db.tweets
        .where("collectionID")
        .equalsIgnoreCase(request.collection)
        .delete();
      await db.collections
        .where("id")
        .equalsIgnoreCase(request.collection)
        .delete();
    } else if (request.prompt === "getRecordingInfo") {
      const t = await db.collections.toArray();
      if (!t.includes("Default Collection")) {
        await db.collections.put({ id: "Default Collection" });
      }
      const r = await db.collections.toArray();
      const state = await db.recording.toArray();
      console.log(state);
      console.log(state.length);
      if (state.length === 0) {
        await db.recording.put({ id: "main", state: false });
      }
      const s = await db.recording.toArray();
      console.log(s, r);
      sendResponse({ recording: s, collections: r });
    } else if (request.prompt === "addCollection") {
      await db.collections.put({ id: request.newCollectionName });
    } else if (request.prompt === "stopRecording") {
      await db.recording.put({ id: "main", state: false });
    } else if (request.prompt === "startRecording") {
      await db.recording.put({
        id: "main",
        state: request.currentCollectionName,
      });
    }
  })(request);
  return true;
});

chrome.runtime.onMessageExternal.addListener(
  async function (request, sender, sendResponse) {
    const jp = require("jsonpath");
    const entryIds = jp.query(request, "$..entryId");
    const session = await db.recording.toArray();
    console.log("RECEIVED REQUEST TO SAVE TWEETS");
    console.log(request);

    const currentSession = session[0].state;
    console.log("CURRENTLY RECORDING ? " + currentSession);
    if (currentSession === false) {
      return;
    }
    if (jp.query(request, "$..entryId").length > 0) {
      for (let entryId of entryIds) {
        let current = jp.query(
          request,
          `$..entries[?(@.entryId=="${entryId}")]`,
        );
        jp.query(
          request,
          `$..entries[?(@.entryId=="${entryId}")]..tweet_results`,
        ).length > 0
          ? await db.tweets.put({
              id: entryId,
              tweet: current[0],
              collectionID: currentSession,
            })
          : {};
      }
    }
  },
);

chrome.runtime.onStartup.addListener();
