import React from "react";

import DownloadIcon from "@mui/icons-material/Download";

import {
  KNOWN_LINKS,
  TOOLS_CATEGORIES,
  TOOL_GROUPS,
  Tool,
  canUserSeeTool,
  imageGif,
  tools,
} from "@/constants/tools";

export { TYPE_PATTERNS, KNOWN_LINK_PATTERNS } from "./constants";

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
  // find the record where from the regex patterns in said record, one of them matches "toMatch"
  if (!toMatch) {
    return null;
  }
  let match = matchObject.find((record) =>
    record.patterns.some((rgxpattern) => toMatch.match(rgxpattern) != null),
  );
  return match != null ? match.key : null;
};
