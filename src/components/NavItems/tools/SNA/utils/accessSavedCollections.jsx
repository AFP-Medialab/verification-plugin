import { getAccountNameMap } from "../components/DataUpload/DataUploadFunctions";

/**
 * Clean Facebook data to ensure views and likes fields are properly formatted
 * @param {Array} entries - Facebook entries to clean
 * @returns {Array} Cleaned entries with views and likes as integers
 */
const cleanFacebookData = (entries) => {
  return entries.map((entry) => {
    const cleanedEntry = { ...entry };

    // Map "Total Views" to views if it exists
    if (entry["Total Views"] !== undefined) {
      cleanedEntry.views = parseInt(entry["Total Views"]) || 0;
    } else if (entry.views !== undefined) {
      cleanedEntry.views = parseInt(entry.views) || 0;
    } else {
      cleanedEntry.views = 0;
    }

    // Ensure likes is an integer (use lowercase 'likes' field)
    if (entry.likes !== undefined) {
      cleanedEntry.likes = parseInt(entry.likes) || 0;
    } else {
      cleanedEntry.likes = 0;
    }

    return cleanedEntry;
  });
};

/**
 * Helper function to safely parse numeric values, handling "missing" and other invalid values
 * @param {*} value - Value to parse
 * @returns {number} Parsed integer or 0
 */
