import { trackEvent } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import {
  SEARCH_ENGINE_SETTINGS,
  reverseImageSearch,
  reverseImageSearchAll,
} from "@Shared/ReverseSearch/reverseSearchUtils";
import { openTabs } from "components/Shared/ReverseSearch/utils/openTabUtils";
import { getImgUrl } from "components/Shared/ReverseSearch/utils/searchUtils";
import dayjs from "dayjs";
import Dexie from "dexie";

const db = new Dexie("tweetTest");
db.version(2).stores({
  tweets: "[id+collectionID], [collectionID+id], tweet",
  tiktoks: "[id+collectionID],[collectionID+id], tiktok",
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

const PLATFORM_URLS = {
  Tiktok: [".tiktok.com", "/tiktok.com"],
  Twitter: [".x.com", "/x.com"],
};

chrome.webNavigation.onCommitted.addListener(async () => {
  let recordingState = await db.recording.toArray();
  let recordingSession = recordingState[0].state;
  let currentTab = await getCurrentTab();
  if (recordingSession === false) {
    return;
  }
  let platforms = recordingState[0].platforms.split(",");
  let url_test = [];
  platforms.forEach((platform) => url_test.push(PLATFORM_URLS[platform]));
  if (
    currentTab.url &&
    !url_test.flat().some((url) => currentTab.url.includes(url))
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
        s.src = chrome.runtime.getURL("inject.js");
        (document.head || document.documentElement).appendChild(s);
      },
    });
  } catch (e) {
    throw Error(e);
  }
});

export const TWEET_PROPERTY_PATHS = {
  id: { path: "rest_id", default: "" },
  username: { path: "core.user_results.result.core.screen_name", default: "" },
  display_name: { path: "core.user_results.result.core.name", default: "" },
  account_created: {
    path: "core.user_results.result.core.created_at",
    default: "",
  },
  followers: {
    path: "core.user_results.result.legacy.followers_count",
    default: "",
  },
  total_posts: {
    path: "core.user_results.result.legacy.statuses_count",
    default: "",
  },
  text: { path: "legacy.full_text", default: "" },
  replying_to: { path: "legacy.in_reply_to_screen_name", default: false },
  isQuote: { path: "legacy.is_quote_status", default: false },
  retweeted: { path: "legacy.retweeted", default: false },
  links: { path: "legacy.entities.urls", default: "" },
  mentions: { path: "legacy.entities.user_mentions", default: "" },
  hashtags: { path: "legacy.entities.hashtags", default: "" },
  date: { path: "legacy.created_at", default: "" },
  likes: { path: "legacy.favorite_count", default: 0 },
  quotes: { path: "legacy.quote_count", default: 0 },
  retweets: { path: "legacy.retweet_count", default: 0 },
  replies: { path: "legacy.reply_count", default: 0 },
  views: { path: "views.count", default: 0 },
};

