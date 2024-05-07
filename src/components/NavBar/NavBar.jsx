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
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";

import ArchiveIcon from "@mui/icons-material/Archive";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import ScrollTop from "../Shared/ScrollTop/ScrollTop";
import { cleanError, cleanErrorNetwork } from "redux/reducers/errorReducer";
import TabItem from "./TabItem/TabItem";
import ClassRoom from "../NavItems/ClassRoom/ClassRoom";
import Interactive from "../NavItems/Interactive/Interactive";
import About from "../NavItems/About/About";
import Assistant from "../NavItems/Assistant/Assistant";
import MySnackbar from "../MySnackbar/MySnackbar";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import Footer from "../Shared/Footer/Footer";
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
import GeolactionIcon from "./images/SVG/Image/Geolocation.svg";

import ToolsIcon from "./images/SVG/Navbar/Tools.svg";
import ClassroomIcon from "./images/SVG/Navbar/Classroom.svg";
import InteractiveIcon from "./images/SVG/Navbar/Interactive.svg";

import AboutIcon from "./images/SVG/Navbar/About.svg";
import AssistantIcon from "./images/SVG/Navbar/Assistant.svg";
import GuideIcon from "./images/SVG/Navbar/Guide.svg";

import LogoVera from "./images/SVG/Navbar/vera-logo_black.svg";
import LogoEuCom from "./images/SVG/NavBar/ep-logo.svg";

import VideoIcon from "./images/SVG/Video/Video.svg";
import ImageIcon from "./images/SVG/Image/Images.svg";
import SearchIcon from "./images/SVG/Search/Search.svg";
import DataIcon from "./images/SVG/DataAnalysis/Data_analysis.svg";

import Gradient from "@mui/icons-material/Gradient";

import { getSupportedBrowserLanguage } from "../Shared/Languages/getSupportedBrowserLanguage";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { setFalse, setTrue } from "../../redux/reducers/cookiesReducers";
import { changeLanguage } from "../../redux/reducers/languageReducer";

