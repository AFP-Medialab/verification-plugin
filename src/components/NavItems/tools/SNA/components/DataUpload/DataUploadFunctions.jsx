import { TIKTOK_PROPERTY_PATHS, TWEET_PROPERTY_PATHS } from "background";
import dayjs from "dayjs";
import jp from "jsonpath";
import _ from "lodash";

const cleanCrowdTangleFbDataUpload = (uploadedData) => {
  uploadedData.forEach((entry) => (entry.date = entry.date?.slice(0, -4)));

  let entriesWithTextAndHashtags = uploadedData.map(
    ({
      text,
      Likes: likes,
      // ["Message"]: text,
      ...rest
    }) => ({
      ...rest,
      text,
      likes: parseInt(likes),
      hashtags: text?.split(" ").filter((x) => x.length > 2 && x.includes("#")),
    }),
  );

  const excludedHeaders = ["date", "id", "username"];

  let numberHeaders = Object.keys(uploadedData[0]).filter(
    (k) => !isNaN(parseInt(uploadedData[0][k])) && !excludedHeaders.includes(k),
  );

  entriesWithTextAndHashtags.forEach((entry) => {
    numberHeaders.forEach(
      (header) => (entry[header] = parseInt(entry[header])),
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

export const cleanDataUpload = (uploadedData, socialMediaSelected) => {
  let ret;
  if (socialMediaSelected === "crowdTangleFb") {
    ret = cleanCrowdTangleFbDataUpload(uploadedData);
  } else if (socialMediaSelected === "customUpload") {
    ret = cleanCustomUpload(uploadedData);
  } else {
    ret = uploadedData;
  }
  let cleanedRet = ret.filter((entry) => entry.id != undefined);
  return cleanedRet;
};

const makeCrowdTangleFbAccountNameMap = (uploadedData) => {
  return new Map(
    uploadedData.map((item) => [item.username, item["Page Name"]]),
  );
};

export const getAccountNameMap = (uploadedData, socialMediaSelected) => {
  if (socialMediaSelected === "crowdTangleFb") {
    return makeCrowdTangleFbAccountNameMap(uploadedData);
  } else {
    return new Map();
  }
};

export const reformatZeeschuimerTweets = (uploadedTweets, uploadedFileName) => {
  const reformatedTweets = uploadedTweets.map((tweet) => {
    let tweetInfo = tweet.data;
    let reformatedTweet = {};

    reformatedTweet.collectionID = uploadedFileName;

    let fields = Object.keys(TWEET_PROPERTY_PATHS);

    fields.forEach(
      (k) =>
        (reformatedTweet[k] = _.get(
          tweetInfo,
          TWEET_PROPERTY_PATHS[k].path,
          TWEET_PROPERTY_PATHS[k].default,
        )),
    );

    if (reformatedTweet.username.length === 0) {
      reformatedTweet.username =
        jp.query(tweetInfo.core.user_results.result, "$..screen_name")[0] || "";
    }

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

export const reformatZeeschuimerTiktoks = (uploadedData, uploadedFileName) => {
  const reformatedTiktoks = uploadedData.map((tiktok) => {
    let rawTiktok = tiktok.data;
    let reformatedTiktok = {};
    reformatedTiktok.id = rawTiktok.id;
    reformatedTiktok.collectionID = uploadedFileName;
    Object.keys(TIKTOK_PROPERTY_PATHS).forEach(
      (k) =>
        (reformatedTiktok[k] = _.get(
          rawTiktok,
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
