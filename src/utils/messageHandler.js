import dayjs from "dayjs";
import Dexie from "dexie";
import { JSONPath as jp } from "jsonpath-plus";
import _ from "lodash";

import DBStorage from "./dbstorage";

// Initialize the databases (moved from background script)
/*const db = new Dexie("tweetTest");
db.version(2).stores({
  tweets: "[id+collectionID], [collectionID+id], tweet",
  tiktoks: "[id+collectionID],[collectionID+id], tiktok",
  collections: "id",
  recording: "id,state",
});*/

const snaDB = new DBStorage("snaData", 1, {
  collections: {
    keyPath: "id",
  },
  recording: {
    keyPath: "id",
    indexes: {
      "by-state": { keyPath: "state" },
    },
  },
  tweets: {
    keyPath: "id",
    indexes: {
      "by-collectionID": { keyPath: ["collectionID", "id"] },
    },
  },
  tiktoks: {
    keyPath: "id",
    indexes: {
      "by-collectionID": { keyPath: ["collectionID", "id"] },
    },
  },
});

// Property path configurations (moved from background script)
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

// Helper functions (moved from background script)
const getTweetsFromDB = async () => {
  const dbTweetsRaw = await snaDB.getAll("tweets");
  const dbTweetsResults = dbTweetsRaw.map((rawTweet) => ({
    collID: rawTweet.collectionID,
    res: jp({ json: rawTweet, path: "$..tweet_results" })[0],
  }));
  const reformatedTweets = dbTweetsResults.map((tweet) => {
    if (!tweet.res || _.isEmpty(tweet.res)) return;
    let tweetInfo =
      tweet.res.result.tweet || tweet.res.result || tweet.res.tweet;
    let reformatedTweet = {};
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
    reformatedTweet.imageLink =
      jp({
        json: tweetInfo,
        path: "$.legacy.extended_entities..media_url_https",
      })[0] || "None";

    reformatedTweet.video =
      jp({
        json: tweetInfo,
        path: "$.legacy.extended_entities..video_info.variants",
      })[0]?.filter((x) => x.url.includes(".mp4"))[0].url || "None";
    reformatedTweet.tweetLink =
      "https://x.com/" +
      reformatedTweet.username +
      "/status/" +
      reformatedTweet.id;
    return reformatedTweet;
  });
  return reformatedTweets;
};