import { Link, useNavigate } from "react-router-dom";
import { AudioFile, Audiotrack, ManageSearch } from "@mui/icons-material";
import AdvancedTools from "../NavItems/tools/Alltools/AdvancedTools/AdvancedTools";
import Grid from "@mui/material/Grid";

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const NavBar = () => {
  const classes = useMyStyles();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [classWidthToolbar, setClassWidthToolbar] = useState(
    classes.drawerWidth,
  );

  const tabValue = useSelector((state) => state.nav);

  const drawerValue = useSelector((state) => state.tool.selected);
  const cookiesUsage = useSelector((state) => state.cookies);
  const currentLang = useSelector((state) => state.language);
  const defaultLanguage = useSelector((state) => state.defaultLanguage);
  const isCurrentLanguageLeftToRight = currentLang !== "ar";
  const dispatch = useDispatch();

  const drawerRef = createRef();

  const handleChange = (event, newValue) => {
    let path = drawerItems[newValue].path;
    if (tabItems[newValue].path === "tools") navigate("/app/tools/" + path);
    //history.push("/app/tools/" + path);
    else navigate("/app/" + tabItems[newValue].path);
    //history.push("/app/" + tabItems[newValue].path)
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
        newValue.toolRestrictions.includes("lock")
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

  const [classListHeading, setClassListHeading] = useState(
    classes.drawerListHeadingLeft,
  );

  const handleDrawerToggle = () => {
    setOpen(!open);

    if (classWidthToolbar === classes.drawerWidth) {
      setClassWidthToolbar(classes.drawerWidthClose);
      setTimeout(function () {
        setClassListHeading(classes.drawerListHeadingCenter);
      }, 194);
    } else {
      setClassWidthToolbar(classes.drawerWidth);
      setClassListHeading(classes.drawerListHeadingLeft);
    }
  };

  const role = useSelector((state) => state.userSession.user.roles);
  const betaTester = role.includes("BETA_TESTER");

  //console.log("Role", role);
  //console.log("Beta", betaTester);

  const drawerItems = [
    {
      id: 1,
      title: "navbar_tools",
      icon:
        tabValue === 0 && drawerValue === 0 ? (
          <ToolsIcon
            width="40px"
            height="40px"
            style={{ fill: "#00926c" }}
            title={keyword("navbar_tools")}
          />
        ) : (
          <ToolsIcon
            width="40px"
            height="40px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_tools")}
          />
        ),
      tsvPrefix: "all",
      path: "all",
      pathGroup: "TOOL",
      type: keyword("navbar_category_general"),
      typeId: 0,
      icons: [],
      toolRestrictions: [],
    },

    {
      id: 2,
      title: "navbar_analysis_video",
      description: "navbar_analysis_description",
      icon:
        tabValue === 0 && drawerValue === 1 ? (
          <AnalysisIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Video analysis"
          />
        ) : (
          <AnalysisIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_analysis_video")}
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
      tsvPrefix: "api",
      path: "analysis",
      pathGroup: "TOOL",
      type: keyword("navbar_category_video"),
      typeId: 1,
      icons: [],
      toolRestrictions: [],
    },
    {
      id: 3,
      title: "navbar_keyframes",
      description: "navbar_keyframes_description",
      icon:
        tabValue === 0 && drawerValue === 2 ? (
          <KeyframesIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Keyframes"
          />
        ) : (
          <KeyframesIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_keyframes")}
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
      tsvPrefix: "keyframes",
      path: "keyframes",
      pathGroup: "TOOL",
      type: keyword("navbar_category_video"),
      typeId: 1,
      icons: [],
      toolRestrictions: [],
    },
    {
      id: 4,
      title: "navbar_thumbnails",
      description: "navbar_thumbnails_description",
      icon:
        tabValue === 0 && drawerValue === 3 ? (
          <ThumbnailsIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Thumbnails"
          />
        ) : (
          <ThumbnailsIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_thumbnails")}
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
      tsvPrefix: "thumbnails",
      path: "thumbnails",
      pathGroup: "TOOL",
      type: keyword("navbar_category_video"),
      typeId: 1,
      icons: [],
      toolRestrictions: [],
    },
    {
      id: 5,
      title: "navbar_rights",
      description: "navbar_rights_description",
      icon:
        tabValue === 0 && drawerValue === 4 ? (
          <VideoRightsIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Video rights"
          />
        ) : (
          <VideoRightsIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_rights")}
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
      tsvPrefix: "copyright",
      path: "copyright",
      pathGroup: "TOOL",
      type: keyword("navbar_category_video"),
      typeId: 1,
      icons: [],
      toolRestrictions: [],
    },

    {
      id: 6,
      title: "navbar_metadata",
      description: "navbar_metadata_description",
      icon:
        tabValue === 0 && drawerValue === 5 ? (
          <MetadataIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Metadata"
          />
        ) : (
          <MetadataIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_metadata")}
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
      tsvPrefix: "metadata",
      path: "metadata",
      pathGroup: "TOOL",
      type: keyword("navbar_category_video"),
      typeId: 1,
      icons: [],
      toolRestrictions: [],
    },

    {
      id: 7,
      title: "navbar_deepfake_video",
      description: "navbar_deepfake_video_description",
      icon:
        tabValue === 0 && drawerValue === 6 ? (
          <DeepfakeIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Twitter SNA"
          />
        ) : (
          <DeepfakeIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_deepfake_video")}
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
      tsvPrefix: "deepfake",
      path: "deepfakeVideo",
      pathGroup: "TOOL",
      type: keyword("navbar_category_video"),
      typeId: 1,
      icons: ["experimental", "lock"],
      toolRestrictions: ["BETA_TESTER"],
    },

    {
      id: 8,
      title: "navbar_analysis_image",
      description: "navbar_analysis_image_description",
      icon:
        tabValue === 0 && drawerValue === 7 ? (
          <AnalysisIconImage
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Image analysis"
          />
        ) : (
          <AnalysisIconImage
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_analysis_image")}
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
      tsvPrefix: "api",
      path: "analysisImage",
      pathGroup: "TOOL",
      type: keyword("navbar_category_image"),
      typeId: 2,
      icons: [],
      toolRestrictions: [],
    },
    {
      id: 9,
      title: "navbar_magnifier",
      description: "navbar_magnifier_description",
      icon:
        tabValue === 0 && drawerValue === 8 ? (
          <MagnifierIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Magnifier"
          />
        ) : (
          <MagnifierIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_magnifier")}
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
      tsvPrefix: "magnifier",
      path: "magnifier",
      pathGroup: "TOOL",
      type: keyword("navbar_category_image"),
      typeId: 2,
      icons: [],
      toolRestrictions: [],
    },
    {
      id: 10,
      title: "navbar_metadata",
      description: "navbar_metadata_description",
      icon:
        tabValue === 0 && drawerValue === 9 ? (
          <MetadataIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Metadata"
          />
        ) : (
          <MetadataIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_metadata")}
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
      tsvPrefix: "metadata",
      path: "metadata_image",
      pathGroup: "TOOL",
      type: keyword("navbar_category_image"),
      typeId: 2,
      icons: [],
      toolRestrictions: [],
    },

    {
      id: 11,
      title: "navbar_forensic",
      description: "navbar_forensic_description",
      icon:
        tabValue === 0 && drawerValue === 10 ? (
          <ForensicIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Forensic"
          />
        ) : (
          <ForensicIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_forensic")}
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
      tsvPrefix: "forensic",
      path: "forensic",
      pathGroup: "TOOL",
      type: keyword("navbar_category_image"),
      typeId: 2,
      icons: [],
      toolRestrictions: [],
    },
    {
      id: 12,
      title: "navbar_ocr",
      description: "navbar_ocr_description",
      icon:
        tabValue === 0 && drawerValue === 11 ? (
          <OcrIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="OCR"
          />
        ) : (
          <OcrIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_ocr")}
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
      tsvPrefix: "ocr",
      path: "ocr",
      pathGroup: "TOOL",
      type: keyword("navbar_category_image"),
      typeId: 2,
      icons: [],
      toolRestrictions: [],
    },

    {
      id: 13,
      title: "navbar_gif",
      description: "navbar_gif_description",
      icon:
        tabValue === 0 && drawerValue === 12 ? (
          <GifIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="CheckGIF"
          />
        ) : (
          <GifIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_gif")}
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
      tsvPrefix: "gif",
      path: "gif",
      pathGroup: "TOOL",
      type: keyword("navbar_category_image"),
      typeId: 2,
      icons: ["lock"],
      toolRestrictions: ["lock"],
    },
    {
      id: 14,
      title: "navbar_synthetic_image_detection",
      description: "navbar_synthetic_image_detection_description",
      icon:
        tabValue === 0 && drawerValue === 13 ? (
          <Gradient width="45px" height="45px" style={{ fill: "#00926c" }} />
        ) : (
          <Gradient width="45px" height="45px" style={{ fill: "#4c4c4c" }} />
        ),
      iconColored: (
        <Gradient width="45px" height="45px" style={{ fill: "#00926c" }} />
      ),
      tsvPrefix: "synthetic_image_detection",
      path: "syntheticImageDetection",
      pathGroup: "TOOL",
      type: keyword("navbar_category_image"),
      typeId: 2,
      icons: ["new", "experimental", "lock"],
      toolRestrictions: ["BETA_TESTER"],
    },
    {
      id: 15,
      title: "navbar_deepfake_image",
      description: "navbar_deepfake_image_description",
      icon:
        tabValue === 0 && drawerValue === 14 ? (
          <DeepfakeIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Twitter SNA"
          />
        ) : (
          <DeepfakeIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_deepfake_image")}
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
      tsvPrefix: "deepfake",
      path: "deepfakeImage",
      pathGroup: "TOOL",
      type: keyword("navbar_category_image"),
      typeId: 2,
      icons: ["experimental", "lock"],
      toolRestrictions: ["BETA_TESTER"],
    },
    {
      id: 16,
      title: "navbar_geolocation",
      description: "navbar_geolocation_description",
      icon:
        tabValue === 0 && drawerValue === 15 ? (
          <GeolactionIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Twitter SNA"
          />
        ) : (
          <GeolactionIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_geolocation")}
          />
        ),
      iconColored: (
        <GeolactionIcon
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_geolocation")}
        />
      ),
      tsvPrefix: "geolocation",
      path: "geolocation",
      pathGroup: "TOOL",
      type: keyword("navbar_category_image"),
      typeId: 2,
      icons: ["experimental", "lock"],
      toolRestrictions: ["BETA_TESTER"],
    },
    {
      id: 17,
      title: "navbar_loccus",
      description: "navbar_loccus_description",
      icon:
        tabValue === 0 && drawerValue === 16 ? (
          <AudioFile
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Loccus"
          />
        ) : (
          <AudioFile
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_loccus")}
          />
        ),
      iconColored: (
        <AudioFile
          width="45px"
          height="45px"
          style={{ fill: "#00926c" }}
          title={keyword("navbar_loccus")}
        />
      ),
      tsvPrefix: "loccus_detection",
      path: "loccus",
      pathGroup: "TOOL",
      type: keyword("navbar_category_audio"),
      typeId: 3,
      icons: ["new", "experimental", "lock"],
      toolRestrictions: ["BETA_TESTER"],
    },

    {
      id: 18,
      title: "navbar_twitter",
      description: "navbar_twitter_description",
      icon:
        tabValue === 0 && drawerValue === 17 ? (
          <TwitterSearchIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Twitter search"
          />
        ) : (
          <TwitterSearchIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_twitter")}
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
      tsvPrefix: "twitter",
      path: "twitter",
      pathGroup: "TOOL",
      type: keyword("navbar_category_search"),
      typeId: 4,
      icons: [],
      toolRestrictions: [],
    },
    {
      id: 19,
      title: "navbar_semantic_search",
      description: "navbar_semantic_search_description",
      icon:
        tabValue === 0 && drawerValue === 18 ? (
          <ManageSearch
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title={keyword("navbar_semantic_search")}
          />
        ) : (
          <ManageSearch
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
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
      tsvPrefix: "semantic_search",
      path: "semanticSearch",
      pathGroup: "TOOL",
      type: keyword("navbar_category_search"),
      typeId: 4,
      icons: ["experimental", "new", "lock"],
      toolRestrictions: ["lock"],
    },
    {
      id: 20,
      title: "navbar_twitter_sna",
      description: "navbar_twitter_sna_description",
      icon:
        tabValue === 0 && drawerValue === 19 ? (
          <TwitterSnaIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Twitter SNA"
          />
        ) : (
          <TwitterSnaIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_twitter_sna")}
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
      tsvPrefix: "twitter_sna",
      path: "twitterSna",
      pathGroup: "TOOL",
      type: keyword("navbar_category_data"),
      typeId: 5,
      icons: ["lock"],
      toolRestrictions: ["lock"],
    },
    {
      id: 21,
      title: "navbar_archiving",
      description: "navbar_archiving_description",
      icon:
        tabValue === 0 && drawerValue === 20 ? (
          <ArchiveIcon width="45px" height="45px" style={{ fill: "#00926c" }} />
        ) : (
          <ArchiveIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />
        ),
      iconColored: (
        <ArchiveIcon width="45px" height="45px" style={{ fill: "#00926c" }} />
      ),
      tsvPrefix: "archiving",
      path: "archive",
      pathGroup: "TOOL",
      type: keyword("navbar_category_other"),
      typeId: 6,
      icons: ["experimental", "new", "lock"],
      toolRestrictions: ["ARCHIVE"],
    },
    {
      id: 22,
      title: "navbar_twitter_crowdtangle",
      description: "navbar_twitter_crowdtangle_description",
      icon:
        tabValue === 0 && drawerValue === 21 ? (
          <CsvSnaIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Twitter SNA"
          />
        ) : (
          <CsvSnaIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_twitter_crowdtangle")}
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
      tsvPrefix: "twitter_crowdtangle",
      path: "csvSna",
      pathGroup: "TOOL",
      type: keyword("navbar_category_data"),
      typeId: 5,
      icons: [],
      toolRestrictions: [],
    },
    {
      id: 23,
      title: "navbar_covidsearch",
      description: "navbar_covidsearch_description",
      icon:
        tabValue === 0 && drawerValue === 22 ? (
          <CovidSearchIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Covid search"
          />
        ) : (
          <CovidSearchIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_covidsearch")}
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
      tsvPrefix: "covidsearch",
      path: "factcheck",
      pathGroup: "TOOL",
      type: keyword("navbar_category_search"),
      typeId: 4,
      icons: [],
      toolRestrictions: [],
    },
    {
      id: 24,
      title: "navbar_xnetwork",
      description: "navbar_xnetwork_description",
      icon:
        tabValue === 0 && drawerValue === 23 ? (
          <XnetworkIcon
            width="45px"
            height="45px"
            style={{ fill: "#00926c" }}
            title="Xnetwork"
          />
        ) : (
          <XnetworkIcon
            width="45px"
            height="45px"
            style={{ fill: "#4c4c4c" }}
            title={keyword("navbar_xnetwork")}
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
      tsvPrefix: "xnetwork",
      path: "xnetwork",
      pathGroup: "TOOL",
      type: keyword("navbar_category_search"),
      typeId: 4,
      icons: [],
      toolRestrictions: [],
    },
  ];

  const tabItems = [
    {
      title: "navbar_tools",
      icon:
        tabValue === 0 && drawerValue === 0 ? (
          <ToolsIcon width="30px" height="30px" style={{ fill: "#00926c" }} />
        ) : (
          <ToolsIcon width="30px" height="30px" style={{ fill: "#4c4c4c" }} />
        ),
      content: <div />,
      path: "tools",
      pathGroup: "OTHER",
      footer: <div />,
      typeTab: "verification",
      type: keyword("navbar_category_general"),
      typeId: 0,
    },
    {
      title: "navbar_assistant",
      icon:
        tabValue === 1 ? (
          <AssistantIcon
            width="30px"
            height="30px"
            style={{ fill: "#00926c" }}
          />
        ) : (
          <AssistantIcon
            width="30px"
            height="30px"
            style={{ fill: "#4c4c4c" }}
          />
        ),
      content: <Assistant />,
      path: "assistant",
      pathGroup: "OTHER",
      footer: <Footer type={"usfd"} />,
      typeTab: "verification",
      type: keyword("navbar_category_general"),
      typeId: 0,
    },
    {
      title: "navbar_tuto",
      icon:
        tabValue === 2 ? (
          <GuideIcon width="30px" height="30px" style={{ fill: "#00926c" }} />
        ) : (
          <GuideIcon width="30px" height="30px" style={{ fill: "#4c4c4c" }} />
        ),
      content: <Tutorial />,
      path: "tutorial",
      pathGroup: "OTHER",
      footer: <Footer type={"afp"} />,
      typeTab: "learning",
      type: keyword("navbar_category_general"),
      typeId: 0,
    },
    {
      title: "navbar_quiz",
      icon:
        tabValue === 3 ? (
          <InteractiveIcon
            width="30px"
            height="30px"
            style={{ fill: "#00926c" }}
          />
        ) : (
          <InteractiveIcon
            width="30px"
            height="30px"
            style={{ fill: "#4c4c4c" }}
          />
        ),
      content: <Interactive />,
      path: "interactive",
      pathGroup: "OTHER",
      footer: <Footer type={"afp"} />,
      typeTab: "learning",
      type: keyword("navbar_category_general"),
      typeId: 0,
    },
    {
      title: "navbar_classroom",
      icon:
        tabValue === 4 ? (
          <ClassroomIcon
            width="30px"
            height="30px"
            style={{ fill: "#00926c" }}
          />
        ) : (
          <ClassroomIcon
            width="30px"
            height="30px"
            style={{ fill: "#4c4c4c" }}
          />
        ),
      content: <ClassRoom />,
      path: "classroom",
      pathGroup: "OTHER",
      footer: <Footer type={"afp"} />,
      typeTab: "learning",
      type: keyword("navbar_category_general"),
      typeId: 0,
    },
    {
      title: "navbar_about",
      icon:
        tabValue === 5 ? (
          <AboutIcon width="30px" height="30px" style={{ fill: "#00926c" }} />
        ) : (
          <AboutIcon width="30px" height="30px" style={{ fill: "#4c4c4c" }} />
        ),
      content: <About />,
      path: "about",
      pathGroup: "OTHER",
      footer: <Footer type={"afp"} />,
      typeTab: "more",
      typeId: 0,
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
    switch (drawerItems[drawerValue].typeId) {
      case 1:
        setOpenListVideo(true);
        break;
      case 2:
        setOpenListImage(true);
        break;
      case 3:
        setOpenListAudio(true);
        break;
      case 4:
        setOpenListSeach(true);
        break;
      case 5:
        setOpenListData(true);
        break;
      case 6:
        setOpenListOtherTools(true);
        break;
      default:
        break;
    }
  }, [drawerValue]);

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
  const drawerItemsVideo = drawerItems.filter(
    (item) => item.type === keyword("navbar_category_video"),
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
  const drawerItemsImage = drawerItems.filter(
    (item) => item.type === keyword("navbar_category_image"),
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
  const drawerItemsAudio = drawerItems.filter(
    (item) => item.type === keyword("navbar_category_audio"),
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
  const drawerItemsSearch = drawerItems.filter(
    (item) => item.type === keyword("navbar_category_search"),
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
  const drawerItemsData = drawerItems.filter(
    (item) => item.type === keyword("navbar_category_data"),
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

  const drawerItemsOtherTools = drawerItems.filter(
    (item) => item.type === keyword("navbar_category_other"),
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
      title: keyword("navbar_category_video"),
      icon: (
        <VideoIcon
          style={{ fill: "#4c4c4c" }}
          title={keyword("navbar_category_video")}
        />
      ),
      list: drawerItemsVideo,
      variableOpen: openListVideo,
      setVariableOpen: setOpenListVideo,
      functionHandleClick: handleClickListVideo,
      classBorder: classBorderVideo,
    },
    {
      title: keyword("navbar_category_image"),
      icon: (
        <ImageIcon
          style={{ fill: "#4c4c4c" }}
          title={keyword("navbar_category_image")}
        />
      ),
      list: drawerItemsImage,
      variableOpen: openListImage,
      setVariableOpen: setOpenListImage,
      functionHandleClick: handleClickListImage,
      classBorder: classBorderImage,
    },
    {
      title: keyword("navbar_category_audio"),
      icon: (
        <Audiotrack
          style={{ fill: "#4c4c4c" }}
          title={keyword("navbar_category_audio")}
        />
      ),
      list: drawerItemsAudio,
      variableOpen: openListAudio,
      setVariableOpen: setOpenListAudio,
      functionHandleClick: handleClickListAudio,
      classBorder: classBorderAudio,
    },
    {
      title: keyword("navbar_category_search"),
      icon: (
        <SearchIcon
          style={{ fill: "#4c4c4c" }}
          title={keyword("navbar_category_search")}
        />
      ),
      list: drawerItemsSearch,
      variableOpen: openListSeach,
      setVariableOpen: setOpenListSeach,
      functionHandleClick: handleClickListSearch,
      classBorder: classBorderSearch,
    },
    {
      title: keyword("navbar_category_data"),
      icon: (
        <DataIcon
          style={{ fill: "#4c4c4c" }}
          title={keyword("navbar_category_data")}
        />
      ),
      list: drawerItemsData,
      variableOpen: openListData,
      setVariableOpen: setOpenListData,
      functionHandleClick: handleClickListData,
      classBorder: classBorderData,
    },
    {
      title: keyword("navbar_category_other"),
      icon: <MoreHorizIcon style={{ fill: "#4c4c4c" }} />,
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
      } else if (listTools[i].toolRestrictions.includes("lock")) {
        listItems.push(items);
        break;
      }
    }
  });

  const drawItemPerRole = drawerItems.filter((item) => {
    if (
      item.toolRestrictions.length === 0 ||
      item.toolRestrictions.includes("lock")
    )
      return true;
    if (item.toolRestrictions.some((restriction) => role.includes(restriction)))
      return true;
  });

  const toolsItem = drawerItems.find((data) => data.title === "navbar_tools");
  //const assistantItem = tabItems.find(data => data.title === 'navbar_assistant');
  //const drawerItemsLearning = tabItems.filter(item => item.typeTab === "learning");
  const drawerItemsMore = tabItems.filter((item) => item.typeTab === "more");

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
                  value={tabValue}
                  variant="scrollable"
                  onChange={handleChange}
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
                  {tabItems.map((item, index) => {
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
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
          ref={drawerRef}
          open={open}
        >
          <List
            style={{
              marginTop: "80px",
              paddingLeft: "4px",
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
                {open
                  ? keyword("navbar_verification")
                  : keyword("navbar_verification_short")}
              </Typography>
            </ListSubheader>
            <ListItem
              button
              onClick={() => changeValue(toolsItem, "TOOL")}
              component={Link}
              to={"tools"}
            >
              <ListItemIcon
                color="primary.main"
                sx={{
                  marginRight: "12px",
                  minWidth: "unset",
                }}
              >
                {
                  <IconButton
                    className={classes.customAllToolsButton}
                    sx={{ width: 24, height: 24 }}
                  >
                    {toolsItem.icon}
                  </IconButton>
                }
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    className={`${
                      open ? classes.drawerListText : classes.hidden
                    }`}
                  >
                    {keyword(toolsItem.title)}
                  </Typography>
                }
              />
            </ListItem>
            {listItems.map((item, key) => {
              const element = (
                <div style={{ margin: "-5px -15px -5px -15px" }}>
                  <ListItem button onClick={item.functionHandleClick}>
                    <ListItemIcon
                      color="primary.main"
                      sx={{
                        marginRight: "12px",
                        minWidth: "unset",
                      }}
                    >
                      <IconButton
                        className={classes.customAllToolsButton}
                        style={{ width: 24, height: 24 }}
                      >
                        {item.icon}
                      </IconButton>
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Typography
                          className={`${
                            open ? classes.drawerListText : classes.hidden
                          }`}
                        >
                          {item.title}
                        </Typography>
                      }
                    />

                    {open ? (
                      item.variableOpen ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    ) : null}
                  </ListItem>

                  <Collapse in={item.variableOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.list.map((itemList, keyList) => {
                        var element = (
                          <ListItem
                            button
                            key={keyList}
                            onClick={() => changeValue(itemList, "TOOL")}
                          >
                            {open ? (
                              <ListItemIcon
                                color="primary.main"
                                className={classes.drawerListNested}
                                sx={{
                                  marginRight: "12px",
                                  minWidth: "unset",
                                }}
                              >
                                {
                                  <IconButton
                                    className={classes.customAllToolsButton}
                                    style={{ width: 24, height: 24 }}
                                  >
                                    {itemList.icon}
                                  </IconButton>
                                }
                              </ListItemIcon>
                            ) : (
                              <ListItemIcon
                                color="primary.main"
                                sx={{
                                  marginRight: "12px",
                                  minWidth: "unset",
                                }}
                              >
                                {
                                  <IconButton
                                    className={classes.customAllToolsButton}
                                    style={{ width: 24, height: 24 }}
                                  >
                                    {itemList.icon}
                                  </IconButton>
                                }
                              </ListItemIcon>
                            )}
                            <ListItemText
                              primary={
                                <Typography
                                  className={`${
                                    open
                                      ? classes.drawerListText
                                      : classes.hidden
                                  }`}
                                >
                                  {keyword(itemList.title)}
                                </Typography>
                              }
                            />
                          </ListItem>
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
                </div>
              );

              return (
                <div key={key}>
                  {open ? (
                    <div
                      style={{
                        margin: "5px 18px 5px 14px",
                        borderRadius: "10px",
                      }}
                    >
                      {element}
                    </div>
                  ) : (
                    <div
                      style={{
                        margin: "14px 18px 14px 14px",
                        borderRadius: "10px",
                      }}
                      className={item.classBorder}
                    >
                      {element}
                    </div>
                  )}
                </div>
              );
            })}
            <Box m={2} />
            <ListSubheader
              style={{ paddingTop: "16px", paddingBottom: "16px" }}
              className={classListHeading}
            >
              <Typography
                style={{
                  fontWeight: "500",
                  fontSize: "10px",
                  color: "#B0B0B0",
                  textTransform: "uppercase",
                }}
              >
                {open ? keyword("navbar_more") : keyword("navbar_more_short")}
              </Typography>
            </ListSubheader>
            {drawerItemsMore.map((item, key) => {
              return (
                <ListItem
                  button
                  key={key}
                  onClick={() => changeValue(item, "OTHER")}
                >
                  <ListItemIcon
                    color="primary.main"
                    sx={{
                      marginRight: "12px",
                      minWidth: "unset",
                    }}
                  >
                    {
                      <IconButton
                        className={classes.customAllToolsButton}
                        style={{ width: 24, height: 24 }}
                      >
                        {item.icon}
                      </IconButton>
                    }
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        className={`${
                          open ? classes.drawerListText : classes.hidden
                        }`}
                      >
                        {keyword(item.title)}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>

          <div className={classes.grow} />

          <div
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
              onClick={handleDrawerToggle}
              style={{ alignSelf: "center" }}
              startIcon={!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            >
              {open ? keyword("navbar_collapse") : ""}
            </Button>
            <Box m={1} />
          </div>
        </Drawer>

        <main className={classes.content}>
          <div className={classes.toolbar} id="back-to-top-anchor" />
          <TabItem
            className={classes.noMargin}
            tabItems={tabItems}
            drawerItems={drawItemPerRole}
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
                <KeyboardArrowUpIcon />
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
