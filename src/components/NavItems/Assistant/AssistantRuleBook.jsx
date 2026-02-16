import React from "react";

import DownloadIcon from "@mui/icons-material/Download";

import {
  TOOLS_CATEGORIES,
  TOOL_GROUPS,
  Tool,
  canUserSeeTool,
  imageGif,
  thumbnails,
  tools,
  videoAnalysis,
} from "@/constants/tools";

export const NE_SUPPORTED_LANGS = ["en", "pt", "fr", "de", "el", "es", "it"];

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
  BLUESKY: "bsky",
  MISC: "general",
};

export const TYPE_PATTERNS = [
  {
    key: TOOLS_CATEGORIES.VIDEO,
    patterns: [/.(mp4|mkv)(.*)?$/i],
  },
  {
    key: TOOLS_CATEGORIES.IMAGE,
    patterns: [/.(jpg|jpeg|png)(.*)?$/i],
  },
];

export const KNOWN_LINK_PATTERNS = [
  {
    key: KNOWN_LINKS.BLUESKY,
    patterns: ["((https?:/{2})?(www.)?(bsky).app/profile/[\\w-.]+/post/\\w*)"],
  },
  {
    key: KNOWN_LINKS.TWITTER,
    patterns: [
      "((https?:/{2})?(www.)?(twitter|x).com/\\w{1,15}/status/\\d*)",
      "((https?:/{2})?(www.)?(twitter|x).com/i/birdwatch/t/\\d*)",
    ],
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
      "^(https?:/{2})?(www.)?facebook.com/reel/.*",
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

const DisabledDownloadIcon = (props) => {
  return <DownloadIcon color="disabled" {...props} />;
};

const downloadActions = [
  new Tool(
    "assistant_video_download_action",
    "assistant_video_download_action_description",
    DisabledDownloadIcon,
    TOOLS_CATEGORIES.VIDEO,
    null,
    null,
    null,
    TOOL_GROUPS.MORE,
    null,
    null,
    {
      linksAccepted: [
        KNOWN_LINKS.TELEGRAM,
        KNOWN_LINKS.FACEBOOK,
        KNOWN_LINKS.TWITTER,
        KNOWN_LINKS.MASTODON,
        KNOWN_LINKS.SNAPCHAT,
      ],
      exceptions: [],
      useInputUrl: false,
      text: "assistant_video_download_action_description",
      tsvPrefix: "assistant_video",
      download: true,
    },
  ),
  new Tool(
    "assistant_video_download_generic",
    "assistant_video_download_generic_description",
    DisabledDownloadIcon,
    TOOLS_CATEGORIES.VIDEO,
    null,
    null,
    null,
    TOOL_GROUPS.MORE,
    null,
    null,
    {
      linksAccepted: [
        KNOWN_LINKS.YOUTUBE,
        KNOWN_LINKS.YOUTUBESHORTS,
        KNOWN_LINKS.INSTAGRAM,
        KNOWN_LINKS.VK,
        KNOWN_LINKS.VIMEO,
        KNOWN_LINKS.LIVELEAK,
        KNOWN_LINKS.DAILYMOTION,
        KNOWN_LINKS.BLUESKY,
      ],
      exceptions: [],
      useInputUrl: false,
      text: "assistant_video_download_generic_description",
      tsvPrefix: "assistant_video",
    },
  ),
  new Tool(
    "assistant_video_download_tiktok",
    "assistant_video_download_tiktok_description",
    DisabledDownloadIcon,
    TOOLS_CATEGORIES.VIDEO,
    null,
    null,
    null,
    TOOL_GROUPS.MORE,
    null,
    null,
    {
      linksAccepted: [KNOWN_LINKS.TIKTOK],
      exceptions: [],
      useInputUrl: false,
      text: "assistant_video_download_tiktok_description",
      tsvPrefix: "assistant_video",
    },
  ),
];

export const selectCorrectActions = (
  contentType,
  inputUrlType,
  processUrlType,
  processUrl,
  role,
  isUserAuthenticated,
) => {
  let newPossibleActions = tools
    .concat(downloadActions)
    .filter(
      (tool) =>
        canUserSeeTool(tool, role, isUserAuthenticated) &&
        tool.category === contentType &&
        tool != imageGif && // ignored as tool requires two resources not just one image
        (!tool.assistantProps.linksAccepted ||
          tool.assistantProps.linksAccepted.includes(inputUrlType)) &&
        (!tool.assistantProps.processLinksAccepted ||
          tool.assistantProps.processLinksAccepted.includes(processUrlType)) &&
        (!tool.assistantProps.exceptions ||
          tool.assistantProps.exceptions.length === 0 ||
          !processUrl.match(tool.assistantProps.exceptions)),
    )
    .map((tool) => ({
      ...tool.assistantProps,
      title: tool.titleKeyword,
      icon: <tool.icon sx={{ fontSize: "24px" }} />,
      path: "tools/" + tool.path,
    }));

  return newPossibleActions;
};

export const matchPattern = (toMatch, matchObject) => {
  if (!toMatch) {
    return null;
  }
  // find the record where from the regex patterns in said record, one of them matches "toMatch"
  let match = matchObject.find((record) =>
    record.patterns.some((rgxpattern) => toMatch.match(rgxpattern) != null),
  );
  return match != null ? match.key : null;
};
