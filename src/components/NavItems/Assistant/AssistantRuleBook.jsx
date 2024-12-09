import React from "react";
import DownloadIcon from "@mui/icons-material/Download";

import { ROLES } from "../../../constants/roles.jsx";
import {
  imageAnalysis,
  imageDeepfake,
  imageForensic,
  imageMagnifier,
  imageMetadata,
  imageOcr,
  imageSyntheticDetection,
  keyframes,
  thumbnails,
  videoAnalysis,
  videoDeepfake,
  videoRights,
} from "../../../constants/tools";

export const NE_SUPPORTED_LANGS = ["en", "pt", "fr", "de", "el", "es", "it"];

export const CONTENT_TYPE = {
  VIDEO: "video",
  IMAGE: "image",
};

export const KNOWN_LINKS = {
  TWITTER: "twitter",
  INSTAGRAM: "instagram",
  SNAPCHAT: "snapchat",
  FACEBOOK: "facebook",
  TIKTOK: "tiktok",
  TELEGRAM: "telegram",
  YOUTUBE: "youtube",
  YOUTUBESHORTS: "youtubeshorts",
  DAILYMOTION: "dailymotion",
  LIVELEAK: "liveleak",
  VIMEO: "vimeo",
  MASTODON: "mastodon",
  OWN: "own",
  VK: "vk",
  MISC: "general",
};

export const TYPE_PATTERNS = [
  {
    key: CONTENT_TYPE.VIDEO,
    patterns: [/.(mp4|mkv)(.*)?$/i],
  },
  {
    key: CONTENT_TYPE.IMAGE,
    patterns: [/.(jpg|jpeg|png)(.*)?$/i],
  },
];

export const KNOWN_LINK_PATTERNS = [
  {
    key: KNOWN_LINKS.TWITTER,
    patterns: ["((https?:/{2})?(www.)?(twitter|x).com/\\w{1,15}/status/\\d*)"],
  },
  {
    key: KNOWN_LINKS.TIKTOK,
    patterns: ["((https?:\\/{2})?(www.)?tiktok.com\\/.*\\/video/\\d*)"],
  },
  {
    key: KNOWN_LINKS.SNAPCHAT,
    patterns: [
      "((https?:\\/{2})?(www.)?snapchat.com\\/(spotlight|lens)/\\w*)",
      "((https?:\\/{2})?(www.)?snapchat.com\\/p\\/[\\w\\-]+\\/\\w*)",
    ],
  },
  {
    key: KNOWN_LINKS.INSTAGRAM,
    patterns: [
      "((https?:\\/{2})?(www.)?instagram.com(\\/[A-Za-z0-9_]*)?\\/(([A-Za-z0-9\\.]+\\/)?p|reel)\\/.*)",
    ],
  },
  {
    key: KNOWN_LINKS.FACEBOOK,
    patterns: [
      "^(https?:/{2})?(www.)?facebook.com/.*/(videos|photos|posts)/.*",
    ],
  },
  {
    key: KNOWN_LINKS.TELEGRAM,
    patterns: ["^(https?:/{2})?(www.)?t.me/(s/)?\\w*/\\d*"],
  },
  {
    key: KNOWN_LINKS.YOUTUBE,
    patterns: [
      "(https?:\\/{2})?(www.)?((youtube.com\\/watch\\?v=)|youtu.be\\/)([a-zA-Z0-9_-]{11})",
    ],
  },
  {
    key: KNOWN_LINKS.YOUTUBESHORTS,
    patterns: [
      "(https?:\\/{2})?(www.)?((youtube.com\\/shorts\\/))([a-zA-Z0-9_-]{11})",
    ],
  },
  {
    key: KNOWN_LINKS.VIMEO,
    patterns: ["^(https?:/{2})?(www.)?vimeo.com/\\d*"],
  },
  {
    key: KNOWN_LINKS.DAILYMOTION,
    patterns: ["^(https?:/{2})?(www.)?dailymotion.com/video/.*"],
  },
  {
    key: KNOWN_LINKS.LIVELEAK,
    patterns: ["^(https?:/{2})?(www.)?liveleak.com/view\\?t=.*"],
  },
  {
    key: KNOWN_LINKS.MASTODON,
    patterns: ["^(?:https?:/{2})?(www.)?.+..+/@.*/d*"],
  },
  {
    key: KNOWN_LINKS.VK,
    patterns: [
      "(https?:\\/{2})?(www.)?vk.com\\/(wall|video)(-?)\\d*_\\d*(\\??)",
    ],
  },
  {
    key: KNOWN_LINKS.MISC,
    patterns: [
      "(http(s)?://.)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)",
    ],
  },
];

