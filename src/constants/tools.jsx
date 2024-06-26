import React from "react";

import { SvgIcon } from "@mui/material";
import { Archive, AudioFile } from "@mui/icons-material";

import ToolsIcon from "../components/NavBar/images/SVG/Navbar/Tools.svg";

import AnalysisIcon from "../components/NavBar/images/SVG/Video/Video_analysis.svg";
import KeyframesIcon from "../components/NavBar/images/SVG/Video/Keyframes.svg";
import ThumbnailsIcon from "../components/NavBar/images/SVG/Video/Thumbnails.svg";
import VideoRightsIcon from "../components/NavBar/images/SVG/Video/Video_rights.svg";

import MetadataIcon from "../components/NavBar/images/SVG/Image/Metadata.svg";
import DeepfakeIcon from "../components/NavBar/images/SVG/Image/Deepfake.svg";
import ImageAnalysisIcon from "../components/NavBar/images/SVG/Image/Image_analysis.svg";
import MagnifierIcon from "../components/NavBar/images/SVG/Image/Magnifier.svg";
import ForensicIcon from "../components/NavBar/images/SVG/Image/Forensic.svg";
import OcrIcon from "../components/NavBar/images/SVG/Image/OCR.svg";
import GifIcon from "../components/NavBar/images/SVG/Image/Gif.svg";
import GeolocationIcon from "../components/NavBar/images/SVG/Image/Geolocation.svg";

import TwitterSearchIcon from "../components/NavBar/images/SVG/Search/Twitter_search.svg";
import CovidSearchIcon from "../components/NavBar/images/SVG/Search/Covid19.svg";
import XnetworkIcon from "../components/NavBar/images/SVG/Search/Xnetwork.svg";

import TwitterSnaIcon from "../components/NavBar/images/SVG/DataAnalysis/Twitter_sna.svg";
import CsvSnaIcon from "../components/NavBar/images/SVG/DataAnalysis/CSV_SNA.svg";
import AboutIcon from "../components/NavBar/images/SVG/Navbar/About.svg";
import ToolsMenu from "../components/NavItems/tools/Alltools/ToolsMenu";
import Analysis from "../components/NavItems/tools/Analysis/Analysis";
import { Footer, FOOTER_TYPES } from "../components/Shared/Footer/Footer";
import Keyframes from "../components/NavItems/tools/Keyframes/Keyframes";
import Thumbnails from "../components/NavItems/tools/Thumbnails/Thumbnails";
import VideoRights from "../components/NavItems/tools/VideoRights/VideoRights";
import Metadata from "../components/NavItems/tools/Metadata/Metadata";
import DeepfakeVideo from "../components/NavItems/tools/Deepfake/DeepfakeVideo";
import AnalysisImg from "../components/NavItems/tools/Analysis_images/Analysis";
import Magnifier from "../components/NavItems/tools/Magnifier/Magnifier";
import Forensic from "../components/NavItems/tools/Forensic/Forensic";
import OCR from "../components/NavItems/tools/OCR/OCR";
import CheckGif from "../components/NavItems/tools/Gif/CheckGif";
import SyntheticImageDetection from "../components/NavItems/tools/SyntheticImageDetection";
import DeepfakeImage from "../components/NavItems/tools/Deepfake/DeepfakeImage";
import Geolocation from "../components/NavItems/tools/Geolocation/Geolocation";
import Loccus from "../components/NavItems/tools/Loccus";
import TwitterAdvancedSearch from "../components/NavItems/tools/TwitterAdvancedSearch/TwitterAdvancedSearch";
import SemanticSearch from "../components/NavItems/tools/SemanticSearch";
import TwitterSna from "../components/NavItems/tools/TwitterSna/TwitterSna";

/**
 * Represents the categories to which the tools belong
 * @typedef ToolsCategories
 * @type {{OTHER: string, ALL: string, IMAGE: string, VIDEO: string, SEARCH: string, DATA_ANALYSIS: string, AUDIO: string}}
 */
export const TOOLS_CATEGORIES = {
  VIDEO: "navbar_category_video",
  IMAGE: "navbar_category_image",
  AUDIO: "navbar_category_audio",
  SEARCH: "navbar_category_search",
  DATA_ANALYSIS: "navbar_category_data",
  OTHER: "navbar_category_other",

  // Used to display the home page
  ALL: "navbar_category_general",
};

/**
 * Represents the possible temporary states of the tools:
 * - An experimental tool is not ready for production, and available to beta testers
 * - A new tool is an experimental tool that was released to everyone
 * - A locked tool is a tool available to registered users
 * @typedef ToolsStatusIcon
 * @type {{NEW: string, LOCK: string, EXPERIMENTAL: string}}
 */
