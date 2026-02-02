import {
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

/**
 * Get the table name for a given platform
 * @param {string} platform - Platform name (twitter/tiktok)
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
    default:
      return "custom";
  }
};

/**
 * Get the data key for a given platform
 * @param {string} platform - Platform name (twitter/tiktok)
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
};

/**
 * Get raw collection data by platform
 * @param {string} platform - Platform name (twitter/tiktok)
 * @returns {Promise<Array>} Raw collection data
 */
const getRawCollectionByPlatform = async (platform) => {
  const table = getTableForPlatform(platform);
  return await snaDB.getAllFromIndex(table, "by-collectionID");
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

    console.log(
      `Successfully added ${data.length} items to ${table} collection ${collectionId}`,
    );
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
      const data = await getRawCollectionByPlatform(request.platform);
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

export const handleRecordedMessage = async (request) => {
  const entryIds = jp({ json: request, path: "$..entryId" });
  const session = await snaDB.getAll("recording");

  const currentSession = session[0].state;
  if (currentSession === false) {
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

  // Twitter capture
  if (jp({ json: request, path: "$..entryId" }).length > 0) {
    for (let entryId of entryIds) {
      let tweet_results = jp({
        json: request,
        path: `$..entries[?(@.entryId=="${entryId}")]..tweet_results`,
      });

      if (tweet_results.length > 0) {
        let content =
          tweet_results[0].result.tweet ||
          tweet_results[0].result ||
          tweet_results[0].tweet;

        let tweet = transformTweet(content, currentSession);
        await snaDB.put(TWITTERCOLLECTION, {
          id: entryId,
          collectionID: currentSession,
          tweet: tweet,
        });
      }
    }
  } else {
    // Try alternative patterns for Twitter data
    const timelineInstructions = jp({
      json: request,
      path: "$..timeline..instructions[*]..entries[*]",
    });

    if (timelineInstructions.length > 0) {
      for (let entry of timelineInstructions) {
        if (entry.entryId && entry.content) {
          const tweet_results = jp({
            json: entry,
            path: "$..tweet_results",
          });

          if (tweet_results.length > 0) {
            let content =
              tweet_results[0].result.tweet ||
              tweet_results[0].result ||
              tweet_results[0].tweet;

            let tweet = transformTweet(content, currentSession);
            await snaDB.put(TWITTERCOLLECTION, {
              id: entry.entryId,
              collectionID: currentSession,
              tweet: tweet,
            });
          }
        }
      }
    }
  }
};

const PLATFORM_URLS = {
  Tiktok: [".tiktok.com", "/tiktok.com"],
  Twitter: [".x.com", "/x.com"],
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
