import React, { createRef, memo, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Languages from "../NavItems/languages/languages";
import Tutorial from "../NavItems/tutorial/tutorial";
import clsx from "clsx";

import {
  Alert,
  AppBar,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  Fab,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Snackbar,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  Archive,
  AudioFile,
  Audiotrack,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  Gradient,
  KeyboardArrowUp,
  ManageSearch,
  MoreHoriz,
} from "@mui/icons-material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import ScrollTop from "../Shared/ScrollTop/ScrollTop";
import { cleanError, cleanErrorNetwork } from "redux/reducers/errorReducer";
import MainContentMenuTabItems from "./MainContentMenuTabItems/MainContentMenuTabItems";
import ClassRoom from "../NavItems/ClassRoom/ClassRoom";
import Interactive from "../NavItems/Interactive/Interactive";
import About from "../NavItems/About/About";
import Assistant from "../NavItems/Assistant/Assistant";
import MySnackbar from "../MySnackbar/MySnackbar";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import { Footer, FOOTER_TYPES } from "../Shared/Footer/Footer";
import Feedback from "../Feedback/Feedback";

import AnalysisIcon from "./images/SVG/Video/Video_analysis.svg";
import KeyframesIcon from "./images/SVG/Video/Keyframes.svg";
import ThumbnailsIcon from "./images/SVG/Video/Thumbnails.svg";
import VideoRightsIcon from "./images/SVG/Video/Video_rights.svg";

import MetadataIcon from "./images/SVG/Image/Metadata.svg";
import MagnifierIcon from "./images/SVG/Image/Magnifier.svg";
import ForensicIcon from "./images/SVG/Image/Forensic.svg";
import GifIcon from "./images/SVG/Image/Gif.svg";
import OcrIcon from "./images/SVG/Image/OCR.svg";

import AnalysisIconImage from "./images/SVG/Image/Image_analysis.svg";

import TwitterSearchIcon from "./images/SVG/Search/Twitter_search.svg";
import CovidSearchIcon from "./images/SVG/Search/Covid19.svg";
import XnetworkIcon from "./images/SVG/Search/Xnetwork.svg";

import TwitterSnaIcon from "./images/SVG/DataAnalysis/Twitter_sna.svg";
import CsvSnaIcon from "./images/SVG/DataAnalysis/CSV_SNA.svg";
import DeepfakeIcon from "./images/SVG/Image/Deepfake.svg";
import GeolocationIcon from "./images/SVG/Image/Geolocation.svg";

import ToolsIcon from "./images/SVG/Navbar/Tools.svg";
import ClassroomIcon from "./images/SVG/Navbar/Classroom.svg";
import InteractiveIcon from "./images/SVG/Navbar/Interactive.svg";

import AboutIcon from "./images/SVG/Navbar/About.svg";
import AssistantIcon from "./images/SVG/Navbar/Assistant.svg";
import GuideIcon from "./images/SVG/Navbar/Guide.svg";

import LogoVera from "./images/SVG/Navbar/vera-logo_black.svg";
import LogoInVidWeverify from "./images/SVG/Navbar/invid_weverify.svg";

import LogoEuCom from "./images/SVG/Navbar/ep-logo.svg";

import VideoIcon from "./images/SVG/Video/Video.svg";
import ImageIcon from "./images/SVG/Image/Images.svg";
import SearchIcon from "./images/SVG/Search/Search.svg";
import DataIcon from "./images/SVG/DataAnalysis/Data_analysis.svg";

import { getSupportedBrowserLanguage } from "../Shared/Languages/getSupportedBrowserLanguage";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { setFalse, setTrue } from "../../redux/reducers/cookiesReducers";
import { changeLanguage } from "../../redux/reducers/languageReducer";

import { Link, useNavigate } from "react-router-dom";
import AdvancedTools from "../NavItems/tools/Alltools/AdvancedTools/AdvancedTools";

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const NavBar = () => {
  const classes = useMyStyles();
  const navigate = useNavigate();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);
  const [classWidthToolbar, setClassWidthToolbar] = useState(
    classes.drawerWidth,
  );
  const LOGO_EU = process.env.REACT_APP_LOGO_EU;
  const topMenuItemSelectedId = useSelector((state) => state.nav);

  const sideMenuItemSelectedId = useSelector((state) => state.tool.selected);
  const cookiesUsage = useSelector((state) => state.cookies);
  const currentLang = useSelector((state) => state.language);
  const defaultLanguage = useSelector((state) => state.defaultLanguage);
  const isCurrentLanguageLeftToRight = currentLang !== "ar";
  const dispatch = useDispatch();

  const drawerRef = createRef();

  // Set UI dicrection based on language reading direction
  const direction = currentLang !== "ar" ? "ltr" : "rtl";

  const handleTopMenuChange = (event, newValue) => {
    let path = sideMenuItems[newValue].path;

    if (topMenuItems[newValue].path === "tools") navigate("/app/tools/" + path);
    //history.push("/app/tools/" + path);
    else navigate("/app/" + topMenuItems[newValue].path);
    //history.push("/app/" + topMenuItems[newValue].path)
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );

  const changeValue = (newValue, newValueType) => {
    if (newValueType === "TOOL") {
      if (
        newValue.toolRestrictions !== undefined &&
        newValue.toolRestrictions.includes(TOOL_STATUS_ICON.LOCK)
      ) {
        if (userAuthenticated) {
          navigate("/app/tools/" + newValue.path);
        } else {
          setOpenAlert(true);
        }
      } else {
        if (
          newValue.path === "csvSna" ||
          newValue.path === "factcheck" ||
          newValue.path === "xnetwork"
        )
          window.open(
            process.env.REACT_APP_TSNA_SERVER +
              newValue.path +
              "?lang=" +
              currentLang,
            "_blank",
          );
        else {
          navigate("/app/tools/" + newValue.path);
        }
      }
    } else if (newValueType === "OTHER") {
      navigate("/app/" + newValue.path);
      //history.push("/app/" + newValue.path)
    }
  };

  const error = useSelector((state) => state.error.tools);
  const errorNetwork = useSelector((state) => state.error.network);
  const tWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");
  const keyword = i18nLoadNamespace("components/NavBar");

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);

    if (classWidthToolbar === classes.drawerWidth) {
      setClassWidthToolbar(classes.drawerWidthClose);
      setTimeout(function () {}, 194);
    } else {
      setClassWidthToolbar(classes.drawerWidth);
    }
  };

  const role = useSelector((state) => state.userSession.user.roles);
  const betaTester = role.includes("BETA_TESTER");

  /**
   * Represents the categories to which the tools belong
   *
   */
  const TOOLS_CATEGORIES = {
    VIDEO: keyword("navbar_category_video"),
    IMAGE: keyword("navbar_category_image"),
    AUDIO: keyword("navbar_category_audio"),
    SEARCH: keyword("navbar_category_search"),
    DATA_ANALYSIS: keyword("navbar_category_data"),
    OTHER: keyword("navbar_category_other"),

    // Used to display the home page
    ALL: keyword("navbar_category_general"),
  };

  /**
   * Represents the possible temporary states of the tools:
   * - An experimental tool is not ready for production, and available to beta testers
   * - A new tool is an experimental tool that was released to everyone
   * - A locked tool is a tool available to registered users
   * @type {{NEW: string, LOCK: string, EXPERIMENTAL: string}}
   */
  const TOOL_STATUS_ICON = {
    EXPERIMENTAL: "experimental",
    NEW: "new",
    LOCK: "lock",
  };

  /**
   * Represents the user roles that can be needed to access a given tool
   * @type {{BETA_TESTER: string, ARCHIVE: string, LOCK: string}}
   */
  const TOOL_RESTRICTIONS = {
    ARCHIVE: "ARCHIVE",
    BETA_TESTER: "BETA_TESTER",
    LOCK: "lock",
  };

  const sideMenuItems = [
    {
      id: 1,
      title: "navbar_tools",
      icon: (
        <SvgIcon
          component={ToolsIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 0
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      path: "all",
      type: TOOLS_CATEGORIES.ALL,

      icons: [],
      toolRestrictions: [],
    },

    {
      id: 2,
      title: "navbar_analysis_video",
      description: "navbar_analysis_description",
      icon: (
        <SvgIcon
          component={AnalysisIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 1
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <AnalysisIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_analysis_video")}
        />
      ),
      path: "analysis",
      type: TOOLS_CATEGORIES.VIDEO,
      icons: [],
      toolRestrictions: [],
    },
    {
      id: 3,
      title: "navbar_keyframes",
      description: "navbar_keyframes_description",
      icon: (
        <SvgIcon
          component={KeyframesIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 2
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <KeyframesIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_keyframes")}
        />
      ),

      path: "keyframes",
      type: TOOLS_CATEGORIES.VIDEO,

      icons: [],
      toolRestrictions: [],
    },
    {
      id: 4,
      title: "navbar_thumbnails",
      description: "navbar_thumbnails_description",
      icon: (
        <SvgIcon
          component={ThumbnailsIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 3
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <ThumbnailsIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_thumbnails")}
        />
      ),

      path: "thumbnails",
      type: TOOLS_CATEGORIES.VIDEO,

      icons: [],
      toolRestrictions: [],
    },
    {
      id: 5,
      title: "navbar_rights",
      description: "navbar_rights_description",
      icon: (
        <SvgIcon
          component={VideoRightsIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 4
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <VideoRightsIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_rights")}
        />
      ),

      path: "copyright",
      type: TOOLS_CATEGORIES.VIDEO,

      icons: [],
      toolRestrictions: [],
    },

    {
      id: 6,
      title: "navbar_metadata",
      description: "navbar_metadata_description",
      icon: (
        <SvgIcon
          component={MetadataIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 5
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <MetadataIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_metadata")}
        />
      ),

      path: "metadata",
      type: TOOLS_CATEGORIES.VIDEO,

      icons: [],
      toolRestrictions: [],
    },

    {
      id: 7,
      title: "navbar_deepfake_video",
      description: "navbar_deepfake_video_description",
      icon: (
        <SvgIcon
          component={DeepfakeIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 6
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <DeepfakeIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_deepfake_video")}
        />
      ),

      path: "deepfakeVideo",
      type: TOOLS_CATEGORIES.VIDEO,

      icons: [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
      toolRestrictions: [TOOL_RESTRICTIONS.BETA_TESTER],
    },

    {
      id: 8,
      title: "navbar_analysis_image",
      description: "navbar_analysis_image_description",
      icon: (
        <SvgIcon
          component={AnalysisIconImage}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 7
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),

      iconColored: (
        <AnalysisIconImage
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_analysis_image")}
        />
      ),

      path: "analysisImage",
      type: TOOLS_CATEGORIES.IMAGE,

      icons: [],
      toolRestrictions: [],
    },
    {
      id: 9,
      title: "navbar_magnifier",
      description: "navbar_magnifier_description",
      icon: (
        <SvgIcon
          component={MagnifierIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 8
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),

      iconColored: (
        <MagnifierIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_magnifier")}
        />
      ),

      path: "magnifier",
      type: TOOLS_CATEGORIES.IMAGE,

      icons: [],
      toolRestrictions: [],
    },
    {
      id: 10,
      title: "navbar_metadata",
      description: "navbar_metadata_description",
      icon: (
        <SvgIcon
          component={MetadataIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 9
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),

      iconColored: (
        <MetadataIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_metadata")}
        />
      ),

      path: "metadata_image",
      type: TOOLS_CATEGORIES.IMAGE,

      icons: [],
      toolRestrictions: [],
    },

    {
      id: 11,
      title: "navbar_forensic",
      description: "navbar_forensic_description",
      icon: (
        <SvgIcon
          component={ForensicIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 10
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <ForensicIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_forensic")}
        />
      ),

      path: "forensic",
      type: TOOLS_CATEGORIES.IMAGE,

      icons: [],
      toolRestrictions: [],
    },
    {
      id: 12,
      title: "navbar_ocr",
      description: "navbar_ocr_description",
      icon: (
        <SvgIcon
          component={OcrIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 11
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <OcrIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_ocr")}
        />
      ),

      path: "ocr",
      type: TOOLS_CATEGORIES.IMAGE,

      icons: [],
      toolRestrictions: [],
    },

    {
      id: 13,
      title: "navbar_gif",
      description: "navbar_gif_description",
      icon: (
        <SvgIcon
          component={GifIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 12
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <GifIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_gif")}
        />
      ),

      path: "gif",
      type: TOOLS_CATEGORIES.IMAGE,

      icons: [TOOL_STATUS_ICON.LOCK],
      toolRestrictions: [TOOL_RESTRICTIONS.LOCK],
    },
    {
      id: 14,
      title: "navbar_synthetic_image_detection",
      description: "navbar_synthetic_image_detection_description",
      icon: (
        <Gradient
          style={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 13
                ? "#00926c"
                : "#4c4c4c",
          }}
        />
      ),
      iconColored: <Gradient style={{ fill: "#00926c" }} />,

      path: "syntheticImageDetection",
      type: TOOLS_CATEGORIES.IMAGE,

      icons: [
        TOOL_STATUS_ICON.NEW,
        TOOL_STATUS_ICON.EXPERIMENTAL,
        TOOL_STATUS_ICON.LOCK,
      ],
      toolRestrictions: [TOOL_RESTRICTIONS.BETA_TESTER],
    },
    {
      id: 15,
      title: "navbar_deepfake_image",
      description: "navbar_deepfake_image_description",
      icon: (
        <SvgIcon
          component={DeepfakeIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 14
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <DeepfakeIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_deepfake_image")}
        />
      ),

      path: "deepfakeImage",
      type: TOOLS_CATEGORIES.IMAGE,

      icons: [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
      toolRestrictions: [TOOL_RESTRICTIONS.BETA_TESTER],
    },
    {
      id: 16,
      title: "navbar_geolocation",
      description: "navbar_geolocation_description",
      icon: (
        <SvgIcon
          component={GeolocationIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 15
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <GeolocationIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_geolocation")}
        />
      ),

      path: "geolocation",
      type: TOOLS_CATEGORIES.IMAGE,

      icons: [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
      toolRestrictions: [TOOL_RESTRICTIONS.BETA_TESTER],
    },
    {
      id: 17,
      title: "navbar_loccus",
      description: "navbar_loccus_description",
      icon: (
        <AudioFile
          style={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 16
                ? "#00926c"
                : "#4c4c4c",
          }}
          title={keyword("navbar_loccus")}
        />
      ),
      iconColored: (
        <AudioFile
          style={{ fill: "#00926c" }}
          title={keyword("navbar_loccus")}
        />
      ),

      path: "loccus",
      type: TOOLS_CATEGORIES.AUDIO,

      icons: [
        TOOL_STATUS_ICON.NEW,
        TOOL_STATUS_ICON.EXPERIMENTAL,
        TOOL_STATUS_ICON.LOCK,
      ],
      toolRestrictions: [TOOL_RESTRICTIONS.BETA_TESTER],
    },

    {
      id: 18,
      title: "navbar_twitter",
      description: "navbar_twitter_description",
      icon: (
        <SvgIcon
          component={TwitterSearchIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 17
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),

      iconColored: (
        <TwitterSearchIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_twitter")}
        />
      ),

      path: "twitter",
      type: TOOLS_CATEGORIES.SEARCH,

      icons: [],
      toolRestrictions: [],
    },
    {
      id: 19,
      title: "navbar_semantic_search",
      description: "navbar_semantic_search_description",
      icon: (
        <ManageSearch
          style={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 18
                ? "#00926c"
                : "#4c4c4c",
          }}
          title={keyword("navbar_semantic_search")}
        />
      ),
      iconColored: (
        <ManageSearch
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_semantic_search")}
        />
      ),

      path: "semanticSearch",
      type: TOOLS_CATEGORIES.SEARCH,

      icons: [
        TOOL_STATUS_ICON.EXPERIMENTAL,
        TOOL_STATUS_ICON.NEW,
        TOOL_STATUS_ICON.LOCK,
      ],
      toolRestrictions: [TOOL_RESTRICTIONS.LOCK],
    },
    {
      id: 20,
      title: "navbar_twitter_sna",
      description: "navbar_twitter_sna_description",
      icon: (
        <SvgIcon
          component={TwitterSnaIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 19
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <TwitterSnaIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_twitter_sna")}
        />
      ),

      path: "twitterSna",
      type: TOOLS_CATEGORIES.DATA_ANALYSIS,

      icons: [TOOL_STATUS_ICON.LOCK],
      toolRestrictions: [TOOL_RESTRICTIONS.LOCK],
    },
    {
      id: 21,
      title: "navbar_archiving",
      description: "navbar_archiving_description",
      icon: (
        <Archive
          style={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 20
                ? "#00926c"
                : "#4c4c4c",
          }}
        />
      ),

      iconColored: <Archive style={{ fill: "#00926c" }} />,

      path: "archive",
      type: TOOLS_CATEGORIES.OTHER,

      icons: [
        TOOL_STATUS_ICON.EXPERIMENTAL,
        TOOL_STATUS_ICON.NEW,
        TOOL_STATUS_ICON.LOCK,
      ],
      toolRestrictions: [TOOL_RESTRICTIONS.ARCHIVE],
    },
    {
      id: 22,
      title: "navbar_twitter_crowdtangle",
      description: "navbar_twitter_crowdtangle_description",
      icon: (
        <SvgIcon
          component={CsvSnaIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 21
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <CsvSnaIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_twitter_crowdtangle")}
        />
      ),

      path: "csvSna",
      type: TOOLS_CATEGORIES.DATA_ANALYSIS,

      icons: [],
      toolRestrictions: [],
    },
    {
      id: 23,
      title: "navbar_covidsearch",
      description: "navbar_covidsearch_description",
      icon: (
        <SvgIcon
          component={CovidSearchIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 22
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <CovidSearchIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_covidsearch")}
        />
      ),

      path: "factcheck",
      type: TOOLS_CATEGORIES.SEARCH,

      icons: [],
      toolRestrictions: [],
    },
    {
      id: 24,
      title: "navbar_xnetwork",
      description: "navbar_xnetwork_description",
      icon: (
        <SvgIcon
          component={XnetworkIcon}
          sx={{
            fill:
              topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 23
                ? "#00926c"
                : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      iconColored: (
        <XnetworkIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_xnetwork")}
        />
      ),

      path: "xnetwork",
      type: TOOLS_CATEGORIES.SEARCH,

      icons: [],
      toolRestrictions: [],
    },
  ];

  const topMenuItems = [
    {
      title: "navbar_tools",
      icon: (
        <SvgIcon
          component={ToolsIcon}
          sx={{
            fill: topMenuItemSelectedId === 0 ? "#00926c" : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      content: <Box />,
      path: "tools",
      footer: <Box />,
      typeTab: "verification",
      type: TOOLS_CATEGORIES.ALL,
    },
    {
      title: "navbar_assistant",
      icon: (
        <SvgIcon
          component={AssistantIcon}
          sx={{
            fill: topMenuItemSelectedId === 1 ? "#00926c" : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),

      content: <Assistant />,
      path: "assistant",
      footer: <Footer type={FOOTER_TYPES.USFD} />,
      typeTab: "verification",
      type: TOOLS_CATEGORIES.ALL,
    },
    {
      title: "navbar_tuto",
      icon: (
        <SvgIcon
          component={GuideIcon}
          sx={{
            fill: topMenuItemSelectedId === 2 ? "#00926c" : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      content: <Tutorial />,
      path: "tutorial",
      footer: <Footer type={FOOTER_TYPES.AFP} />,
      typeTab: "learning",
      type: TOOLS_CATEGORIES.ALL,
    },
    {
      title: "navbar_quiz",
      icon: (
        <SvgIcon
          component={InteractiveIcon}
          sx={{
            fill: topMenuItemSelectedId === 3 ? "#00926c" : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      content: <Interactive />,
      path: "interactive",
      footer: <Footer type={FOOTER_TYPES.AFP} />,
      typeTab: "learning",
      type: TOOLS_CATEGORIES.ALL,
    },
    {
      title: "navbar_classroom",
      icon: (
        <SvgIcon
          component={ClassroomIcon}
          sx={{
            fill: topMenuItemSelectedId === 4 ? "#00926c" : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      content: <ClassRoom />,
      path: "classroom",
      footer: <Footer type={FOOTER_TYPES.AFP} />,
      typeTab: "learning",
      type: TOOLS_CATEGORIES.ALL,
    },
    {
      title: "navbar_about",
      icon: (
        <SvgIcon
          component={AboutIcon}
          sx={{
            fill: topMenuItemSelectedId === 5 ? "#00926c" : "#4c4c4c",
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
      content: <About />,
      path: "about",
      footer: <Footer type={FOOTER_TYPES.AFP} />,
      typeTab: "more",
    },
  ];

  const handleImageClick = () => {
    navigate("/app/tools/all");
    //history.push("/app/tools/all");
  };

  useEffect(() => {
    let supportedBrowserLang = getSupportedBrowserLanguage();

    if (defaultLanguage !== null) {
      if (defaultLanguage !== currentLang) {
        dispatch(changeLanguage(defaultLanguage));
      }
    } else if (
      supportedBrowserLang !== undefined &&
      supportedBrowserLang !== currentLang
    ) {
      dispatch(changeLanguage(supportedBrowserLang));
    }
  }, []);

  useEffect(() => {
    //select tool category
    switch (sideMenuItems[sideMenuItemSelectedId].type) {
      case TOOLS_CATEGORIES.VIDEO:
        setOpenListVideo(true);
        break;
      case TOOLS_CATEGORIES.IMAGE:
        setOpenListImage(true);
        break;
      case TOOLS_CATEGORIES.AUDIO:
        setOpenListAudio(true);
        break;
      case TOOLS_CATEGORIES.SEARCH:
        setOpenListSeach(true);
        break;
      case TOOLS_CATEGORIES.DATA_ANALYSIS:
        setOpenListData(true);
        break;
      case TOOLS_CATEGORIES.OTHER:
        setOpenListOtherTools(true);
        break;
      default:
        break;
    }
  }, [sideMenuItemSelectedId]);

  const themeFab = createTheme({
    palette: {
      primary: {
        light: "#00926c",
        main: "#00926c",
        dark: "#00926c",
        contrastText: "#fff",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: "#ffffff",
          },
          root: {
            zIndex: 1300,
            height: "87px",
            boxShadow: "none",
            paddingTop: "12px",
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          gutters: {
            paddingLeft: "26px",
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          popupIndicatorOpen: {
            transform: "none!important",
          },
          popper: {
            zIndex: 99999,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "10px!important",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minWidth: "160px",
          },
        },
      },
    },
  });

  //Video items
  const drawerItemsVideo = sideMenuItems.filter(
    (item) => item.type === TOOLS_CATEGORIES.VIDEO,
  );
  const [openListVideo, setOpenListVideo] = useState(false);
  const [classBorderVideo, setClassBorderVideo] = useState(null);

  const handleClickListVideo = () => {
    setOpenListVideo(!openListVideo);
    if (!classBorderVideo) {
      setClassBorderVideo(classes.drawerCategoryBorder);
    } else {
      setClassBorderVideo(null);
    }
  };

  //Image items
  const drawerItemsImage = sideMenuItems.filter(
    (item) => item.type === TOOLS_CATEGORIES.IMAGE,
  );
  const [openListImage, setOpenListImage] = useState(false);
  const [classBorderImage, setClassBorderImage] = useState(null);

  const handleClickListImage = () => {
    setOpenListImage(!openListImage);
    if (!openListImage) {
      setClassBorderImage(classes.drawerCategoryBorder);
    } else {
      setClassBorderImage(null);
    }
  };

  //Audio items
  const drawerItemsAudio = sideMenuItems.filter(
    (item) => item.type === TOOLS_CATEGORIES.AUDIO,
  );
  const [openListAudio, setOpenListAudio] = useState(false);
  const [classBorderAudio, setClassBorderAudio] = useState(null);

  const handleClickListAudio = () => {
    setOpenListAudio(!openListAudio);
    if (!openListAudio) {
      setClassBorderAudio(classes.drawerCategoryBorder);
    } else {
      setClassBorderAudio(null);
    }
  };

  //Search items
  const drawerItemsSearch = sideMenuItems.filter(
    (item) => item.type === TOOLS_CATEGORIES.SEARCH,
  );
  const [openListSeach, setOpenListSeach] = useState(false);
  const [classBorderSearch, setClassBorderSearch] = useState(null);

  const handleClickListSearch = () => {
    setOpenListSeach(!openListSeach);
    if (!openListSeach) {
      setClassBorderSearch(classes.drawerCategoryBorder);
    } else {
      setClassBorderSearch(null);
    }
  };

  //Data items
  const drawerItemsData = sideMenuItems.filter(
    (item) => item.type === TOOLS_CATEGORIES.DATA_ANALYSIS,
  );
  const [openListData, setOpenListData] = useState(false);
  const [classBorderData, setClassBorderData] = useState(null);

  const handleClickListData = () => {
    setOpenListData(!openListData);
    if (!openListData) {
      setClassBorderData(classes.drawerCategoryBorder);
    } else {
      setClassBorderData(null);
    }
  };

  const drawerItemsOtherTools = sideMenuItems.filter(
    (item) => item.type === TOOLS_CATEGORIES.OTHER,
  );
  const [openListOtherTools, setOpenListOtherTools] = useState(false);
  const [classBorderOtherTools, setClassBorderOtherTools] = useState(null);

  const handleClickListOtherTools = () => {
    setOpenListOtherTools(!openListOtherTools);
    if (!openListOtherTools) {
      setClassBorderOtherTools(classes.drawerCategoryBorder);
    } else {
      setClassBorderOtherTools(null);
    }
  };

  let listItems = [];

  const tmpListItems = [
    {
      title: TOOLS_CATEGORIES.VIDEO,
      icon: (
        <VideoIcon
          width="24px"
          height="24px"
          style={{ fill: "#4c4c4c" }}
          title={TOOLS_CATEGORIES.VIDEO}
        />
      ),
      list: drawerItemsVideo,
      variableOpen: openListVideo,
      setVariableOpen: setOpenListVideo,
      functionHandleClick: handleClickListVideo,
      classBorder: classBorderVideo,
    },
    {
      title: TOOLS_CATEGORIES.IMAGE,
      icon: (
        <ImageIcon
          width="24px"
          height="24px"
          style={{ fill: "#4c4c4c" }}
          title={TOOLS_CATEGORIES.IMAGE}
        />
      ),
      list: drawerItemsImage,
      variableOpen: openListImage,
      setVariableOpen: setOpenListImage,
      functionHandleClick: handleClickListImage,
      classBorder: classBorderImage,
    },
    {
      title: TOOLS_CATEGORIES.AUDIO,
      icon: (
        <Audiotrack
          width="24px"
          height="24px"
          style={{ fill: "#4c4c4c" }}
          title={TOOLS_CATEGORIES.AUDIO}
        />
      ),
      list: drawerItemsAudio,
      variableOpen: openListAudio,
      setVariableOpen: setOpenListAudio,
      functionHandleClick: handleClickListAudio,
      classBorder: classBorderAudio,
    },
    {
      title: TOOLS_CATEGORIES.SEARCH,
      icon: (
        <SearchIcon
          width="24px"
          height="24px"
          style={{ fill: "#4c4c4c" }}
          title={TOOLS_CATEGORIES.SEARCH}
        />
      ),
      list: drawerItemsSearch,
      variableOpen: openListSeach,
      setVariableOpen: setOpenListSeach,
      functionHandleClick: handleClickListSearch,
      classBorder: classBorderSearch,
    },
    {
      title: TOOLS_CATEGORIES.DATA_ANALYSIS,
      icon: (
        <DataIcon
          width="24px"
          height="24px"
          style={{ fill: "#4c4c4c" }}
          title={TOOLS_CATEGORIES.DATA_ANALYSIS}
        />
      ),
      list: drawerItemsData,
      variableOpen: openListData,
      setVariableOpen: setOpenListData,
      functionHandleClick: handleClickListData,
      classBorder: classBorderData,
    },
    {
      title: TOOLS_CATEGORIES.OTHER,
      icon: <MoreHoriz style={{ fill: "#4c4c4c" }} />,
      list: drawerItemsOtherTools,
      variableOpen: openListOtherTools,
      setVariableOpen: setOpenListOtherTools,
      functionHandleClick: handleClickListOtherTools,
      classBorder: classBorderOtherTools,
    },
  ];

  tmpListItems.map((items) => {
    const listTools = items.list;
    for (let i = 0; i < listTools.length; i++) {
      if (listTools[i].toolRestrictions.length === 0) {
        listItems.push(items);
        break;
      } else if (
        listTools[i].toolRestrictions.some((restriction) =>
          role.includes(restriction),
        )
      ) {
        listItems.push(items);
        break;
      } else if (
        listTools[i].toolRestrictions.includes(TOOL_STATUS_ICON.LOCK)
      ) {
        listItems.push(items);
        break;
      }
    }
  });

  const drawItemPerRole = sideMenuItems.filter((item) => {
    if (
      item.toolRestrictions.length === 0 ||
      item.toolRestrictions.includes(TOOL_STATUS_ICON.LOCK)
    )
      return true;
    if (item.toolRestrictions.some((restriction) => role.includes(restriction)))
      return true;
  });

  const toolsItem = sideMenuItems.find((data) => data.title === "navbar_tools");
  //const assistantItem = topMenuItems.find(data => data.title === 'navbar_assistant');
  //const drawerItemsLearning = topMenuItems.filter(item => item.typeTab === "learning");
  const drawerItemsMore = topMenuItems.filter(
    (item) => item.typeTab === "more",
  );

  //const [value, setValue] = useState(null);

  return (
    <div className={classes.flex}>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        sx={{ mr: 8 }}
      >
        <Alert onClose={handleCloseAlert} severity="warning">
          {tWarning("warning_advanced_tools")}
        </Alert>
      </Snackbar>
      <ThemeProvider theme={themeFab}>
        <AppBar position="fixed" width={"100%"}>
          <Toolbar
            className={classes.toolbar}
            style={{ borderBottom: "solid 1px #dedbdb" }}
          >
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={{ sm: 1, md: 2 }}
            >
              <Grid item xs={2}>
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={{ sm: 1, md: 2 }}
                >
                  {LOGO_EU ? (
                    <LogoEuCom
                      style={{
                        height: "auto",
                        minWidth: "48px",
                        width: { sm: "48px", md: "80px" },
                      }}
                      alt="logo"
                      className={classes.logoLeft}
                      onClick={handleImageClick}
                    />
                  ) : (
                    <LogoInVidWeverify
                      style={{
                        height: "auto",
                        minWidth: "96px",
                        width: { sm: "96px", md: "96px" },
                      }}
                      alt="logo"
                      className={classes.logoLeft}
                      onClick={handleImageClick}
                    />
                  )}
                  <LogoVera
                    style={{
                      height: "auto",
                      minWidth: "48px",
                      width: { sm: "48px", md: "80px" },
                    }}
                    alt="logo"
                    className={classes.logoRight}
                    onClick={handleImageClick}
                  />
                </Stack>
              </Grid>
              <Grid item xs={7}>
                <Tabs
                  value={topMenuItemSelectedId}
                  variant="scrollable"
                  onChange={handleTopMenuChange}
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  indicatorColor="primary"
                  textColor="primary"
                  aria-label="scrollable force tabs example"
                  TabIndicatorProps={{
                    style: { display: "none" },
                  }}
                  sx={{ color: "black" }}
                >
                  {topMenuItems.map((item, index) => {
                    return (
                      <Tab
                        key={index}
                        label={keyword(item.title)}
                        icon={item.icon}
                        {...a11yProps(index)}
                        to={item.path}
                        component={Link}
                        sx={{ minWidth: "130px" }}
                      />
                    );
                  })}
                </Tabs>
              </Grid>
              <Grid item xs={2}>
                <AdvancedTools />
              </Grid>
              <Grid item xs={1}>
                <Languages />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: isSideMenuOpen,
            [classes.drawerClose]: !isSideMenuOpen,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: isSideMenuOpen,
              [classes.drawerClose]: !isSideMenuOpen,
            }),
          }}
          ref={drawerRef}
          open={isSideMenuOpen}
        >
          <List
            style={{
              marginTop: "80px",
            }}
          >
            <ListSubheader
              style={{
                paddingTop: "16px",
                paddingBottom: "16px",
                backgroundColor: "#ffffff",
                textAlign: "start",
              }}
            >
              <Typography
                style={{
                  fontWeight: "500",
                  fontSize: "10px",
                  color: "#B0B0B0",
                  textTransform: "uppercase",
                }}
              >
                {isSideMenuOpen
                  ? keyword("navbar_verification")
                  : keyword("navbar_verification_short")}
              </Typography>
            </ListSubheader>
            <ListItemButton
              selected={
                topMenuItemSelectedId === 0 && sideMenuItemSelectedId === 0
              }
              onClick={() => changeValue(toolsItem, "TOOL")}
              component={Link}
              to={"tools"}
            >
              {isSideMenuOpen ? (
                <>
                  <ListItemIcon
                    sx={{
                      marginRight: "12px",
                      minWidth: "unset",
                    }}
                  >
                    {toolsItem.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        color={
                          topMenuItemSelectedId === 0 &&
                          sideMenuItemSelectedId === 0
                            ? "primary"
                            : ""
                        }
                        className={`${
                          isSideMenuOpen
                            ? classes.drawerListText
                            : classes.hidden
                        }`}
                      >
                        {keyword(toolsItem.title)}
                      </Typography>
                    }
                  />
                </>
              ) : (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                >
                  {toolsItem.icon}
                </Stack>
              )}
            </ListItemButton>
            {listItems.map((item, key) => {
              const element = (
                <Box>
                  <ListItemButton onClick={item.functionHandleClick}>
                    {isSideMenuOpen ? (
                      <>
                        <ListItemIcon
                          sx={{
                            marginRight: "12px",
                            minWidth: "unset",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography className={classes.drawerListText}>
                              {keyword(item.title)}
                            </Typography>
                          }
                        />
                        {item.variableOpen ? <ExpandLess /> : <ExpandMore />}
                      </>
                    ) : (
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        width="100%"
                      >
                        {item.icon}
                      </Stack>
                    )}
                  </ListItemButton>

                  <Collapse in={item.variableOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.list.map((itemList, keyList) => {
                        let element = (
                          <ListItemButton
                            selected={
                              topMenuItemSelectedId === 0 &&
                              sideMenuItemSelectedId + 1 === itemList.id
                            }
                            key={keyList}
                            onClick={() => changeValue(itemList, "TOOL")}
                          >
                            {isSideMenuOpen ? (
                              <>
                                <ListItemIcon
                                  className={classes.drawerListNested}
                                  sx={{
                                    marginRight: "12px",
                                    minWidth: "unset",
                                  }}
                                >
                                  {itemList.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography
                                      color={
                                        topMenuItemSelectedId === 0 &&
                                        sideMenuItemSelectedId + 1 ===
                                          itemList.id
                                          ? "primary"
                                          : ""
                                      }
                                      className={classes.drawerListText}
                                    >
                                      {keyword(itemList.title)}
                                    </Typography>
                                  }
                                />
                              </>
                            ) : (
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                width="100%"
                              >
                                {itemList.icon}
                              </Stack>
                            )}
                          </ListItemButton>
                        );

                        if (itemList.toolRestrictions.includes("BETA_TESTER")) {
                          if (betaTester) {
                            return element;
                          } else {
                            return null;
                          }
                        } else {
                          return element;
                        }
                      })}
                    </List>
                  </Collapse>
                </Box>
              );

              return <Box key={key}>{element}</Box>;
            })}
            <Box m={2} />
            <ListSubheader
              style={{ paddingTop: "16px", paddingBottom: "16px" }}
            >
              <Typography
                style={{
                  fontWeight: "500",
                  fontSize: "10px",
                  color: "#B0B0B0",
                  textTransform: "uppercase",
                }}
              >
                {isSideMenuOpen
                  ? keyword("navbar_more")
                  : keyword("navbar_more_short")}
              </Typography>
            </ListSubheader>
            {drawerItemsMore.map((item, key) => {
              return (
                <ListItemButton
                  selected={topMenuItemSelectedId === 5}
                  key={key}
                  onClick={() => changeValue(item, "OTHER")}
                >
                  {isSideMenuOpen ? (
                    <>
                      <ListItemIcon
                        sx={{
                          marginRight: "12px",
                          minWidth: "unset",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            color={topMenuItemSelectedId === 5 ? "primary" : ""}
                            className={`${
                              isSideMenuOpen
                                ? classes.drawerListText
                                : classes.hidden
                            }`}
                          >
                            {keyword(item.title)}
                          </Typography>
                        }
                      />
                    </>
                  ) : (
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      width="100%"
                    >
                      {item.icon}
                    </Stack>
                  )}
                </ListItemButton>
              );
            })}
          </List>

          <div className={classes.grow} />

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              position: "sticky",
              bottom: "0px",
              backgroundColor: "#ffffff",
              zIndex: "9",
            }}
          >
            <Box p={1}>
              <Divider />
            </Box>

            <Button
              onClick={toggleSideMenu}
              style={{ alignSelf: "center" }}
              startIcon={
                isSideMenuOpen ? (
                  direction === "ltr" ? (
                    <ChevronLeft />
                  ) : (
                    <ChevronRight />
                  )
                ) : null
              }
            >
              {isSideMenuOpen ? (
                keyword("navbar_collapse")
              ) : direction === "ltr" ? (
                <ChevronRight />
              ) : (
                <ChevronLeft />
              )}
            </Button>

            <Box m={1} />
          </Box>
        </Drawer>

        <main className={classes.content}>
          <div className={classes.toolbar} id="back-to-top-anchor" />
          <MainContentMenuTabItems
            className={classes.noMargin}
            tabItems={topMenuItems}
            toolsList={drawItemPerRole}
          />
          <ScrollTop
            {...{ isCurrentLanguageLeftToRight: isCurrentLanguageLeftToRight }}
          >
            <ThemeProvider theme={themeFab}>
              <Fab
                color="primary"
                size="large"
                aria-label="scroll back to top"
                className={classes.fabTop}
              >
                <KeyboardArrowUp />
              </Fab>
            </ThemeProvider>
          </ScrollTop>
          {error !== null && (
            <MySnackbar
              variant="error"
              message={error}
              onClick={() => dispatch(cleanError())}
              onClose={() => {}}
              sx={{ mr: 8 }}
            />
          )}
          {errorNetwork !== null && (
            <MySnackbar
              variant="error"
              message={errorNetwork}
              onClick={() => dispatch(cleanErrorNetwork())}
              onClose={() => {}}
              sx={{ mr: 8 }}
            />
          )}
          {cookiesUsage.active === null && (
            <Snackbar
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={true}
              message={keyword("cookies_message")}
              action={[
                <Button
                  key={"cookies_decline"}
                  color={"secondary"}
                  size={"small"}
                  onClick={() => dispatch(setFalse())}
                >
                  {" "}
                  {keyword("cookies_decline")}{" "}
                </Button>,
                <Button
                  key={"cookies_accept"}
                  color={"primary"}
                  size={"small"}
                  onClick={() => dispatch(setTrue())}
                >
                  {" "}
                  {keyword("cookies_accept")}{" "}
                </Button>,
              ]}
            />
          )}
          <Feedback />
        </main>
      </ThemeProvider>
    </div>
  );
};
export default memo(NavBar);