export const TOOL_STATUS_ICON = {
  EXPERIMENTAL: "experimental",
  NEW: "new",
  LOCK: "lock",
};

/**
 * Represents the different segments of tools.
 * Verification - The tools that can be used for Verification
 * Learning - Resources to learn how to use the Verification Tools
 * More - Settings and general information
 * @typedef ToolGroups
 * @type {{MORE: string, LEARNING: string, VERIFICATION: string}}
 */
export const TOOL_GROUPS = {
  VERIFICATION: "verification",
  LEARNING: "learning",
  MORE: "more",
};

/**
 * Represents the user roles that can be needed to access a given tool
 * @typedef Roles
 * @type {{BETA_TESTER: string, ARCHIVE: string, LOCK: string}}
 */
export const ROLES = {
  ARCHIVE: "ARCHIVE",
  BETA_TESTER: "BETA_TESTER",
  LOCK: "lock",
};

/**
 * Represents a tool that can be used by users
 */
class Tool {
  /**
   *
   * @param titleKeyword {string} The keyword for the name of the tool
   * @param descriptionKeyword {string=} The keyword for the tool description
   * @param icon {SvgIconComponent | React.JSX.Element} The tool's icon
   * @param category {ToolsCategories} The tool's category
   * @param rolesIcons {?Array<ToolsStatusIcon>} Icons representing the development status of the tool
   * @param rolesNeeded {?Array<Roles>} Role(s) needed to access the tool
   * @param path {string} The url path to the tool
   * @param toolGroup {ToolGroups} The group to which the tool belongs
   * @param content The React Element to display for the tool
   * @param footer The React element to display at the bottom of the tool React Element
   */
  constructor(
    titleKeyword,
    descriptionKeyword,
    icon,
    category,
    rolesIcons,
    rolesNeeded,
    path,
    toolGroup,
    content,
    footer,
  ) {
    this.titleKeyword = titleKeyword;
    this.descriptionKeyword = descriptionKeyword;
    this.icon = icon;
    this.category = category;
    this.rolesIcons = rolesIcons;
    this.rolesNeeded = rolesNeeded;
    this.path = path;
    this.toolGroup = toolGroup;
    this.content = content;
    this.footer = footer;
  }
}

const ToolsSvgIcon = (props) => {
  return <SvgIcon component={ToolsIcon} inheritViewBox {...props} />;
};

/**
 * The Homepage that lists all the tools available
 * @type {Tool}
 */
const toolsHome = new Tool(
  "navbar_tools",
  "",
  ToolsSvgIcon,
  TOOLS_CATEGORIES.ALL,
  null,
  null,
  "all",
  TOOL_GROUPS.VERIFICATION,
  <ToolsMenu tools={tools} />,
  <div />,
);

/**
 * Video tools
 **/

const videoAnalysis = new Tool(
  "navbar_analysis_video",
  "navbar_analysis_description",
  <SvgIcon component={AnalysisIcon} inheritViewBox />,
  TOOLS_CATEGORIES.VIDEO,
  null,
  null,
  "analysis",
  TOOL_GROUPS.VERIFICATION,
  <Analysis />,
  <Footer type={FOOTER_TYPES.ITI} />,
);

const keyframes = new Tool(
  "navbar_keyframes",
  "navbar_keyframes_description",
  <SvgIcon component={KeyframesIcon} inheritViewBox />,
  TOOLS_CATEGORIES.VIDEO,
  null,
  null,
  "keyframes",
  TOOL_GROUPS.VERIFICATION,
  <Keyframes />,
  <Footer type={FOOTER_TYPES.ITI} />,
);

const thumbnails = new Tool(
  "navbar_thumbnails",
  "navbar_thumbnails_description",
  <SvgIcon component={ThumbnailsIcon} inheritViewBox />,
  TOOLS_CATEGORIES.VIDEO,
  null,
  null,
  "thumbnails",
  TOOL_GROUPS.VERIFICATION,
  <Thumbnails />,
  <Footer type={FOOTER_TYPES.AFP} />,
);

const videoRights = new Tool(
  "navbar_rights",
  "navbar_rights_description",
  <SvgIcon component={VideoRightsIcon} inheritViewBox />,
  TOOLS_CATEGORIES.VIDEO,
  null,
  null,
  "copyright",
  TOOL_GROUPS.VERIFICATION,
  <VideoRights />,
  <Footer type={FOOTER_TYPES.GRIHO} />,
);