const getTweetsFromDB = async () => {
  const jp = require("jsonpath");
  const dbTweetsRaw = await db.tweets.toArray();
  const dbTweetsResults = dbTweetsRaw.map((rawTweet) => ({
    collID: rawTweet.collectionID,
    res: jp.query(rawTweet, "$..tweet_results")[0],
  }));
  const reformatedTweets = dbTweetsResults.map((tweet) => {
    let tweetInfo =
      tweet.res.result.tweet || tweet.res.result || tweet.res.tweet;
    let reformatedTweet = {};
    let _ = require("lodash");
    reformatedTweet.collectionID = tweet.collID;
    Object.keys(TWEET_PROPERTY_PATHS).forEach(
      (k) =>
        (reformatedTweet[k] = _.get(
          tweetInfo,
          TWEET_PROPERTY_PATHS[k].path,
          TWEET_PROPERTY_PATHS[k].default,
        )),
    );

    reformatedTweet.views = parseInt(reformatedTweet.views);

    reformatedTweet.mentions.length >= 1
      ? (reformatedTweet.mentions = reformatedTweet.mentions
          .flat(1)
          .map((obj) => (obj.screen_name ? obj.screen_name : ""))
          .filter((obj) => obj.length > 1))
      : {};

    reformatedTweet.hashtags.length >= 1
      ? (reformatedTweet.hashtags = reformatedTweet.hashtags
          .flat(1)
          .map((obj) => (obj.text ? obj.text : ""))
          .filter((obj) => obj.length > 1))
      : {};

    reformatedTweet.links.length >= 1
      ? (reformatedTweet.links = reformatedTweet.links
          .flat(1)
          .map((obj) => (obj.expanded_url ? obj.expanded_url : ""))
          .filter((obj) => obj.length > 1))
      : {};
    (reformatedTweet.imageLink =
      jp.query(
        tweet,
        "$.result.legacy.extended_entities..media_url_https",
      )[0] || "None"),
      (reformatedTweet.video =
        jp
          .query(
            tweet,
            "$.result.legacy.extended_entities..video_info.variants",
          )[0]
          ?.filter((x) => (x.content_type = "video/mp4"))[0].url || "None");
    reformatedTweet.tweetLink =
      "https://x.com/" +
      reformatedTweet.username +
      "/status/" +
      reformatedTweet.id;
    return reformatedTweet;
  });
  return reformatedTweets;
};

export const TIKTOK_PROPERTY_PATHS = {
  username: {
    path: "author.uniqueId",
    default: "",
  },
  date: {
    path: "createTime",
    default: "",
  },
  hashtags: {
    path: "textExtra",
    default: "",
  },
  soundID: {
    path: "music.id",
    default: "",
  },
  soundAuthor: {
    path: "music.authorName",
    default: "",
  },
  soundTitle: {
    path: "music.title",
    default: "",
  },
  likes: {
    path: "stats.diggCount",
    default: 0,
  },
  replies: {
    path: "stats.commentCount",
    default: 0,
  },
  views: {
    path: "stats.playCount",
    default: 0,
  },
  shares: {
    path: "stats.shareCount",
    default: 0,
  },
  reposts: {
    path: "statsV2.repostCount",
    default: 0,
  },
  text: {
    path: "desc",
    default: "",
  },
  isAd: {
    path: "isAd",
    default: false,
  },
};