export const ASSISTANT_ACTIONS = [
  {
    title: "navbar_analysis_video",
    icon: <videoAnalysis.icon sx={{ fontSize: "24px" }} />,
    linksAccepted: [
      KNOWN_LINKS.YOUTUBE,
      KNOWN_LINKS.FACEBOOK,
      KNOWN_LINKS.SNAPCHAT,
    ],
    cTypes: [CONTENT_TYPE.VIDEO],
    exceptions: [],
    useInputUrl: true,
    text: "video_analysis_text",
    tsvPrefix: "api",
    path: "tools/analysis",
  },
  {
    title: "navbar_analysis_image",
    icon: <imageAnalysis.icon sx={{ fontSize: "24px" }} />,
    linksAccepted: [
      KNOWN_LINKS.FACEBOOK,
      KNOWN_LINKS.TWITTER,
      KNOWN_LINKS.SNAPCHAT,
    ],
    cTypes: [CONTENT_TYPE.IMAGE],
    exceptions: [],
    useInputUrl: true,
    text: "image_analysis_text",
    tsvPrefix: "api",
    path: "tools/analysisImage",
  },
  {
    title: "navbar_keyframes",
    icon: <keyframes.icon sx={{ fontSize: "24px" }} />,
    linksAccepted: [
      KNOWN_LINKS.YOUTUBE,
      KNOWN_LINKS.FACEBOOK,
      KNOWN_LINKS.YOUTUBE,
      KNOWN_LINKS.YOUTUBESHORTS,
      KNOWN_LINKS.LIVELEAK,
      KNOWN_LINKS.SNAPCHAT,
      KNOWN_LINKS.OWN,
    ],
    cTypes: [CONTENT_TYPE.VIDEO],
    exceptions: [],
    useInputUrl: true,
    text: "keyframes_text",
    tsvPrefix: "keyframes",
    path: "tools/keyframes",
  },
  {
    title: "navbar_thumbnails",
    icon: <thumbnails.icon sx={{ fontSize: "24px" }} />,
    linksAccepted: [KNOWN_LINKS.YOUTUBE],
    cTypes: [CONTENT_TYPE.VIDEO],
    exceptions: [],
    useInputUrl: true,
    text: "thumbnails_text",
    tsvPrefix: "thumbnails",
    path: "tools/thumbnails",
  },
  {
    title: "navbar_magnifier",
    icon: <imageMagnifier.icon sx={{ fontSize: "24px" }} />,
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    cTypes: [CONTENT_TYPE.IMAGE],
    exceptions: [],
    useInputUrl: false,
    text: "magnifier_text",
    tsvPrefix: "magnifier",
    path: "tools/magnifier",
  },
  {
    title: "navbar_metadata",
    icon: <imageMetadata.icon sx={{ fontSize: "24px" }} />,
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    cTypes: [CONTENT_TYPE.IMAGE, CONTENT_TYPE.VIDEO],
    exceptions: [
      /(pbs.twimg.com)|(youtu.be|youtube)|(instagram)|(fbcdn.net)|(vimeo)|(snapchat)|(tiktok.com)/,
    ],
    useInputUrl: false,
    text: "metadata_text",
    tsvPrefix: "metadata",
    path: "tools/metadata",
  },
  {
    title: "navbar_rights",
    icon: <videoRights.icon sx={{ fontSize: "24px" }} />,
    linksAccepted: [KNOWN_LINKS.YOUTUBE],
    cTypes: [CONTENT_TYPE.VIDEO],
    exceptions: [],
    useInputUrl: true,
    text: "rights_text",
    tsvPrefix: "copyright",
    path: "tools/copyright",
  },
  {
    title: "navbar_forensic",
    icon: <imageForensic.icon sx={{ fontSize: "24px" }} />,
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    cTypes: [CONTENT_TYPE.IMAGE],
    exceptions: [],
    useInputUrl: false,
    text: "forensic_text",
    tsvPrefix: "forensic",
    path: "tools/forensic",
  },
  {
    title: "navbar_ocr",
    icon: <imageOcr.icon sx={{ fontSize: "24px" }} />,
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    cTypes: [CONTENT_TYPE.IMAGE],
    exceptions: [],
    useInputUrl: false,
    text: "ocr_text",
    tsvPrefix: "ocr",
    path: "tools/ocr",
  },
  {
    title: "navbar_synthetic_image_detection",
    icon: <imageSyntheticDetection.icon sx={{ fontSize: "24px" }} />,
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    cTypes: [CONTENT_TYPE.IMAGE],
    exceptions: [],
    useInputUrl: false,
    text: "synthetic_image_detection_text",
    tsvPrefix: "synthetic_image_detection",
    path: "tools/syntheticImageDetection",
    betaTester: true,
  },
  {
    title: "navbar_deepfake_image",
    icon: <imageDeepfake.icon sx={{ fontSize: "24px" }} />,
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    cTypes: [CONTENT_TYPE.IMAGE],
    exceptions: [],
    useInputUrl: false,
    text: "deepfake_image_text",
    tsvPrefix: "deepfakeImage",
    path: "tools/deepfakeImage",
    betaTester: true,
  },
  {
    title: "navbar_deepfake_video",
    icon: <videoDeepfake.icon sx={{ fontSize: "24px" }} />,
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    cTypes: [CONTENT_TYPE.VIDEO],
    exceptions: [],
    useInputUrl: false,
    text: "deepfake_video_text",
    tsvPrefix: "deepfakeVideo",
    path: "tools/deepfakeVideo",
    betaTester: true,
  },
  {
    title: "assistant_video_download_action",
    icon: <DownloadIcon color="disabled" fontSize="large" />,
    linksAccepted: [
      KNOWN_LINKS.TELEGRAM,
      KNOWN_LINKS.FACEBOOK,
      KNOWN_LINKS.TWITTER,
      KNOWN_LINKS.MASTODON,
      KNOWN_LINKS.SNAPCHAT,
    ],
    cTypes: [CONTENT_TYPE.VIDEO],
    exceptions: [],
    useInputUrl: false,
    text: "assistant_video_download_action_description",
    tsvPrefix: "assistant_video",
    download: true,
  },
  {
    title: "assistant_video_download_generic",
    icon: <DownloadIcon color="disabled" fontSize="large" />,
    linksAccepted: [
      KNOWN_LINKS.YOUTUBESHORTS,
      KNOWN_LINKS.INSTAGRAM,
      KNOWN_LINKS.FACEBOOK,
      KNOWN_LINKS.VK,
      KNOWN_LINKS.VIMEO,
      KNOWN_LINKS.LIVELEAK,
      KNOWN_LINKS.DAILYMOTION,
    ],
    cTypes: [CONTENT_TYPE.VIDEO],
    exceptions: [],
    useInputUrl: false,
    text: "assistant_video_download_generic_description",
    tsvPrefix: "assistant_video",
    path: null,
  },
  {
    title: "assistant_video_download_tiktok",
    icon: <DownloadIcon color="disabled" fontSize="large" />,
    linksAccepted: [KNOWN_LINKS.TIKTOK],
    cTypes: [CONTENT_TYPE.VIDEO],
    exceptions: [],
    useInputUrl: false,
    text: "assistant_video_download_tiktok_description",
    tsvPrefix: "assistant_video",
    path: null,
  },
];

export const selectCorrectActions = (
  contentType,
  inputUrlType,
  processUrlType,
  processUrl,
  role,
) => {
  let possibleActions = ASSISTANT_ACTIONS.filter(
    (action) =>
      (!action.linksAccepted || action.linksAccepted.includes(inputUrlType)) &&
      (!action.processLinksAccepted ||
        action.processLinksAccepted.includes(processUrlType)) &&
      action.cTypes.includes(contentType) &&
      (action.exceptions.length === 0 ||
        !processUrl.match(action.exceptions)) &&
      (!action.betaTester ||
        (action.betaTester && role.includes(ROLES.BETA_TESTER))),
  );
  return possibleActions;
};

export const matchPattern = (toMatch, matchObject) => {
  // find the record where from the regex patterns in said record, one of them matches "toMatch"
  let match = matchObject.find((record) =>
    record.patterns.some((rgxpattern) => toMatch.match(rgxpattern) != null),
  );
  return match != null ? match.key : null;
};