const getTikToksFromDB = async () => {
  //const rawTiktoks = await db.tiktoks.toArray();
  const rawTiktoks = await snaDB.getAll("tiktoks");
  const reformatedTiktoks = rawTiktoks.map((rawTiktok) => {
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

// Main message handler function
export const handleChromeMessage = async (request, sender, sendResponse) => {
  try {
    if (request.prompt === "getTweets") {
      const tweetResponse = await getTweetsFromDB();
      sendResponse(tweetResponse);
    } else if (request.prompt === "getTiktoks") {
      const tiktokResp = await getTikToksFromDB();
      sendResponse(tiktokResp);
    } else if (request.prompt === "deleteAll") {
      //await db.delete().then(() => db.open());
      await snaDB.deleteDB().then(() => snaDB.init());
      sendResponse({ success: true });
    } else if (request.prompt === "deleteCollection") {
      if (request.source === "twitter") {
        /*await db.tweets
          .where("[collectionID+id]")
          .between(
            [request.collectionId, Dexie.minKey],
            [request.collectionId, Dexie.maxKey],
            true,
            true,
          )
          .delete();*/
        await snaDB.deleteByIndex(
          "tweets",
          "by-collectionID",
          request.collectionId,
        );
      } else if (request.source === "tiktok") {
        /*await db.tiktoks
          .where("[collectionID+id]")
          .between(
            [request.collectionId, Dexie.minKey],
            [request.collectionId, Dexie.maxKey],
            true,
            true,
          )
          .delete();*/
        await snaDB.deleteByIndex(
          "tiktoks",
          "by-collectionID",
          request.collectionId,
        );
      }
      sendResponse({ success: true });
    } else if (request.prompt === "getRecordingInfo") {
      //const currentCollections = await db.collections.toArray();
      const currentCollections = await snaDB.getAll("collections");
      if (!currentCollections.includes("Default Collection")) {
        //await db.collections.put({ id: "Default Collection" });
        await snaDB.put("collections", { id: "Default Collection" });
      }
      //const updatedCollections = await db.collections.toArray();
      const updatedCollections = await snaDB.getAll("collections");

      //const currentStatus = await db.recording.toArray();
      const currentStatus = await snaDB.getAll("recording");

      if (currentStatus.length === 0) {
        //await db.recording.put({ id: "main", state: false });
        await snaDB.put("recording", { id: "main", state: false });
      }

      //const updatedStatus = await db.recording.toArray();
      const updatedStatus = await snaDB.getAll("recording");

      sendResponse({
        recording: updatedStatus,
        collections: updatedCollections,
      });
    } else if (request.prompt === "addCollection") {
      //await db.collections.put({ id: request.newCollectionName });
      await snaDB.put("collections", { id: request.newCollectionName });
      sendResponse({ success: true });
    } else if (request.prompt === "stopRecording") {
      //await db.recording.put({ id: "main", state: false, platforms: "" });
      await snaDB.put("recording", { id: "main", state: false, platforms: "" });
      sendResponse({ success: true });
    } else if (request.prompt === "startRecording") {
      await snaDB.put("recording", {
        id: "main",
        state: request.currentCollectionName,
        platforms: request.platforms.join(","),
      });
      /*await db.recording.put({
        id: "main",
        state: request.currentCollectionName,
        platforms: request.platforms.join(","),
      });*/
      sendResponse({ success: true });
    } else if (request.prompt === "getRawCollection") {
      if (request.platform === "twitter") {
        /*const x = await db.tweets
          .where("[collectionID+id]")
          .between(
            [request.collectionId, Dexie.minKey],
            [request.collectionId, Dexie.maxKey],
            true,
            true,
          )
          .toArray();*/
        const x = await snaDB.getAllFromIndex("tweets", "by-collectionID");
        sendResponse({ data: x });
      } else if (request.platform === "tiktok") {
        /*const x = await db.tiktoks
          .where("[collectionID+id]")
          .between(
            [request.collectionId, Dexie.minKey],
            [request.collectionId, Dexie.maxKey],
            true,
            true,
          )
          .toArray();*/
        const x = await snaDB.getAllFromIndex("tiktoks", "by-collectionID");
        sendResponse({ data: x });
      }
    } else if (request.prompt === "addToCollection") {
      const data = request.data;
      if (request.platform === "twitter") {
        await Promise.all(
          data.map(
            async (t) =>
              snaDB.add("tweets", {
                id: t.id,
                collectionID: request.collectionId,
                tweet: t.tweet,
              }),
            /*db.tweets.add({
              id: t.id,
              collectionID: request.collectionId,
              tweet: t.tweet,
            })*/
          ),
        );
      } else if (request.platform === "tiktok") {
        await Promise.all(
          data.map(
            async (t) =>
              snaDB.add("tiktoks", {
                id: t.id,
                collectionID: request.collectionId,
                tiktok: t.tiktok,
              }),
            /*db.tiktoks.add({
              id: t.id,
              collectionID: request.collectionId,
              tiktok: t.tiktok,
            })*/
          ),
        );
      }
      sendResponse({ done: "ok" });
    } else {
      // Handle unknown prompts
      sendResponse({ error: "Unknown prompt" });
    }
  } catch (error) {
    console.error("Error in message listener:", error);
    sendResponse({ error: error.message });
  }
};

export const handleRecordedMessage = async (request) => {
  const entryIds = jp({ json: request, path: "$..entryId" });
  //const session = await db.recording.toArray();
  const session = await snaDB.getAll("recording");

  const currentSession = session[0].state;
  if (currentSession === false) {
    return;
  }
  if (request.prompt === "tiktokCapture") {
    request.content.itemList?.forEach(async (item) => {
      /*await db.tiktoks.put({
        id: item.id,
        collectionID: currentSession,
        tiktok: item,
      });*/
      await snaDB.put("tiktoks", {
        id: item.id,
        collectionID: currentSession,
        tiktok: item,
      });
    });
    //Tiktok responses can have item details in either data or itemList field
    request.content.data
      ?.map((x) => x.item)
      .forEach(async (item) => {
        /*await db.tiktoks.put({
          id: item.id,
          collectionID: currentSession,
          tiktok: item,
        });*/
        await snaDB.put("tiktoks", {
          id: item.id,
          collectionID: currentSession,
          tiktok: item,
        });
      });
    return;
  }

  if (jp({ json: request, path: "$..entryId" }).length > 0) {
    for (let entryId of entryIds) {
      let current = jp({
        json: request,
        path: `$..entries[?(@.entryId=="${entryId}")]`,
      });
      jp({
        json: request,
        path: `$..entries[?(@.entryId=="${entryId}")]..tweet_results`,
      }).length > 0
        ? await snaDB.put("tweets", {
            id: entryId,
            collectionID: currentSession,
            tweet: current[0],
          })
        : /*await db.tweets.put({
            id: entryId,
            collectionID: currentSession,
            tweet: current[0],
          })*/
          {};
    }
  }
};

const PLATFORM_URLS = {
  Tiktok: [".tiktok.com", "/tiktok.com"],
  Twitter: [".x.com", "/x.com"],
};
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export const handleRecorderOnCommit = async (details) => {
  if (details.frameId !== 0) return; //Skip subframes

  //const recordingState = await db.recording.get("main");
  const recordingState = await snaDB.get("recording", "main");

  if (!recordingState) {
    return;
  }

  let recordingSession = recordingState.state;
  let currentTab = await getCurrentTab();
  if (recordingSession === false) {
    return;
  }
  let platforms = recordingState.platforms.split(",");
  let url_test = [];
  platforms.forEach((platform) => url_test.push(PLATFORM_URLS[platform]));
  if (
    currentTab.url &&
    !url_test.flat().some((url) => currentTab.url.includes(url))
  ) {
    return;
  }
  try {
    await chrome.scripting.executeScript({
      target: { tabId: currentTab.id, allFrames: true },
      function: () => {
        let pluginId = chrome.runtime.id;
        let s = document.createElement("script");
        s.dataset.params = pluginId;
        s.src = chrome.runtime.getURL("inject.js");
        (document.head || document.documentElement).appendChild(s);
      },
    });
  } catch (e) {
    throw Error(e);
  }
};
// Initialize the snaDB
export const initializeMessageHandler = async () => {
  await snaDB.init();
  console.log("Message handler initialized with snaDB:", snaDB);
};

// Export the databases for use in other modules if needed
export { snaDB };
