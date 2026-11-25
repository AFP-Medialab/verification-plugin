import {
  transformCommunityNote,
  transformTiktok,
  transformTweet,
} from "@/components/NavItems/tools/SNA/utils/snaDataTransformers";
import DBStorage from "@/utils/dbstorage";
import { JSONPath as jp } from "jsonpath-plus";

// Initialize the databases (moved from background script)
/*const db = new Dexie("tweetTest");
db.version(2).stores({
  tweets: "[id+collectionID], [collectionID+id], tweet",
  tiktoks: "[id+collectionID],[collectionID+id], tiktok",
  collections: "id",
  recording: "id,state",
});*/

const TIKTOKCOLLECTION = "tiktoks";
const TWITTERCOLLECTION = "tweets";
const FBCOLLECTION = "fb";
const COMMUNITYNOTESCOLLECTION = "communityNotes";

const snaDB = new DBStorage("snaData", 2, {
  collections: {
    keyPath: "id",
  },
  communityNotes: {
    keyPath: ["collectionID", "id"],
    indexes: {
      "by-collectionID": { keyPath: ["collectionID", "id"] },
    },
  },
  recording: {
    keyPath: "id",
    indexes: {
      "by-state": { keyPath: "state" },
    },
  },
  tweets: {
    keyPath: ["collectionID", "id"],
    indexes: {
      "by-collectionID": { keyPath: ["collectionID", "id"] },
    },
  },
  tiktoks: {
    keyPath: ["collectionID", "id"],
    indexes: {
      "by-collectionID": { keyPath: ["collectionID", "id"] },
    },
  },
  fb: {
    keyPath: ["collectionID", "id"],
    indexes: {
      "by-collectionID": { keyPath: ["collectionID", "id"] },
    },
  },
  custom: {
    keyPath: ["collectionID", "id"],
    indexes: {
      "by-collectionID": { keyPath: ["collectionID", "id"] },
    },
  },
});

// Helper functions (moved from background script)
/**
 *
 * @param {*} collectionName
 * @param {*} format
 * @returns
 */
const getItemsFromDB = async (collectionName, format) => {
  const raws = await snaDB.getAll(collectionName);
  const reformatData = raws.map((rawData) => {
    return format(rawData);
  });
  return reformatData;
};
const tweetFormat = (rawData) => {
  let tweet = rawData.tweet;
  return tweet;
};
const tiktokFormat = (rawData) => {
  return transformTiktok(rawData.tiktok, rawData.id, rawData.collectionID);
};
const postFormat = (rawData) => {
  let post = rawData.post;
  return post;
};
const communityNoteFormat = (rawData) => {
  // collectionID is stored on the record, not in the note: the UI groups entries by it
  return { ...rawData.note, collectionID: rawData.collectionID };
};

/**
 * Get the table name for a given platform
 * @param {string} platform - Platform name (twitter/tiktok/communityNotes)
 * @returns {string} Table name
 */
const getTableForPlatform = (platform) => {
  switch (platform) {
    case "twitter":
    case "zeeschuimerTwitter":
      return TWITTERCOLLECTION;
    case "tiktok":
    case "zeeschuimerTiktok":
      return TIKTOKCOLLECTION;
    case "crowdTangleFb":
      return "fb";
    case "fb":
      return "fb";
    case "communityNotes":
      return COMMUNITYNOTESCOLLECTION;
    default:
      return "custom";
  }
};

/**
 * Get the data key for a given platform
 * @param {string} platform - Platform name (twitter/tiktok/communityNotes)
 * @returns {string} Data key name
 */
const getDataKeyForPlatform = (platform) => {
  switch (platform) {
    case "twitter":
    case "zeeschuimerTwitter":
      return "tweet";
    case "tiktok":
    case "zeeschuimerTiktok":
      return "tiktok";
    case "crowdTangleFb":
      return "post";
    case "communityNotes":
      return "note";
    default:
      return "post";
  }
};

/**
 * Delete collection by platform
 * @param {string} platform - Platform name (twitter/tiktok)
 * @param {string} collectionId - Collection ID to delete
 */