const videoMetadata = new Tool(
  "navbar_metadata_video",
  "navbar_metadata_description",
  <SvgIcon component={MetadataIcon} inheritViewBox />,
  TOOLS_CATEGORIES.VIDEO,
  null,
  null,
  "metadata",
  TOOL_GROUPS.VERIFICATION,
  <Metadata mediaType={"video"} />,
  <Footer type={FOOTER_TYPES.AFP} />,
);

const videoDeepfake = new Tool(
  "navbar_deepfake_video",
  "navbar_deepfake_video_description",
  <SvgIcon component={DeepfakeIcon} inheritViewBox />,
  TOOLS_CATEGORIES.VIDEO,
  [TOOL_STATUS_ICON.EXPERIMENTAL],
  [ROLES.BETA_TESTER],
  "deepfakeVideo",
  TOOL_GROUPS.VERIFICATION,
  <DeepfakeVideo />,
  <Footer type={FOOTER_TYPES.ITI} />,
);

/**
 * Image tools
 **/

const imageAnalysis = new Tool(
  "navbar_analysis_image",
  "navbar_analysis_image_description",
  <SvgIcon component={ImageAnalysisIcon} inheritViewBox />,
  TOOLS_CATEGORIES.IMAGE,
  [],
  [],
  "analysisImage",
  TOOL_GROUPS.VERIFICATION,
  <AnalysisImg />,
  <Footer type={FOOTER_TYPES.ITI} />,
);

const imageMagnifier = new Tool(
  "navbar_magnifier",
  "navbar_magnifier_description",
  <SvgIcon component={MagnifierIcon} inheritViewBox />,
  TOOLS_CATEGORIES.IMAGE,
  [],
  [],
  "magnifier",
  TOOL_GROUPS.VERIFICATION,
  <Magnifier />,
  <Footer type={FOOTER_TYPES.AFP} />,
);

const imageMetadata = new Tool(
  "navbar_metadata_image",
  "navbar_metadata_description",
  <SvgIcon component={MetadataIcon} inheritViewBox />,
  TOOLS_CATEGORIES.IMAGE,
  [],
  [],
  "metadata_image",
  TOOL_GROUPS.VERIFICATION,
  <Metadata mediaType={"image"} />,
  <Footer type={FOOTER_TYPES.AFP} />,
);

const imageForensic = new Tool(
  "navbar_forensic",
  "navbar_forensic_description",
  <SvgIcon component={ForensicIcon} inheritViewBox />,
  TOOLS_CATEGORIES.IMAGE,
  [],
  [],
  "forensic",
  TOOL_GROUPS.VERIFICATION,
  <Forensic />,
  <Footer type={FOOTER_TYPES.ITI_BORELLI_AFP} />,
);

const imageOcr = new Tool(
  "navbar_ocr",
  "navbar_ocr_description",
  <SvgIcon component={OcrIcon} inheritViewBox />,
  TOOLS_CATEGORIES.IMAGE,
  [],
  [],
  "ocr",
  TOOL_GROUPS.VERIFICATION,
  <OCR />,
  <Footer type={FOOTER_TYPES.USFD} />,
);

const imageGif = new Tool(
  "navbar_gif",
  "navbar_gif_description",
  <SvgIcon component={GifIcon} inheritViewBox />,
  TOOLS_CATEGORIES.IMAGE,
  [TOOL_STATUS_ICON.LOCK],
  [ROLES.LOCK],
  "gif",
  TOOL_GROUPS.VERIFICATION,
  <CheckGif />,
  <Footer type={FOOTER_TYPES.BORELLI_AFP} />,
);

