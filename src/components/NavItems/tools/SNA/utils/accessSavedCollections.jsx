const collectionAccessors = {
  twitter: {
    prompt: "getTweets",
    nameTag: "~TWITTER",
    idTag: "tweets~",
    sourceTag: "twitter",
  },
  tiktok: {
    prompt: "getTiktoks",
    nameTag: "~TIKTOK",
    idTag: "tiktoks~",
    sourceTag: "tiktok",
  },
};

export const getCollectionMetrics = (collectionEntries) => {
  let uniqueUsers = collectionEntries.map((e) => e.username).filter(onlyUnique);
  let totalLikes = collectionEntries
    .map((e) => parseInt(e.likes))
    .reduce((acc, curr) => acc + curr || 0, 0);
  let totalViews = collectionEntries
    .map((e) => parseInt(e.views))
    .reduce((acc, curr) => acc + curr || 0, 0);

  return [
    {
      label: "collection_nbOfPosts",
      value: collectionEntries.length,
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

/**
 * Sends message to background to retrieve all collections
 * and return their entries formatted as dataSources object
 * @param collectionSource {string} The saved collection type
 * @returns Object[] formatted as dataSource (cf. SNA.jsx)
 */
export const getSavedCollections = async (collectionSource) => {
  const allCollectionEntries = await chrome.runtime.sendMessage({
    prompt: collectionAccessors[collectionSource].prompt,
  });

  const filteredEntries = allCollectionEntries.filter((x) => x != undefined);
  const entriesGroupedByCollection = Object.groupBy(
    filteredEntries,
    ({ collectionID }) => collectionID,
  );

  const collectionsAsDataSources = Object.keys(entriesGroupedByCollection).map(
    (collectionID, idx) => {
      let collectionEntries = entriesGroupedByCollection[collectionID].filter(
        (entry) => entry.id.length > 0,
      );
      let dedpulicateEntries = Array.from(
        new Map(collectionEntries.map((item) => [item.id, item])).values(),
      );

      let collectionMetrics = getCollectionMetrics(dedpulicateEntries);

      return {
        id: collectionAccessors[collectionSource].idTag + idx,
        name: collectionID + collectionAccessors[collectionSource].nameTag,
        length: dedpulicateEntries.length,
        metrics: collectionMetrics,
        content: dedpulicateEntries,
        headers:
          dedpulicateEntries.length > 0
            ? Object.keys(dedpulicateEntries[0])
            : [],
        accountNameMap: new Map(),
        source: collectionAccessors[collectionSource].sourceTag,
      };
    },
  );
  return collectionsAsDataSources;
};

export const initializePage = async () => {
  let savedTweets = await getSavedCollections("twitter");
  let savedTiktoks = await getSavedCollections("tiktok");

  return [...savedTweets, ...savedTiktoks];
};

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

  let newCollectedContentLength =
    savedTweets.map((x) => x.content).flat().length +
    savedTiktoks.map((x) => x.content).flat().length;

  let includedCollectionsLength = includedCollections
    .map((x) => x.content)
    .flat().length;

  let noNewContentFound =
    includedCollectionsLength === newCollectedContentLength;

  if (noNewContentFound) {
    setLoading(false);
  } else {
    let updatedDS = [...savedTweets, ...savedTiktoks, ...uploadedCollections];
    setDataSources(updatedDS);
    setLoading(false);
  }
};

export const getSelectedSourcesContent = (dataSources, selected) => {
  let selectedSources = dataSources.filter((source) =>
    selected.includes(source.id),
  );

  let selectedContent = selectedSources.map((source) => source.content).flat();

  return selectedContent;
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
  let sharedHeaders = selectedSources
    .map((ds) => ds.headers)
    .flat()
    .filter(onlyUnique)
    .filter((header) =>
      selectedSources.every((source) => source.headers.includes(header)),
    );
  return sharedHeaders;
};

export const getTextClusters = async (
  selectedContent,
  authenticatedRequest,
) => {
  if (selectedContent.length === 0) return { status: "error" };
  selectedContent.forEach((x, idx) => (x.id = idx));

  let d3ltaUrl = process.env.REACT_APP_D3LTA_URL; //

  const d3ltaInitRequestConfig = {
    method: "post",
    url: d3ltaUrl,
    data: selectedContent,
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