const deleteCollectionByPlatform = async (platform, collectionId) => {
  const table = getTableForPlatform(platform);
  await snaDB.deleteByKeyPath(table, "collectionID", collectionId);
  if (table === TWITTERCOLLECTION) {
    await snaDB.deleteByKeyPath(
      COMMUNITYNOTESCOLLECTION,
      "collectionID",
      collectionId,
    );
  }
};

/**
 * Get raw collection data by platform
 * @param {string} platform - Platform name (twitter/tiktok)
 * @param {string} collectionId - Collection to export
 * @returns {Promise<Array>} Raw records of this collection only
 */
const getRawCollectionByPlatform = async (platform, collectionId) => {
  const table = getTableForPlatform(platform);
  const inCollection = (record) => record.collectionID === collectionId;

  const records = (
    await snaDB.getAllFromIndex(table, "by-collectionID")
  ).filter(inCollection);
  if (table !== TWITTERCOLLECTION) return records;

  // Community Notes belong to the X collections: records are { id, collectionID, note }
  const notes = (
    await snaDB.getAllFromIndex(COMMUNITYNOTESCOLLECTION, "by-collectionID")
  ).filter(inCollection);
  return [...records, ...notes];
};

/**
 * Add data to collection by platform
 * @param {string} platform - Platform name (twitter/tiktok)
 * @param {Array} data - Data array to add
 * @param {string} collectionId - Collection ID
 */
const addToCollectionByPlatform = async (platform, data, collectionId) => {
  //TEST if collection exists. If not add it in database
  let collections = await snaDB.get("collections", collectionId);
  if (!collections) collections = await snaDB.put("collections", collectionId);
  //const collections = await snaDB.put("collections", collectionId)
  const table = getTableForPlatform(platform);
  const dataKey = getDataKeyForPlatform(platform);

  // Chunk size for batch operations - optimal balance between performance and memory
  const CHUNK_SIZE = 1000;
  let totalProcessed = 0;

  try {
    // Process data in chunks for better performance with large datasets
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.slice(i, i + CHUNK_SIZE);

      // Use 'put' instead of 'add' to allow updates and avoid duplicate key errors
      const operations = chunk.map((item) => ({
        type: "put",
        storeName: table,
        value: {
          id: item.id,
          collectionID: collectionId,
          [dataKey]: item,
        },
      }));

      await snaDB.batch(operations, "readwrite");
      totalProcessed += chunk.length;

      // Log progress for large datasets
      /* if (data.length > CHUNK_SIZE) {
        console.log(
          `Processed ${totalProcessed}/${data.length} items for ${platform}`,
        );
      }*/
    }

    /*console.log(
      `Successfully added ${data.length} items to ${table} collection ${collectionId}`,
    );*/
  } catch (error) {
    console.error(
      `Failed to add items to ${table} (processed ${totalProcessed}/${data.length}):`,
      error,
    );
    throw error;
  }
};