const imageSyntheticDetection = new Tool(
  "navbar_synthetic_image_detection",
  "navbar_synthetic_image_detection_description",
  <SvgIcon component={GifIcon} inheritViewBox />,
  TOOLS_CATEGORIES.IMAGE,
  [TOOL_STATUS_ICON.NEW, TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
  [ROLES.BETA_TESTER],
  "syntheticImageDetection",
  TOOL_GROUPS.VERIFICATION,
  <SyntheticImageDetection />,
  <Footer type={FOOTER_TYPES.ITI_UNINA} />,
);

const imageDeepfake = new Tool(
  "navbar_deepfake_image",
  "navbar_deepfake_image_description",
  <SvgIcon component={DeepfakeIcon} inheritViewBox />,
  TOOLS_CATEGORIES.IMAGE,
  [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
  [ROLES.BETA_TESTER],
  "deepfakeImage",
  TOOL_GROUPS.VERIFICATION,
  <DeepfakeImage />,
  <Footer type={FOOTER_TYPES.ITI} />,
);

const imageGeolocation = new Tool(
  "navbar_geolocation",
  "navbar_geolocation_description",
  <SvgIcon component={GeolocationIcon} inheritViewBox />,
  TOOLS_CATEGORIES.IMAGE,
  [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
  [ROLES.BETA_TESTER],
  "geolocation",
  TOOL_GROUPS.VERIFICATION,
  <Geolocation />,
  <Footer type={FOOTER_TYPES.AFP} />,
);

/**
 * Audio tools
 **/

const audioLoccus = new Tool(
  "navbar_loccus",
  "navbar_loccus_description",
  <AudioFile />,
  TOOLS_CATEGORIES.AUDIO,
  [TOOL_STATUS_ICON.NEW, TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
  [ROLES.BETA_TESTER],
  "loccus",
  TOOL_GROUPS.VERIFICATION,
  <Loccus />,
  <Footer type={FOOTER_TYPES.LOCCUS} />,
);

/**
 * Search tools
 **/

const searchTwitter = new Tool(
  "navbar_twitter",
  "navbar_twitter_description",
  <SvgIcon component={TwitterSearchIcon} inheritViewBox />,
  TOOLS_CATEGORIES.SEARCH,
  null,
  null,
  "twitter",
  TOOL_GROUPS.VERIFICATION,
  <TwitterAdvancedSearch />,
  <Footer type={FOOTER_TYPES.AFP} />,
);

const searchSemantic = new Tool(
  "navbar_semantic_search",
  "navbar_semantic_search_description",
  <AudioFile />,
  TOOLS_CATEGORIES.SEARCH,
  [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.NEW, TOOL_STATUS_ICON.LOCK],
  [ROLES.LOCK],
  "semanticSearch",
  TOOL_GROUPS.VERIFICATION,
  <SemanticSearch />,
  <Footer type={FOOTER_TYPES.KINIT} />,
);

const searchCovid = new Tool(
  "navbar_covidsearch",
  "navbar_covidsearch_description",
  <SvgIcon component={CovidSearchIcon} inheritViewBox />,
  TOOLS_CATEGORIES.SEARCH,
  [],
  [],
  "factcheck",
  TOOL_GROUPS.VERIFICATION,
  null,
  null,
);

const searchXnetwork = new Tool(
  "navbar_xnetwork",
  "navbar_xnetwork_description",
  <SvgIcon component={XnetworkIcon} inheritViewBox />,
  TOOLS_CATEGORIES.SEARCH,
  [],
  [],
  "xnetwork",
  TOOL_GROUPS.VERIFICATION,
  null,
  null,
);

/**
 * Data Analysis tools
 **/

const dataAnalysisSna = new Tool(
  "navbar_twitter_sna",
  "navbar_twitter_sna_description",
  <SvgIcon component={TwitterSnaIcon} inheritViewBox />,
  TOOLS_CATEGORIES.DATA_ANALYSIS,
  [TOOL_STATUS_ICON.LOCK],
  [ROLES.LOCK],
  "twitterSna",
  TOOL_GROUPS.VERIFICATION,
  <TwitterSna />,
  <Footer type={FOOTER_TYPES.USFD_AFP_EU_DISINFOLAB} />,
);

const dataAnalysisCrowdtangle = new Tool(
  "navbar_twitter_crowdtangle",
  "navbar_twitter_crowdtangle_description",
  <SvgIcon component={CsvSnaIcon} inheritViewBox />,
  TOOLS_CATEGORIES.DATA_ANALYSIS,
  [],
  [],
  "csvSna",
  TOOL_GROUPS.VERIFICATION,
  <Archive />,
  <Footer type={FOOTER_TYPES.AFP} />,
);

/**
 * Other tools
 **/

const archiving = new Tool(
  "navbar_archiving",
  "navbar_archiving_description",
  <Archive />,
  TOOLS_CATEGORIES.OTHER,
  [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.NEW, TOOL_STATUS_ICON.LOCK],
  [ROLES.ARCHIVE],
  "archive",
  TOOL_GROUPS.VERIFICATION,
);

/**
 *
 * Other Group tools
 */
const about = new Tool(
  "navbar_about",
  "",
  <SvgIcon component={AboutIcon} inheritViewBox />,
  null,
  null,
  null,
  "about",
  TOOL_GROUPS.MORE,
  null,
  null,
);

export const tools = [
  toolsHome,
  videoAnalysis,
  keyframes,
  thumbnails,
  videoRights,
  videoMetadata,
  videoDeepfake,
  imageAnalysis,
  imageMagnifier,
  imageMetadata,
  imageForensic,
  imageOcr,
  imageGif,
  imageSyntheticDetection,
  imageDeepfake,
  imageGeolocation,
  audioLoccus,
  searchTwitter,
  searchSemantic,
  searchCovid,
  searchXnetwork,
  dataAnalysisSna,
  dataAnalysisCrowdtangle,
  archiving,
  about,
];