const getTikToksFromDB = async () => {
  const rawTiktoks = await db.tiktoks.toArray();
  const reformatedTiktoks = rawTiktoks.map((rawTiktok) => {
    let _ = require("lodash");
    let reformatedTiktok = {};
    reformatedTiktok.id = rawTiktok.id;
    reformatedTiktok.collectionID = rawTiktok.collectionID;
    Object.keys(TIKTOK_PROPERTY_PATHS).forEach(
      (k) =>
        (reformatedTiktok[k] = _.get(
          rawTiktok.tiktok,
          TIKTOK_PROPERTY_PATHS[k].path,
          TIKTOK_PROPERTY_PATHS[k].default,
        )),
    );
    reformatedTiktok.date = dayjs
      .unix(reformatedTiktok.date)
      .format("YYYY-MM-DDTHH:mm:ss");
    reformatedTiktok.hashtags.length >= 1
      ? (reformatedTiktok.hashtags = reformatedTiktok.hashtags
          .map((v) => "#" + v.hashtagName)
          .filter((v) => v.length > 2))
      : {};
    reformatedTiktok.reposts = parseInt(reformatedTiktok.reposts);
    return reformatedTiktok;
  });
  return reformatedTiktoks;
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  (async (request) => {
    if (request.prompt === "getTweets") {
      const tweetResponse = await getTweetsFromDB();
      sendResponse(tweetResponse);
    } else if (request.prompt === "getTiktoks") {
      const tiktokResp = await getTikToksFromDB();
      sendResponse(tiktokResp);
    } else if (request.prompt === "deleteAll") {
      db.delete().then(() => db.open());
    } else if (request.prompt === "deleteCollection") {
      if (request.source === "twitter") {
        await db.tweets
          .where("[collectionID+id]")
          .between(
            [request.collectionId, Dexie.minKey],
            [request.collectionId, Dexie.maxKey],
            true,
            true,
          )
          .delete();
      } else if (request.source === "tiktok") {
        await db.tiktoks
          .where("[collectionID+id]")
          .between(
            [request.collectionId, Dexie.minKey],
            [request.collectionId, Dexie.maxKey],
            true,
            true,
          )
          .delete();
      }
    } else if (request.prompt === "getRecordingInfo") {
      const currentCollections = await db.collections.toArray();
      if (!currentCollections.includes("Default Collection")) {
        await db.collections.put({ id: "Default Collection" });
      }
      const updatedCollections = await db.collections.toArray();

      const currentStatus = await db.recording.toArray();

      if (currentStatus.length === 0) {
        await db.recording.put({ id: "main", state: false });
      }

      const updatedStatus = await db.recording.toArray();

      sendResponse({
        recording: updatedStatus,
        collections: updatedCollections,
      });
    } else if (request.prompt === "addCollection") {
      await db.collections.put({ id: request.newCollectionName });
    } else if (request.prompt === "stopRecording") {
      await db.recording.put({ id: "main", state: false, platforms: "" });
    } else if (request.prompt === "startRecording") {
      await db.recording.put({
        id: "main",
        state: request.currentCollectionName,
        platforms: request.platforms.join(","),
      });
    } else if (request.prompt === "getRawCollection") {
      if (request.platform === "twitter") {
        const x = await db.tweets
          .where("[collectionID+id]")
          .between(
            [request.collectionId, Dexie.minKey],
            [request.collectionId, Dexie.maxKey],
            true,
            true,
          )
          .toArray();
        sendResponse({ data: x });
      } else if (request.platform === "tiktok") {
        const x = await db.tiktoks
          .where("[collectionID+id]")
          .between(
            [request.collectionId, Dexie.minKey],
            [request.collectionId, Dexie.maxKey],
            true,
            true,
          )
          .toArray();
        sendResponse({ data: x });
      }
    } else if (request.prompt === "addToCollection") {
      const data = request.data;
      if (request.platform === "twitter") {
        data.forEach(
          async (t) =>
            await db.tweets.add({
              id: t.id,
              collectionID: request.collectionId,
              tweet: t.tweet,
            }),
        );
      } else if (request.platform === "tiktok") {
        data.forEach(
          async (t) =>
            await db.tiktoks.add({
              id: t.id,
              collectionID: request.collectionId,
              tiktok: t.tiktok,
            }),
        );
      }
      sendResponse({ done: "ok" });
    }
  })(request);
  return true;
});

chrome.runtime.onMessageExternal.addListener(async function (request) {
  const jp = require("jsonpath");
  const entryIds = jp.query(request, "$..entryId");
  const session = await db.recording.toArray();

  const currentSession = session[0].state;
  if (currentSession === false) {
    return;
  }
  if (request.prompt === "tiktokCapture") {
    request.content.itemList?.forEach(async (item) => {
      await db.tiktoks.put({
        id: item.id,
        collectionID: currentSession,
        tiktok: item,
      });
    });
    //Tiktok responses can have item details in either data or itemList field
    request.content.data
      ?.map((x) => x.item)
      .forEach(async (item) => {
        await db.tiktoks.put({
          id: item.id,
          collectionID: currentSession,
          tiktok: item,
        });
      });
    return;
  }

  if (jp.query(request, "$..entryId").length > 0) {
    for (let entryId of entryIds) {
      let current = jp.query(request, `$..entries[?(@.entryId=="${entryId}")]`);
      jp.query(request, `$..entries[?(@.entryId=="${entryId}")]..tweet_results`)
        .length > 0
        ? await db.tweets.put({
            id: entryId,
            collectionID: currentSession,
            tweet: current[0],
          })
        : {};
    }
  }
});

chrome.runtime.onStartup.addListener();