// Main message handler function
export const handleSNARecorderChromeMessage = async (
  request,
  sender,
  sendResponse,
) => {
  try {
    if (request.prompt === "getTweets") {
      const tweetResponse = await getItemsFromDB(
        TWITTERCOLLECTION,
        tweetFormat,
      );
      sendResponse(tweetResponse);
    } else if (request.prompt === "getTiktoks") {
      const tiktokResp = await getItemsFromDB(TIKTOKCOLLECTION, tiktokFormat);
      sendResponse(tiktokResp);
    } else if (request.prompt === "getFBPosts") {
      const fbPostResp = await getItemsFromDB(FBCOLLECTION, postFormat);
      sendResponse(fbPostResp);
    } else if (request.prompt === "getCommunityNotes") {
      const communityNotesResp = await getItemsFromDB(
        COMMUNITYNOTESCOLLECTION,
        communityNoteFormat,
      );
      sendResponse(communityNotesResp);
    } else if (request.prompt === "deleteAll") {
      //await db.delete().then(() => db.open());
      await snaDB.deleteDatabase().then(() => snaDB.init());
      sendResponse({ success: true });
    } else if (request.prompt === "deleteCollection") {
      await deleteCollectionByPlatform(request.source, request.collectionId);
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
      const data = await getRawCollectionByPlatform(
        request.platform,
        request.collectionId,
      );
      sendResponse({ data });
    } else if (request.prompt === "addToCollection") {
      await addToCollectionByPlatform(
        request.platform,
        request.data,
        request.collectionId,
      );
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

/**
 * Store tiktok item to database
 * @param {Object} item - Tiktok item
 * @param {string} collectionID - Collection ID
 */
const storeTiktokItem = async (item, collectionID) => {
  await snaDB.put(TIKTOKCOLLECTION, {
    id: item.id,
    collectionID,
    tiktok: item,
  });
};

/**
 * Collect every Community Note object of a response, whatever its position
 * (misleading_birdwatch_notes.notes[*], birdwatch_note_by_rest_id, listings...).
 * A note is recognised by its rest_id and data_v1 properties.
 * @param {*} node - Parsed JSON node
 * @param {Array} found - Accumulator
 * @returns {Array} Raw notes
 */
const findNotes = (node, found = []) => {
  if (Array.isArray(node)) {
    node.forEach((child) => findNotes(child, found));
  } else if (node && typeof node === "object") {
    if (node.data_v1 && node.rest_id) {
      found.push(node);
    } else {
      Object.values(node).forEach((child) => findNotes(child, found));
    }
  }
  return found;
};

/**
 * Store the Community Notes of a response. Notes are kept in their own store,
 * in the same collection as the tweets and linked to them by tweetId.
 * A note seen again is overwritten, so its rating_status stays up to date.
 */
const storeCommunityNotes = async (request, collectionID) => {
  for (const rawNote of findNotes(request.data)) {
    try {
      const note = transformCommunityNote(rawNote);
      await snaDB.put(COMMUNITYNOTESCOLLECTION, {
        id: note.id,
        collectionID,
        note,
      });
    } catch (error) {
      console.error("[SNA Recorder] Error processing community note:", error);
    }
  }
};

/**
 * Tweet object of a tweet_results.result, or null when there is nothing to record
 * (tombstone, unavailable or truncated tweet).
 */
const getTweetContent = (result) => {
  const tweet = result?.tweet ?? result; // TweetWithVisibilityResults wraps the tweet
  return tweet?.rest_id && tweet.legacy && tweet.core ? tweet : null;
};

const tweetPutOperation = (tweetContent, entryId, collectionID) => ({
  type: "put",
  storeName: TWITTERCOLLECTION,
  value: {
    id: entryId,
    collectionID,
    tweet: transformTweet(tweetContent, collectionID, entryId),
  },
});

/**
 * Write the tweets in one transaction. One tweet that cannot be transformed
 * is logged and skipped, it never prevents the others from being recorded.
 * @param {Array<{entryId: string, result: Object}>} candidates
 */
const storeTweets = async (candidates, collectionID) => {
  const operations = [];
  for (const { entryId, result } of candidates) {
    try {
      const tweetContent = getTweetContent(result);
      if (tweetContent) {
        operations.push(tweetPutOperation(tweetContent, entryId, collectionID));
      }
    } catch (error) {
      console.error(`[SNA Recorder] Error processing ${entryId}:`, error);
    }
  }
  if (operations.length > 0) {
    await snaDB.batch(operations, "readwrite");
  }
};

/**
 * Timeline items holding a tweet, whatever the feed (home, search, profile, list,
 * bookmarks, tweet page...) and the instruction that carries them:
 * entries[*], entry (pinned/replaced), moduleItems[*] and the items of a module.
 * Ads (promoted tweets) are left out.
 */
const findTimelineTweets = (node, found = []) => {
  if (Array.isArray(node)) {
    node.forEach((child) => findTimelineTweets(child, found));
  } else if (node && typeof node === "object") {
    const itemContent = node.content?.itemContent ?? node.item?.itemContent;
    if (typeof node.entryId === "string" && itemContent?.tweet_results) {
      const isAd =
        node.entryId.startsWith("promoted-tweet-") ||
        itemContent.promotedMetadata;
      if (!isAd) {
        found.push({
          entryId: node.entryId,
          result: itemContent.tweet_results.result,
        });
      }
    } else {
      Object.values(node).forEach((child) => findTimelineTweets(child, found));
    }
  }
  return found;
};

/**
 * Store the tweets of Community Notes listing pages (tweets_results arrays).
 * Same key as the timeline entries ("tweet-<rest_id>") to avoid duplicates.
 */
const storeListingTweets = async (request, collectionID) => {
  const tweetsResultsArrays = jp({
    json: request,
    path: "$..tweets_results",
  });

  const candidates = tweetsResultsArrays
    .filter(Array.isArray)
    .flat()
    .map((item) => ({
      entryId: `tweet-${item?.result?.rest_id}`,
      result: item?.result,
    }));
  await storeTweets(candidates, collectionID);
};

/**
 * Store the tweet of a single-tweet response (tweetResult / tweet_result_by_rest_id).
 */
const storeSingleTweetResult = async (request, collectionID) => {
  const result =
    request.data?.tweetResult?.result ??
    request.data?.tweet_result_by_rest_id?.result;
  const tweetContent = getTweetContent(result);
  if (!tweetContent) return;

  await storeTweets(
    [{ entryId: `tweet-${tweetContent.rest_id}`, result: tweetContent }],
    collectionID,
  );
};

export const handleRecordedMessage = async (request) => {
  const session = await snaDB.getAll("recording");

  const currentSession = session[0]?.state;
  if (!currentSession) {
    return;
  }

  if (request.prompt === "tiktokCapture") {
    // Tiktok responses can have item details in either itemList or data field
    const itemsFromList = request.content.itemList || [];
    const itemsFromData = request.content.data?.map((x) => x.item) || [];
    const allItems = [...itemsFromList, ...itemsFromData].filter(
      (item) => item != null && item.id != null,
    );

    await Promise.all(
      allItems.map((item) => storeTiktokItem(item, currentSession)),
    );
    return;
  }

  switch (request._snaRecorderType) {
    // Community Notes responses: notes (BirdwatchFetchNotes, single note, listings)
    // and the tweets of listing pages
    case "communityNote":
      await storeCommunityNotes(request, currentSession);
      await storeListingTweets(request, currentSession);
      break;
    // Single tweet response (TweetResultByRestId)
    case "singleTweet":
      await storeSingleTweetResult(request, currentSession);
      break;
    // Any feed made of timeline instructions
    case "timeline":
      await storeTweets(findTimelineTweets(request.data), currentSession);
      break;
  }
};

const PLATFORM_URLS = {
  Tiktok: [".tiktok.com", "/tiktok.com"],
  X: [".x.com", "/x.com"],
};
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await browser.tabs.query(queryOptions);
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

  // Add safety check for currentTab
  if (!currentTab) {
    console.warn("[SNA Recorder] Could not get current tab");
    return;
  }

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
    const scriptUrl = browser.runtime.getURL("content-scripts/inject.js");

    // Step 1: Inject the content script bridge (runs in content script context)
    await browser.scripting.executeScript({
      target: { tabId: currentTab.id, allFrames: false },
      files: ["content-scripts/sna-bridge.js"],
    });

    // Step 2: Inject the page context script (runs in page context)
    // The page script communicates with the bridge via window.postMessage
    await browser.scripting.executeScript({
      target: { tabId: currentTab.id, allFrames: true },
      func: (url) => {
        let s = document.createElement("script");
        s.src = url;
        (document.head || document.documentElement).appendChild(s);
      },
      args: [scriptUrl],
    });
  } catch (e) {
    console.error("SNA Recorder: Error injecting scripts:", e);
    throw Error(e);
  }
};
// Initialize the snaDB
export const initializeMessageHandler = async () => {
  await snaDB.init();
  //console.log("Message handler initialized with snaDB:", snaDB);
};

// Export the databases for use in other modules if needed
export { snaDB };