const safeParseInt = (value) => {
  if (
    value === "missing" ||
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }
  const parsed = parseInt(value);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Clean TikTok data to ensure numeric fields are properly formatted
 * @param {Array} entries - TikTok entries to clean
 * @returns {Array} Cleaned entries with numeric fields as integers
 */
const cleanTiktokData = (entries) => {
  return entries.map((entry) => {
    return {
      ...entry,
      likes: safeParseInt(entry.likes),
      views: safeParseInt(entry.views),
      replies: safeParseInt(entry.replies),
      shares: safeParseInt(entry.shares),
      reposts: safeParseInt(entry.reposts),
    };
  });
};

const collectionAccessors = {
  twitter: {
    prompt: "getTweets",
    nameTag: "~X",
    idTag: "tweets~",
    sourceTag: "twitter",
  },
  tiktok: {
    prompt: "getTiktoks",
    nameTag: "~TIKTOK",
    idTag: "tiktoks~",
    sourceTag: "tiktok",
  },
  fb: {
    prompt: "getFBPosts",
    nameTag: "~FACEBOOK",
    idTag: "fb-post~",
    sourceTag: "fb",
  },
};

/**
 * @param {Array} collectionEntries - Tweets/posts of the collection
 * @param {number} notesCount - Community Notes of the collection: they only count as publications,
 * every other metric is computed on the tweets/posts
 */
export const getCollectionMetrics = (collectionEntries, notesCount = 0) => {
  let uniqueUsers = collectionEntries.map((e) => e.username).filter(onlyUnique);
  let totalLikes = collectionEntries
    .map((e) => safeParseInt(e.likes))
    .reduce((acc, curr) => acc + curr, 0);
  let totalViews = collectionEntries
    .map((e) => safeParseInt(e.views))
    .reduce((acc, curr) => acc + curr, 0);

  return [
    {
      label: "collection_nbOfPosts",
      value: collectionEntries.length + notesCount,
    },
    {
      label: "collection_uniqueUsers",
      value: uniqueUsers.length,
    },
    {
      label: "collection_totalLikes",
      value: totalLikes,
    },
    {
      label: "collection_totalViews",
      value: totalViews,
    },
  ];
};

export const isCommunityNote = (entry) => entry?.entryType === "communityNote";

const dedupeById = (entries) =>
  Array.from(
    new Map(
      entries.filter((entry) => entry.id.length > 0).map((e) => [e.id, e]),
    ).values(),
  );

/**
 * Union of the properties of all the rows (tweets and Community Notes do not share the same ones)
 */
const getContentHeaders = (content) => {
  const headers = new Set();
  content.forEach((row) => Object.keys(row).forEach((key) => headers.add(key)));
  return [...headers];
};

/**
 * Retrieve the saved entries of a source grouped by collection.
 * For twitter, the Community Notes are added to the collection they were recorded in
 * (a collection with only notes is kept).
 * The order of the collections defines the dataSource ids: every caller must use this function.
 */
const getEntriesByCollection = async (source) => {
  const allEntries = await browser.runtime.sendMessage({
    prompt: collectionAccessors[source].prompt,
  });
  const allNotes =
    source === "twitter"
      ? await browser.runtime.sendMessage({ prompt: "getCommunityNotes" })
      : [];

  const groupByCollection = (entries) =>
    Object.groupBy(
      entries.filter((x) => x != undefined),
      ({ collectionID }) => collectionID,
    );
  const entriesByCollection = groupByCollection(allEntries);
  const notesByCollection = groupByCollection(
    Array.isArray(allNotes) ? allNotes : [],
  );

  const collectionIDs = new Set([
    ...Object.keys(entriesByCollection),
    ...Object.keys(notesByCollection),
  ]);

  return [...collectionIDs].map((collectionID) => ({
    collectionID,
    entries: dedupeById(entriesByCollection[collectionID] ?? []),
    notes: dedupeById(notesByCollection[collectionID] ?? []),
  }));
};

/**
 * Sends message to background to retrieve all collections
 * and return their entries formatted as dataSources object.
 * Community Notes are part of the content and of the number of publications,
 * the other metrics only use the tweets/posts.
 * @param collectionSource {string} The saved collection type
 * @returns Object[] formatted as dataSource (cf. SNA.jsx)
 */
export const getSavedCollections = async (collectionSource) => {
  const collections = await getEntriesByCollection(collectionSource);

  return collections.map(({ collectionID, entries, notes }, idx) => {
    let cleanedEntries = entries;

    // Apply platform-specific cleaning
    if (collectionSource === "fb") {
      cleanedEntries = cleanFacebookData(entries);
    } else if (collectionSource === "tiktok") {
      cleanedEntries = cleanTiktokData(entries);
    }

    const content = [...cleanedEntries, ...notes];

    return {
      id: collectionAccessors[collectionSource].idTag + idx,
      name: collectionID + collectionAccessors[collectionSource].nameTag,
      length: content.length,
      metrics: getCollectionMetrics(cleanedEntries, notes.length),
      content,
      headers: getContentHeaders(content),
      analysisHeaders: getContentHeaders(cleanedEntries),
      accountNameMap: getAccountNameMap(cleanedEntries, collectionSource),
      source: collectionAccessors[collectionSource].sourceTag,
    };
  });
};

export const initializePage = async () => {
  let savedTweets = await getSavedCollections("twitter");
  let savedTiktoks = await getSavedCollections("tiktok");
  let savedFBs = await getSavedCollections("fb");

  return [...savedTweets, ...savedTiktoks, ...savedFBs];
};

/**
 * Get lightweight collection counts without loading full content
 * Much faster than getSavedCollections for metric updates
 */
const getCollectionCounts = async (source) => {
  const collections = await getEntriesByCollection(source);

  return collections.map(({ entries, notes }, idx) => ({
    id: collectionAccessors[source].idTag + idx,
    length: entries.length + notes.length,
    metrics: getCollectionMetrics(entries, notes.length),
  }));
};

/**
 * Lightweight update that refreshes collection metrics (counts) and adds new collections
 * without reloading the full content - used during active recording
 */
export const updateCollectionMetrics = async (dataSources, setDataSources) => {
  // Ensure dataSources is an array
  if (!Array.isArray(dataSources)) {
    console.warn(
      "updateCollectionMetrics: dataSources is not an array, skipping update",
    );
    return;
  }

  // Get current counts from IndexedDB (without full content)
  const twitterCounts = await getCollectionCounts("twitter");
  const tiktokCounts = await getCollectionCounts("tiktok");
  const fbCounts = await getCollectionCounts("fb");

  const allCounts = [...twitterCounts, ...tiktokCounts, ...fbCounts];

  // Find existing collection IDs in dataSources
  const existingIds = dataSources.map((ds) => ds.id);

  // Find new collections that don't exist in dataSources yet
  const newCollectionIds = allCounts
    .filter((count) => !existingIds.includes(count.id))
    .map((count) => count.id);

  let hasChanges = false;
  let newCollections = [];

  // If there are new collections, fetch their full data
  if (newCollectionIds.length > 0) {
    hasChanges = true;

    // Fetch full data for new collections only
    const newTwitter = (await getSavedCollections("twitter")).filter((col) =>
      newCollectionIds.includes(col.id),
    );
    const newTiktok = (await getSavedCollections("tiktok")).filter((col) =>
      newCollectionIds.includes(col.id),
    );
    const newFb = (await getSavedCollections("fb")).filter((col) =>
      newCollectionIds.includes(col.id),
    );

    newCollections = [...newTwitter, ...newTiktok, ...newFb];
  }

  // Update only the metrics for existing collections, keeping content intact
  const updated = dataSources.map((ds) => {
    // Skip file uploads
    if (ds.source === "fileUpload") return ds;

    // Find matching collection count
    const countInfo = allCounts.find((c) => c.id === ds.id);
    if (!countInfo) return ds;

    // Only update if count changed
    if (countInfo.length === ds.length) return ds;

    hasChanges = true;

    // Return new object with updated metrics but same content
    return {
      ...ds,
      length: countInfo.length,
      metrics: countInfo.metrics,
    };
  });

  // Only trigger update if something changed
  if (hasChanges) {
    // Add new collections at the beginning, before existing collections
    setDataSources([...newCollections, ...updated]);
  }
};

/**
 * Refresh only a specific collection by ID
 * Used when recording starts/stops to load complete content for recorded collection only
 */
export const refreshSpecificCollection = async (
  collectionId,
  platforms,
  dataSources,
  setDataSources,
) => {
  // Ensure dataSources is an array, if not do a full page initialization
  if (!Array.isArray(dataSources)) {
    const allCollections = await initializePage();
    setDataSources(allCollections);
    return;
  }

  // Map platform names to sources
  const platformMap = {
    X: "twitter",
    Tiktok: "tiktok",
    Facebook: "fb",
  };

  // Get fresh data only for recorded platforms
  const refreshPromises = platforms.map(async (platform) => {
    const source = platformMap[platform];
    if (!source) return null;
    const collections = await getSavedCollections(source);
    // Filter to only the specific collection ID
    return collections.filter((col) => col.name.includes(collectionId));
  });

  const freshCollections = (await Promise.all(refreshPromises))
    .filter((c) => c !== null)
    .flat();

  if (freshCollections.length === 0) {
    console.log(
      "No data found for collection - it may be newly created and empty",
    );
    // For new collections, we still want to trigger a re-render
    // to pick up the empty collection from a full refresh
    const allCollections = await initializePage();
    const matchingCollections = allCollections.filter((col) =>
      col.name.includes(collectionId),
    );

    if (matchingCollections.length > 0) {
      // Add new collections to dataSources
      const existingIds = dataSources.map((ds) => ds.id);
      const newCollections = matchingCollections.filter(
        (col) => !existingIds.includes(col.id),
      );

      if (newCollections.length > 0) {
        console.log(`Added ${newCollections.length} new collection(s)`);
        setDataSources([...newCollections, ...dataSources]);
        return;
      }
    }

    return;
  }

  // Check if these are new collections that don't exist in dataSources yet
  const existingIds = dataSources.map((ds) => ds.id);
  const newCollections = freshCollections.filter(
    (fc) => !existingIds.includes(fc.id),
  );
  const existingCollections = freshCollections.filter((fc) =>
    existingIds.includes(fc.id),
  );

  // Update existing collections
  const updated = dataSources.map((ds) => {
    // Only update if this collection name matches the recorded collection
    if (!ds.name.includes(collectionId)) {
      return ds; // Keep unchanged
    }

    // Find matching fresh collection
    const fresh = existingCollections.find((fc) => fc.id === ds.id);
    if (!fresh) {
      return ds; // Keep unchanged if no match
    }
    return fresh; // Replace with fresh data
  });

  // Add new collections at the beginning
  if (newCollections.length > 0) {
    setDataSources([...newCollections, ...updated]);
  } else {
    setDataSources(updated);
  }
};

/**
 * Refresh only the collections that have changed
 * Uses surgical updates to prevent full UI re-renders
 */
export const refreshPageSelective = async (
  setLoading,
  dataSources,
  setDataSources,
) => {
  setLoading(true);

  // Ensure dataSources is an array, if not do a full page initialization
  if (!Array.isArray(dataSources)) {
    const allCollections = await initializePage();
    setDataSources(allCollections);
    setLoading(false);
    return;
  }

  // Fetch all collections from IndexedDB
  let savedTweets = await getSavedCollections("twitter");
  let savedTiktoks = await getSavedCollections("tiktok");
  let savedFBs = await getSavedCollections("fb");

  // Get indices of each source type in current dataSources
  const getSourceIndices = (source) => {
    return dataSources
      .map((ds, idx) => ({ ds, idx }))
      .filter(({ ds }) => ds.source === source)
      .map(({ idx }) => idx);
  };

  const twitterIndices = getSourceIndices("twitter");
  const tiktokIndices = getSourceIndices("tiktok");
  const fbIndices = getSourceIndices("fb");

  // Compare and detect changes
  const detectChanges = (currentIndices, freshCollections) => {
    const currentCollections = currentIndices.map((idx) => dataSources[idx]);

    // Quick check: different number of collections
    if (currentCollections.length !== freshCollections.length) return true;

    // Compare total content length
    const currentTotal = currentCollections.reduce(
      (sum, col) => sum + col.content.length,
      0,
    );
    const freshTotal = freshCollections.reduce(
      (sum, col) => sum + col.content.length,
      0,
    );

    return currentTotal !== freshTotal;
  };

  const twitterChanged = detectChanges(twitterIndices, savedTweets);
  const tiktokChanged = detectChanges(tiktokIndices, savedTiktoks);
  const fbChanged = detectChanges(fbIndices, savedFBs);

  if (!twitterChanged && !tiktokChanged && !fbChanged) {
    setLoading(false);
    return;
  }

  // Surgical update: modify only changed items
  setDataSources((currentDataSources) => {
    // Create a shallow copy of the array for surgical updates
    const newDataSources = [...currentDataSources];

    // Remove old collections of changed sources (in reverse to maintain indices)
    if (twitterChanged) {
      for (let i = twitterIndices.length - 1; i >= 0; i--) {
        newDataSources.splice(twitterIndices[i], 1);
      }
    }
    if (tiktokChanged) {
      for (let i = tiktokIndices.length - 1; i >= 0; i--) {
        newDataSources.splice(tiktokIndices[i], 1);
      }
    }
    if (fbChanged) {
      for (let i = fbIndices.length - 1; i >= 0; i--) {
        newDataSources.splice(fbIndices[i], 1);
      }
    }

    // Find where to insert updated collections (keep them grouped by source)
    // Insert at the beginning of non-fileUpload items
    const firstUploadIndex = newDataSources.findIndex(
      (ds) => ds.source === "fileUpload",
    );
    const insertIndex =
      firstUploadIndex === -1 ? newDataSources.length : firstUploadIndex;

    // Insert updated collections
    const updatedCollections = [
      ...(twitterChanged ? savedTweets : []),
      ...(tiktokChanged ? savedTiktoks : []),
      ...(fbChanged ? savedFBs : []),
    ];

    newDataSources.splice(insertIndex, 0, ...updatedCollections);

    console.log("Collections updated:", {
      twitter: twitterChanged
        ? `${savedTweets.length} collections`
        : "unchanged",
      tiktok: tiktokChanged
        ? `${savedTiktoks.length} collections`
        : "unchanged",
      fb: fbChanged ? `${savedFBs.length} collections` : "unchanged",
    });

    return newDataSources;
  });

  setLoading(false);
};

/**
 * Legacy refresh function - reloads all collections
 * Use refreshPageSelective for better performance
 */
export const refreshPage = async (setLoading, dataSources, setDataSources) => {
  setLoading(true);
  let includedCollections = dataSources.filter(
    (x) => x.source !== "fileUpload",
  );
  let uploadedCollections = dataSources.filter(
    (x) => x.source === "fileUpload",
  );
  let savedTweets = await getSavedCollections("twitter");
  let savedTiktoks = await getSavedCollections("tiktok");
  let savedFBs = await getSavedCollections("fb");

  let newCollectedContentLength =
    savedTweets.map((x) => x.content).flat().length +
    savedTiktoks.map((x) => x.content).flat().length +
    savedFBs.map((x) => x.content).flat().length;

  let includedCollectionsLength = includedCollections
    .map((x) => x.content)
    .flat().length;

  let noNewContentFound =
    includedCollectionsLength === newCollectedContentLength;

  if (noNewContentFound) {
    setLoading(false);
  } else {
    let updatedDS = [
      ...savedTweets,
      ...savedTiktoks,
      ...savedFBs,
      ...uploadedCollections,
    ];
    setDataSources(updatedDS);
    setLoading(false);
  }
};

export const getSelectedSourcesContent = (dataSources, selected) => {
  let selectedSources = dataSources.filter((source) =>
    selected.includes(source.id),
  );

  // Community Notes have no author, date or engagement: analyses only use the tweets/posts
  return selectedSources
    .map((source) => source.content)
    .flat()
    .filter((entry) => !isCommunityNote(entry));
};

export const keepOnlyNumberFields = (obj) => {
  return Object.keys(obj).filter((k) => Number.isInteger(obj[k]));
};

export const getSelectedSourcesNameMaps = (dataSources, selected) => {
  let selectedSources = dataSources.filter((source) =>
    selected.includes(source.id),
  );
  let nameMaps = new Map(
    selectedSources
      .map((source) =>
        source.accountNameMap ? source.accountNameMap : new Map(),
      )
      .flatMap((m) => [...m]),
  );
  return nameMaps;
};

export const getSelectedSourceSharedHeaders = (dataSources, selected) => {
  let selectedSources = dataSources.filter((ds) => selected.includes(ds.id));
  // analyses only use tweets/posts: Community Notes fields are not proposed
  const getAnalysisHeaders = (ds) => ds.analysisHeaders ?? ds.headers;
  let sharedHeaders = selectedSources
    .map(getAnalysisHeaders)
    .flat()
    .filter(onlyUnique)
    .filter((header) =>
      selectedSources.every((source) =>
        getAnalysisHeaders(source).includes(header),
      ),
    );
  return sharedHeaders;
};

export const getTextClusters = async (
  selectedContent,
  authenticatedRequest,
) => {
  if (selectedContent.length === 0) return { status: "error" };
  const contentWithIds = selectedContent.map((x, idx) => ({ ...x, id: idx }));

  let d3ltaUrl = import.meta.env.VITE_D3LTA_URL; //

  const d3ltaInitRequestConfig = {
    method: "post",
    url: d3ltaUrl,
    data: contentWithIds,
  };

  const d3ltaStatusRequestConfig = {
    method: "get",
    url: d3ltaUrl,
  };

  const waitUntilFinish = async (job_id) => {
    d3ltaStatusRequestConfig.params = { id: job_id };

    while (true) {
      let statusResp = await authenticatedRequest(d3ltaStatusRequestConfig);
      if (statusResp.data.status === "DONE") {
        return statusResp.data;
      }
      if (statusResp.data.status === "FAILED") {
        throw new Error("snaTools_d3ltaServerError");
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  };

  let job_id;

  try {
    let resp = await authenticatedRequest(d3ltaInitRequestConfig);

    job_id = resp.data.id;
    let d3ltaResp = await waitUntilFinish(job_id);
    return d3ltaResp.result;
  } catch {
    return { status: "error" };
  }
};

export const onlyUnique = (value, index, array) => {
  return array.indexOf(value) === index;
};
