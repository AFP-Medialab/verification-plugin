import jp from "jsonpath";

import {
  extractTweetProperties,
  generateTweetLink,
  transformTiktok,
  transformTweetArrayProperties,
} from "../../utils/snaDataTransformers";

const cleanCrowdTangleFbDataUpload = (uploadedData) => {
  uploadedData.forEach((entry) => (entry.date = entry.date?.slice(0, -4)));
  let entriesWithTextAndHashtags = uploadedData.map((entry) => {
    // Extract and parse likes value (use lowercase 'likes' field)
    const likesValue = entry.likes || entry.Likes || "0";
    const parsedLikes = parseInt(likesValue) || 0;

    // Extract and parse Total Views
    const totalViewsValue = entry["Total Views"] || "0";
    const parsedViews = parseInt(totalViewsValue) || 0;

    // Extract text and create hashtags
    const text = entry.text || "";
    const hashtags = String(text)
      .split(" ")
      .filter((x) => x.length > 2 && x.includes("#"));

    return {
      ...entry,
      text,
      likes: parsedLikes,
      views: parsedViews,
      hashtags,
    };
  });

  const excludedHeaders = ["date", "id", "username", "likes", "views"];

  let numberHeaders = Object.keys(uploadedData[0]).filter(
    (k) => !isNaN(parseInt(uploadedData[0][k])) && !excludedHeaders.includes(k),
  );

  entriesWithTextAndHashtags.forEach((entry) => {
    numberHeaders.forEach(
      (header) => (entry[header] = parseInt(entry[header]) || 0),
    );
  });

  return entriesWithTextAndHashtags;
};

const cleanCustomUpload = (uploadedData) => {
  const excludedHeaders = ["date", "id", "username"];

  let numberHeaders = Object.keys(uploadedData[0]).filter(
    (k) => !isNaN(parseInt(uploadedData[0][k])) && !excludedHeaders.includes(k),
  );

  uploadedData.forEach((entry) => {
    numberHeaders.forEach(
      (header) => (entry[header] = parseInt(entry[header])),
    );
  });

  return uploadedData;
};
/**
 * Tokenize a comma-separated string into an array of trimmed values
 * @param {string|null|undefined} value - String to tokenize
 * @returns {Array<string>} Array of trimmed tokens, or empty array if value is null/undefined
 */
const tokenizeString = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
};

/**
 * Clean Twitter upload data by tokenizing comma-separated string fields
 * @param {Array} uploadedData - Raw uploaded data
 * @returns {Array} Cleaned data with tokenized fields
 */
const cleanTwitterUpload = (uploadedData) => {
  const processHeaders = ["hashtags", "links", "mentions"];
  uploadedData.forEach((entry) => {
    processHeaders.forEach((header) => {
      entry[header] = tokenizeString(entry[header]);
    });
  });
  return uploadedData;
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
 * Clean TikTok upload data by ensuring numeric fields are properly parsed
 * @param {Array} uploadedData - Raw uploaded data
 * @returns {Array} Cleaned data with parsed numeric fields
 */
const cleanTiktokUpload = (uploadedData) => {
  return uploadedData.map((entry) => {
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

export const cleanDataUpload = (
  uploadedData,
  socialMediaSelected,
  selectedCollection,
) => {
  let ret;
  //console.log("socialMediaSelected ", socialMediaSelected)
  if (socialMediaSelected === "crowdTangleFb") {
    ret = cleanCrowdTangleFbDataUpload(uploadedData);
  } else if (socialMediaSelected === "customUpload") {
    ret = cleanCustomUpload(uploadedData);
  } else if (socialMediaSelected === "twitter") {
    ret = cleanTwitterUpload(uploadedData);
  } else if (socialMediaSelected === "tiktok") {
    console.log("Applying TikTok cleaning...");
    ret = cleanTiktokUpload(uploadedData);
  } else {
    console.log("No specific cleaning applied, using raw data");
    ret = uploadedData;
  }

  let cleanedRet = ret.filter((entry) => entry.id != undefined);

  // Add  collectionID key from selected Collection
  cleanedRet.forEach((entry) => {
    entry.collectionID = selectedCollection;
  });

  return cleanedRet;
};

const makeCrowdTangleFbAccountNameMap = (uploadedData) => {
  return new Map(
    uploadedData.map((item) => [item.username, item["Page Name"]]),
  );
};

export const getAccountNameMap = (uploadedData, socialMediaSelected) => {
  if (socialMediaSelected === "fb") {
    return makeCrowdTangleFbAccountNameMap(uploadedData);
  } else {
    return new Map();
  }
};

export const reformatZeeschuimerTweets = (uploadedTweets, uploadedFileName) => {
  const reformatedTweets = uploadedTweets.map((tweet) => {
    const tweetInfo = tweet.data;

    // Extract all properties
    let reformatedTweet = extractTweetProperties(tweetInfo);
    reformatedTweet.collectionID = uploadedFileName;

    // Fallback for username if not found
    if (reformatedTweet.username.length === 0) {
      reformatedTweet.username =
        jp.query(tweetInfo.core.user_results.result, "$..screen_name")[0] || "";
    }

    // Parse views as integer
    reformatedTweet.views = parseInt(reformatedTweet.views);

    // Transform array properties
    reformatedTweet = transformTweetArrayProperties(reformatedTweet);

    // Extract media from the original tweet object
    const imageLink =
      jp.query(
        tweet,
        "$.result.legacy.extended_entities..media_url_https",
      )[0] || "None";

    const videoVariants =
      jp.query(
        tweet,
        "$.result.legacy.extended_entities..video_info.variants",
      )[0] || [];

    const video =
      videoVariants.filter((x) => x.content_type === "video/mp4")[0]?.url ||
      "None";

    reformatedTweet.imageLink = imageLink;
    reformatedTweet.video = video;

    // Generate tweet link
    reformatedTweet.tweetLink = generateTweetLink(
      reformatedTweet.username,
      reformatedTweet.id,
    );

    return reformatedTweet;
  });
  return reformatedTweets;
};

export const reformatZeeschuimerTiktoks = (uploadedData, uploadedFileName) => {
  const reformatedTiktoks = uploadedData.map((tiktok) => {
    const rawTiktok = tiktok.data;
    return transformTiktok(rawTiktok, rawTiktok.id, uploadedFileName);
  });
  return reformatedTiktoks;
};

export const handleZeeschuimerUpload = (
  uploadedData,
  uploadedFileName,
  socialMediaSelected,
) => {
  if (socialMediaSelected === "zeeschuimerTwitter") {
    return reformatZeeschuimerTweets(uploadedData, uploadedFileName);
  } else if (socialMediaSelected === "zeeschuimerTiktok") {
    return reformatZeeschuimerTiktoks(uploadedData, uploadedFileName);
  }
};
