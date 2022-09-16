
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from "react-redux";
import Languages from "../NavItems/languages/languages";
//import Tutorial from "../NavItems/tutorial/tutorial";
import React, { useEffect, memo, useState, createRef } from 'react';
import clsx from 'clsx';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ScrollTop from "../Shared/ScrollTop/ScrollTop";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import history from '../Shared/History/History';
import { cleanError } from "../../redux/actions/errorActions";
import TabItem from "./TabItem/TabItem";
import ClassRoom from "../NavItems/ClassRoom/ClassRoom";
//import Interactive from "../NavItems/Interactive/Interactive";
import About from "../NavItems/About/About";
import Assistant from "../NavItems/Assistant/Assistant";
import MySnackbar from "../MySnackbar/MySnackbar";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import Footer from "../Shared/Footer/Footer";
import FeedBack from "../FeedBack/FeedBack";

import AnalysisIcon  from "./images/SVG/Video/Video_analysis.svg"
import KeyframesIcon  from "./images/SVG/Video/Keyframes.svg"
import ThumbnailsIcon  from "./images/SVG/Video/Thumbnails.svg"
import VideoRightsIcon  from "./images/SVG/Video/Video_rights.svg"

import MetadataIcon from "./images/SVG/Image/Metadata.svg"
import MagnifierIcon from "./images/SVG/Image/Magnifier.svg"
import ForensicIcon from "./images/SVG/Image/Forensic.svg"
import GifIcon from "./images/SVG/Image/Gif.svg"
import OcrIcon from "./images/SVG/Image/OCR.svg"

import AnalysisIconImage from "./images/SVG/Image/Image_analysis.svg"

import TwitterSearchIcon from "./images/SVG/Search/Twitter_search.svg"
import CovidSearchIcon from "./images/SVG/Search/Covid19.svg"
import XnetworkIcon from "./images/SVG/Search/Xnetwork.svg"

import TwitterSnaIcon from "./images/SVG/DataAnalysis/Twitter_sna.svg"
import CsvSnaIcon from "./images/SVG/DataAnalysis/CSV_SNA.svg"
import DeepfakeIcon from "./images/SVG/Image/Deepfake.svg"
import GeolactionIcon from "./images/SVG/Image/Geolocation.svg"

import ToolsIcon from "./images/SVG/Navbar/Tools.svg"
import ClassroomIcon  from "./images/SVG/Navbar/Classroom.svg"
import InteractiveIcon  from "./images/SVG/Navbar/Interactive.svg"

import AboutIcon from "./images/SVG/Navbar/About.svg"
import AssistantIcon  from "./images/SVG/Navbar/Assistant.svg"
import GuideIcon  from "./images/SVG/Navbar/Guide.svg"

import LogoInvid2  from "./images/SVG/Navbar/InVID.svg"
import LogoWeVerify2  from "./images/SVG/Navbar/WeVerify.svg"

import VideoIcon from "./images/SVG/Video/Video.svg"
import ImageIcon  from "./images/SVG/Image/Images.svg"
import SearchIcon  from "./images/SVG/Search/Search.svg"
import DataIcon from "./images/SVG/DataAnalysis/Data_analysis.svg"

import { getSupportedBrowserLanguage } from "../Shared/Languages/getSupportedBrowserLanguage";
import useLoadLanguage from "../../Hooks/useLoadLanguage";
import tsv from "../../LocalDictionary/components/NavBar.tsv";
import tsvWarning from "../../LocalDictionary/components/Shared/OnWarningInfo.tsv";
import Snackbar from "@mui/material/Snackbar";
import { setFalse, setTrue } from "../../redux/actions/cookiesActions";
import { changeLanguage } from "../../redux/actions";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { Collapse, ListSubheader, Tab, Tabs } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Link, useLocation} from 'react-router-dom'

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}


const NavBar = (props) => {
    const classes = useMyStyles();
    const [open, setOpen] = useState(true);
    const [classWidthToolbar, setClassWidthToolbar] = useState(classes.drawerWidth);

    const tabValue = useSelector(state => state.nav);
    
    const drawerValue = useSelector(state => state.tool.selected);
    const cookiesUsage = useSelector(state => state.cookies);
    const currentLang = useSelector(state => state.language);
    const defaultLanguage = useSelector(state => state.defaultLanguage);

    const dispatch = useDispatch();

    const drawerRef = createRef();

    

    const handleChange = (event, newValue) => {
        let path = drawerItems[newValue].path;
        if (tabItems[newValue].path === "tools")
            history.push("/app/tools/" + path);
        else
            history.push("/app/" + tabItems[newValue].path)
    };

    

    const [openAlert, setOpenAlert] = useState(false);

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    const userAuthenticated = useSelector(
        (state) => state.userSession && state.userSession.userAuthenticated
    );
    
    const changeValue = (newValue, newValueType, mediaTool) => {
        
        if (newValueType === "TOOL"){

            if (newValue.toolRestrictions !== undefined && newValue.toolRestrictions.includes("lock")) {
                if (userAuthenticated) {
                    history.push({
                        pathname: "/app/tools/" + newValue.path,
                        state: { media: mediaTool }
                    })
                } else {
                    setOpenAlert(true);
                }
            } else {
                if(newValue.title === "navbar_twitter_crowdtangle")
                    window.open(process.env.REACT_APP_TSNA_SERVER + "csvSna?lang="+currentLang, "_blank");
                else if (newValue.path === "factcheck" || newValue.path === "xnetwork")
                    window.open(process.env.REACT_APP_TSNA_SERVER + newValue.path + "?lang="+currentLang, "_blank") 
                else{
                    history.push({
                        pathname: "/app/tools/" + newValue.path,
                        state: { media: mediaTool }
                    })
                }
            }

        } else if (newValueType === "OTHER"){
            history.push("/app/" + newValue.path) 

        }

    };

    const error = useSelector(state => state.error);
    const keyword = useLoadLanguage("components/NavBar.tsv", tsv);
    const keywordWarning = useLoadLanguage("components/Shared/OnWarningInfo.tsv", tsvWarning);


    const [classListHeading, setClassListHeading] = useState(classes.drawerListHeadingLeft);

    const handleDrawerToggle = () => {
        setOpen(!open);

        if (classWidthToolbar === classes.drawerWidth){
            setClassWidthToolbar(classes.drawerWidthClose);
            setTimeout(function () {
                setClassListHeading(classes.drawerListHeadingCenter);
            }, 194);
            
        }else{
            setClassWidthToolbar(classes.drawerWidth);
            setClassListHeading(classes.drawerListHeadingLeft);
            
        }

    };


    const role = useSelector((state) => state.userSession.user.roles);
    const betaTester = role.includes('BETA_TESTER')

    //console.log("Role", role);
    //console.log("Beta", betaTester);

    const drawerItems = [
        {
            id: 1,
            title: "navbar_tools",
            icon: (tabValue === 0 && drawerValue === 0) ? <ToolsIcon width="40px" height="40px" style={{ fill: "#51A5B2" }} title={keyword("navbar_tools")}/>
                : <ToolsIcon width="40px" height="40px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_tools")}/>,
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
            icon: (drawerValue === 1) ? <AnalysisIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Video analysis"/>
                : <AnalysisIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_analysis_video")}/>,
            iconColored: <AnalysisIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_analysis_video")}/>,
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
            icon: (drawerValue === 2) ? <KeyframesIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Keyframes"/>
                : <KeyframesIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_keyframes")}/>,
            iconColored: <KeyframesIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_keyframes")}/>,
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
            icon: (drawerValue === 3) ? <ThumbnailsIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Thumbnails"/>
                : <ThumbnailsIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_thumbnails")}/>,
            iconColored: <ThumbnailsIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_thumbnails")}/>,
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
            icon: (drawerValue === 4) ? <VideoRightsIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Video rights" />
                : <VideoRightsIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_rights")} />,
            iconColored: <VideoRightsIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_rights")} />,
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
            icon: (drawerValue === 5) ? <MetadataIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Metadata" />
                : <MetadataIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_metadata")} />,
            iconColored: <MetadataIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_metadata")} />,
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
            icon: (drawerValue === 6) ? <DeepfakeIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter SNA" />
                : <DeepfakeIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_deepfake")} />,
            iconColored: <DeepfakeIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_deepfake")} />,
            tsvPrefix: "deepfake",
            path: "deepfakeVideo",
            pathGroup: "TOOL",
            type: keyword("navbar_category_video"),
            typeId: 1,
            icons: ["experimental", "lock"],
            toolRestrictions: ["beta"],
        },
        
        {
            id: 8,
            title: "navbar_analysis_image",
            description: "navbar_analysis_image_description",
            icon: (drawerValue === 7) ? <AnalysisIconImage width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Image analysis"/>
                : < AnalysisIconImage width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_analysis_image")}/>,
            iconColored: <AnalysisIconImage width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_analysis_image")}/>,
            tsvPrefix: "api",
            path: "analysisImage",
            pathGroup: "TOOL",
            type: keyword("navbar_category_image"),
            typeId: 2,
            icons: ["new"],
            toolRestrictions: [],
        },
        {
            id: 9,
            title: "navbar_magnifier",
            description: "navbar_magnifier_description",
            icon: (drawerValue === 8) ? <MagnifierIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Magnifier"/>
                : <MagnifierIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_magnifier")}/>,
            iconColored: <MagnifierIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_magnifier")}/>,
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
            icon: (drawerValue === 9) ? <MetadataIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Metadata"/>
                : <MetadataIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_metadata")}/>,
            iconColored: <MetadataIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_metadata")}/>,
            tsvPrefix: "metadata",
            path: "metadata",
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
            icon: (drawerValue === 10) ? <ForensicIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Forensic"/>
                : <ForensicIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_forensic")}/>,
            iconColored: <ForensicIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_forensic")}/>,
            tsvPrefix: "forensic",
            path: "forensic",
            pathGroup: "TOOL",
            type: keyword("navbar_category_image"),
            typeId: 2,
            icons: ["redesigned"],
            toolRestrictions: [],
        },
        {
            id: 12,
            title: "navbar_ocr",
            description: "navbar_ocr_description",
            icon: (drawerValue === 11) ? <OcrIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="OCR" />
                : <OcrIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_ocr")} />,
            iconColored: <OcrIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_ocr")} />,
            tsvPrefix: "ocr",
            path: "ocr",
            pathGroup: "TOOL",
            type: keyword("navbar_category_image"),
            typeId: 2,
            icons: ["new"],
            toolRestrictions: [],
        },

        {
            id: 13,
            title: "navbar_gif",
            description: "navbar_gif_description",
            icon: (drawerValue === 12) ? <GifIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="CheckGIF" />
                : <GifIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_gif")} />,
            iconColored: <GifIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_gif")} />,
            tsvPrefix: "gif",
            path: "gif",
            pathGroup: "TOOL",
            type: keyword("navbar_category_image"),
            typeId: 2,
            icons: ["new", "lock"],
            toolRestrictions: ["lock"],
        },
        {
            id: 14,
            title: "navbar_deepfake_image",
            description: "navbar_deepfake_image_description",
            icon: (drawerValue === 13) ? <DeepfakeIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter SNA" />
                : <DeepfakeIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_deepfake")} />,
            iconColored: <DeepfakeIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_deepfake")} />,
            tsvPrefix: "deepfake",
            path: "deepfakeImage",
            pathGroup: "TOOL",
            type: keyword("navbar_category_image"),
            typeId: 2,
            icons: ["experimental", "lock"],
            toolRestrictions: ["beta"],

        },
        {
            id: 15,
            title: "navbar_geolocation",
            description: "navbar_geolocation_description",
            icon: (drawerValue === 14) ? <GeolactionIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter SNA" />
                : <GeolactionIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_geolocation")} />,
            iconColored: <GeolactionIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_geolocation")} />,
            tsvPrefix: "geolocation",
            path: "geolocation",
            pathGroup: "TOOL",
            type: keyword("navbar_category_image"),
            typeId: 2,
            icons: ["experimental", "lock"],
            toolRestrictions: ["beta"],
        },
        
        
        {
            id: 16,
            title: "navbar_twitter",
            description: "navbar_twitter_description",
            icon: (drawerValue === 15) ? <TwitterSearchIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter search" />
                : <TwitterSearchIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_twitter")} />,
            iconColored: <TwitterSearchIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_twitter")} />,
            tsvPrefix: "twitter",
            path: "twitter",
            pathGroup: "TOOL",
            type: keyword("navbar_category_search"),
            typeId: 3,
            icons: [],
            toolRestrictions: [],
        },        
        {
            id: 17,
            title: "navbar_twitter_sna",
            description: "navbar_twitter_sna_description",
            icon: (drawerValue === 18) ? <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter SNA" />
                : <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_twitter_sna")} />,
            iconColored: <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_twitter_sna")} />,
            tsvPrefix: "twitter_sna",
            path: "twitterSna",
            pathGroup: "TOOL",
            type: keyword("navbar_category_data"),
            typeId: 4,
            icons: ["lock"],
            toolRestrictions: ["lock"],
        },
        {
            id: 18,
            title: "navbar_twitter_crowdtangle",
            description: "navbar_twitter_crowdtangle_description",
            icon: (drawerValue === 19) ? <CsvSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter SNA" />
                : <CsvSnaIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_twitter_crowdtangle")} />,
            iconColored: <CsvSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_twitter_crowdtangle")} />,
            tsvPrefix: "twitter_crowdtangle",
            pathGroup: "TOOL",
            type: keyword("navbar_category_data"),
            typeId: 4,
            icons: [],
            toolRestrictions: [],
        },
        {
            id: 19,
            title: "navbar_covidsearch",
            description: "navbar_covidsearch_description",
            icon: (drawerValue === 16) ? <CovidSearchIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Covid search"/>
                : <CovidSearchIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_covidsearch")}/>,
            iconColored: <CovidSearchIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_covidsearch")}/>,
            tsvPrefix: "covidsearch",
            path: "factcheck",
            pathGroup: "TOOL",
            type: keyword("navbar_category_search"),
            typeId: 3,
            icons: ["new"],
            toolRestrictions: [],
        },
        {
            id: 20,
            title: "navbar_xnetwork",
            description: "navbar_xnetwork_description",
            icon: (drawerValue === 17) ? <XnetworkIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Xnetwork"/>
                : <XnetworkIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_xnetwork")}/>,
            iconColored: <XnetworkIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_xnetwork")}/>,
            tsvPrefix: "xnetwork",
            path: "xnetwork",
            pathGroup: "TOOL",
            type: keyword("navbar_category_search"),
            typeId: 3,
            icons: ["new"],
            toolRestrictions: [],
        },
        
    ];


    const tabItems = [
        {
            title: "navbar_tools",
            icon: (tabValue === 0 && drawerValue === 0) ? <ToolsIcon width="30px" height="30px" style={{ fill: "#51A5B2" }} />
                : <ToolsIcon width="30px" height="30px" style={{ fill: "#4c4c4c" }} />,
            content: <div/>,
            path: "tools",
            pathGroup: "OTHER",
            footer: <div />,
            typeTab: "verification",
            type: keyword("navbar_category_general"),
            typeId: 0,
        },
       {
            title: "navbar_assistant",
            icon: (tabValue === 1) ? <AssistantIcon width="30px" height="30px" style={{ fill: "#51A5B2" }} />
                : <AssistantIcon width="30px" height="30px" style={{ fill: "#4c4c4c" }} />,
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
            icon: (tabValue === 2) ? <GuideIcon width="30px" height="30px" style={{ fill: "#51A5B2" }} />
                : <GuideIcon width="30px" height="30px" style={{ fill: "#4c4c4c" }} />,
            //content: <Tutorial />,
            content: <div />,
            path: "tutorial",
            pathGroup: "OTHER",
            footer: <Footer type={"afp"} />,
            typeTab: "learning",
            type: keyword("navbar_category_general"),
            typeId: 0,
        },
        {
            title: "navbar_quiz",
            icon: (tabValue === 3) ? <InteractiveIcon width="30px" height="30px" style={{ fill: "#51A5B2" }} />
                : <InteractiveIcon width="30px" height="30px" style={{ fill: "#4c4c4c" }} />,
            //content: <Interactive />,
            content: <div />,
            path: "interactive",
            pathGroup: "OTHER",
            footer: <Footer type={"afp"} />,
            typeTab: "learning",
            type: keyword("navbar_category_general"),
            typeId: 0,
        },
        {
            title: "navbar_classroom",
            icon: (tabValue === 4) ? <ClassroomIcon width="30px" height="30px" style={{ fill: "#51A5B2" }} />
                : <ClassroomIcon width="30px" height="30px" style={{ fill: "#4c4c4c" }} />,
            content: <ClassRoom />,
            path: "classroom",
            pathGroup: "OTHER",
            footer: <Footer type={"afp"} />,
            typeTab: "learning",
            type: keyword("navbar_category_general"),
            typeId: 0,
        },
        /*{
            title: "navbar_factCheck",
            icon: (tabValue === 5) ? <FactcheckIcon width="40px" height="40px" style={{ fill: "#51A5B2" }} />
                : <FactcheckIcon width="40px" height="40px" style={{ fill: "#4c4c4c" }} />,
            content: <FactCheck />,
            path: "factCheck",
            footer: <Footer type={"afp"} />
        },*/
       {
            title: "navbar_about",
            icon: (tabValue === 5) ? <AboutIcon width="30px" height="30px" style={{ fill: "#51A5B2" }} />
                : <AboutIcon width="30px" height="30px" style={{ fill: "#4c4c4c" }} />,
            content: <About />,
            path: "about",
            pathGroup: "OTHER",
            footer: <Footer type={"afp"} />,
            typeTab: "more",
            typeId: 0,
        },

    ];

    const handleImageClick = () => {
        history.push("/app/tools/all");
    };

    useEffect(() => {
        let supportedBrowserLang = getSupportedBrowserLanguage();

        if (defaultLanguage !== null) {
            if (defaultLanguage !== currentLang) {
                dispatch(changeLanguage(defaultLanguage))
            }

        }
        else if (supportedBrowserLang !== undefined && supportedBrowserLang !== currentLang) {
            dispatch(changeLanguage(supportedBrowserLang))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const themeFab = createTheme({
        palette: {
            primary: {
                light: '#5cdbe6',
                main: '#05a9b4',
                dark: '#007984',
                contrastText: '#fff',
            },
        },
        components:{
            MuiAppBar:{
                styleOverrides: {
                    colorPrimary:{
                        backgroundColor: "#ffffff",
                    },
                    root:{
                        zIndex: 1300,
                        height: "87px",
                        boxShadow: "none",
                        paddingTop: "12px"
                    }
                }
            },
            MuiListItem:{
                styleOverrides: {
                    gutters:{
                        paddingLeft: "26px"
                    }
                }                
            },
            MuiAutocomplete:{
                styleOverrides: {
                    popupIndicatorOpen: {
                        transform: "none!important"
                    },
                    popper:{
                        zIndex: 99999
                    }
                }
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: "10px!important"
                    }
                }
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        padding:0
                    }
                }
            },
            MuiTab:{
                styleOverrides:{
                    root:{
                        minWidth: "160px"
                    }
                }
            } 
        },
    });


    //Video items
    const drawerItemsVideo = drawerItems.filter(item => item.type === keyword("navbar_category_video"));
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
    const drawerItemsImage = drawerItems.filter(item => item.type === keyword("navbar_category_image"));
    const [openListImage, setOpenListImage] = useState(false);
    const [classBorderImage, setClassBorderImage] = useState(null);

    const handleClickListImage = () => {
        setOpenListImage(!openListImage);
        if (!openListImage){
            setClassBorderImage(classes.drawerCategoryBorder);
        }else{
            setClassBorderImage(null);
        }
    };

    //Search items
    const drawerItemsSearch = drawerItems.filter(item => item.type === keyword("navbar_category_search"));
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
    const drawerItemsData = drawerItems.filter(item => item.type === keyword("navbar_category_data"));
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

    

    const listItems = [
        {
            title: keyword("navbar_category_video"),
            icon: <VideoIcon style={{ fill: "#4c4c4c" }} title={keyword("navbar_category_video")}/>,
            list: drawerItemsVideo,
            variableOpen: openListVideo,
            setVariableOpen: setOpenListVideo,
            functionHandleClick: handleClickListVideo,
            classBorder: classBorderVideo,
        },
        {
            title: keyword("navbar_category_image"),
            icon: <ImageIcon style={{ fill: "#4c4c4c" }} title={keyword("navbar_category_image")}/>,
            list: drawerItemsImage,
            variableOpen: openListImage,
            setVariableOpen: setOpenListImage,
            functionHandleClick: handleClickListImage,
            classBorder: classBorderImage,
        },
        {
            title: keyword("navbar_category_search"),
            icon: <SearchIcon style = {{ fill: "#4c4c4c" }} title={keyword("navbar_category_search")}/>,
            list: drawerItemsSearch,
            variableOpen: openListSeach,
            setVariableOpen: setOpenListSeach,
            functionHandleClick: handleClickListSearch,
            classBorder: classBorderSearch,
        },
        {
            title: keyword("navbar_category_data"),
            icon: <DataIcon style={{ fill: "#4c4c4c" }} title={keyword("navbar_category_data")}/>,
            list: drawerItemsData,
            variableOpen: openListData,
            setVariableOpen: setOpenListData,
            functionHandleClick: handleClickListData,
            classBorder: classBorderData,
        },


    ];


    const toolsItem = drawerItems.find(data => data.title === 'navbar_tools');
    //const assistantItem = tabItems.find(data => data.title === 'navbar_assistant');
    //const drawerItemsLearning = tabItems.filter(item => item.typeTab === "learning");
    const drawerItemsMore = tabItems.filter(item => item.typeTab === "more");
  
    //const [value, setValue] = useState(null);


    return (
        <div className={classes.flex}>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="warning">
                    {keywordWarning("warning_advanced_tools")}
                </Alert>
            </Snackbar>
            <ThemeProvider theme={themeFab}>
            {    
                <AppBar position="fixed">
                    <Toolbar className={classes.toolbar} style={{ borderBottom: "solid 1px #dedbdb"}}>                     

                        <LogoWeVerify2
                            width="100px"
                            height="59px"
                            style={{ height: "35px", width: "auto" }}
                            alt="logo"
                            className={classes.logoLeft}
                            onClick={handleImageClick}
                        /> 

                        <LogoInvid2
                            width="46px"
                            height="26px"
                            style={{ height: "30px", width: "auto" }}
                            alt="logo"
                            className={classes.logoRight}
                            onClick={handleImageClick}
                        />

                        <Box m={3}></Box>

                        <div className={classes.grow} />

                        <Tabs
                            value={tabValue}
                            variant="scrollable"
                            onChange={handleChange}
                            scrollButtons
                            allowScrollButtonsMobile
                            indicatorColor="primary"
                            textColor="primary"
                            aria-label="scrollable force tabs example"
                            style={{ marginRight: "30px" }}
                            TabIndicatorProps={{
                                style: { display: 'none' }
                            }}
                        >
                            {
                                tabItems.map((item, index) => {
                                    console.log("tb ", tabValue)
                                    return <Tab key={index}
                                        label={keyword(item.title)}
                                        icon={item.icon}
                                        className={classes.tab}
                                        {...a11yProps(index)} 
                                        to={item.path}
                                        component={Link} />
                                })
                            }
                        </Tabs>
                        <div className={classes.grow} />

                        <Languages />

                    </Toolbar>
                </AppBar>
                
            }
            
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
                 
                <List style={{marginTop: "80px", paddingLeft: "4px"}}> 

                    <ListSubheader style={{ paddingTop: "16px", paddingBottom: "16px", backgroundColor: "#ffffff" }} className={classListHeading}>
                        <Typography type="body1" style={{ fontWeight: "500", fontSize: "10px", color: "#B0B0B0", textTransform: "uppercase" }}>{open ? keyword("navbar_verification") : keyword("navbar_verification_short")}</Typography>
                    </ListSubheader>

                    <ListItem button onClick={() => changeValue(toolsItem, "TOOL")} component={Link} to={"tools"}>
                        <ListItemIcon color="primary.main">
                            {
                                <IconButton className={classes.customAllToolsButton} style={{ "width": 24, "height": 24 }}>
                                    {toolsItem.icon}
                                </IconButton>
                            }
                        </ListItemIcon>
                        <ListItemText primary={<Typography type="body1" className={classes.drawerListText}>{keyword(toolsItem.title)}</Typography>} />
                    </ListItem>

                    {
                        listItems.map((item, key) => {
                            const element = 
                                <div style={{ margin: "-5px -15px -5px -15px" }}>
                                    <ListItem button onClick={item.functionHandleClick} >

                                        <ListItemIcon color="primary.main">
                                            <IconButton className={classes.customAllToolsButton} style={{ "width": 24, "height": 24 }}>{item.icon}</IconButton>
                                        </ListItemIcon>

                                        <ListItemText primary={<Typography type="body1" className={classes.drawerListText}>{item.title}</Typography>} />

                                        {openListVideo ? <ExpandLess /> : <ExpandMore />}

                                    </ListItem>

                                    <Collapse in={item.variableOpen} timeout="auto" unmountOnExit>

                                        <List component="div" disablePadding>
                                            {
                                                item.list.map((itemList, keyList) => {

                                                    var element = 
                                                        <ListItem button key={keyList} onClick={() => changeValue(itemList, "TOOL")} >
                                                            {
                                                                open ?
                                                                    <ListItemIcon color="primary.main" className={classes.drawerListNested}>
                                                                        {
                                                                            <IconButton className={classes.customAllToolsButton} style={{ "width": 24, "height": 24 }}>
                                                                                {itemList.icon}
                                                                            </IconButton>
                                                                        }
                                                                    </ListItemIcon>
                                                                    :
                                                                    <ListItemIcon color="primary.main">
                                                                        {
                                                                            <IconButton className={classes.customAllToolsButton} style={{ "width": 24, "height": 24 }}>
                                                                                {itemList.icon}
                                                                            </IconButton>
                                                                        }
                                                                    </ListItemIcon>

                                                            }
                                                            <ListItemText primary={<Typography type="body1" className={classes.drawerListText}>{keyword(itemList.title)}</Typography>} />
                                                        </ListItem>
                                                    
                                                    if (itemList.toolRestrictions.includes("beta")){
                                                        if(betaTester){
                                                            return (
                                                                element
                                                            )
                                                        } else {
                                                            return (
                                                                null
                                                            )
                                                        }
                                                    }else{
                                                        return (
                                                            element
                                                        )
                                                    }
                                                    
                                                })
                                            }
                                        </List>

                                    </Collapse>
                                
                                </div>

                            return(
                                <div key={key}>

                                    {open ? 
                                        <div style={{ margin: "5px 18px 5px 14px", borderRadius: "10px" }}>
                                            {element}
                                        </div>
                                        :
                                        <div style={{ margin: "14px 18px 14px 14px", borderRadius: "10px" }} className={item.classBorder}>
                                            {element}
                                        </div>
                                    }
                                    
                                </div>
                                
                                
                            )
                        })
                    }
                    <Box m={2} />

                    <ListSubheader style={{ paddingTop: "16px", paddingBottom: "16px" }} className={classListHeading} >
                        <Typography type="body1" style={{ fontWeight: "500", fontSize: "10px", color: "#B0B0B0", textTransform: "uppercase" }}>{open ? keyword("navbar_more") : keyword("navbar_more_short")}</Typography>
                    </ListSubheader>

                    {
                        drawerItemsMore.map((item, key) => {
                            return (
                                <ListItem button key={key} onClick={() => changeValue(item, "OTHER")}>
                                    <ListItemIcon color="primary.main">
                                        {
                                            <IconButton className={classes.customAllToolsButton} style={{ "width": 24, "height": 24 }}>
                                                {item.icon}
                                            </IconButton>
                                        }
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography type="body1" className={classes.drawerListText}>{keyword(item.title)}</Typography>} />
                                </ListItem>

                            )
                        })
                    }
                </List>

                <div className={classes.grow}/>
                
                
                <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", position: "sticky", bottom: "0px", backgroundColor:"#ffffff", zIndex: "9" }}>
                    <Box p={1}><Divider /></Box>
                    <Button
                        onClick={handleDrawerToggle}
                        style={{ alignSelf: "center" }}
                        startIcon={!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}

                    >
                        {open ? keyword("navbar_collapse") : ""}
                    </Button>
                    <Box m={1}/>
                </div>
            </Drawer>

            <main className={classes.content}>
                <div className={classes.toolbar} id="back-to-top-anchor" />
                <TabItem className={classes.noMargin} tabItems={tabItems} drawerItems={drawerItems} />
                <ScrollTop {...props}>
                    <ThemeProvider theme={themeFab}>
                        <Fab color="primary" size="large" aria-label="scroll back to top" className={classes.fabTop}>
                            <KeyboardArrowUpIcon />
                        </Fab>
                    </ThemeProvider>
                </ScrollTop>
                {
                    (error !== null) &&
                    <MySnackbar variant="error" message={error} onClick={() => dispatch(cleanError())} />
                }
                {
                    cookiesUsage === null &&
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        open={true}
                        message={keyword("cookies_message")}
                        action={[
                            <Button key={"cookies_decline"} color={"secondary"} size={"small"} onClick={() => dispatch(setFalse())}> {keyword("cookies_decline")} </Button>,
                            <Button key={"cookies_accept"} color={"primary"} size={"small"} onClick={() => dispatch(setTrue())}> {keyword("cookies_accept")} </Button>,
                        ]}
                    />
                }
                <FeedBack />
            </main>
            </ThemeProvider>
            
        </div>
    );
};
export default memo(NavBar);
