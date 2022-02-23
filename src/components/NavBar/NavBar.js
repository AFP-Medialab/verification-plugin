
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from "react-redux";
import Languages from "../NavItems/languages/languages";
import Tutorial from "../NavItems/tutorial/tutorial";
import React, { useEffect } from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ScrollTop from "../Shared/ScrollTop/ScrollTop";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import history from '../Shared/History/History';
import { cleanError } from "../../redux/actions/errorActions";
import TabItem from "./TabItem/TabItem";
import ClassRoom from "../NavItems/ClassRoom/ClassRoom";
import Interactive from "../NavItems/Interactive/Interactive";
import About from "../NavItems/About/About";
import Assistant from "../NavItems/Assistant/Assistant";
import MySnackbar from "../MySnackbar/MySnackbar";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import Footer from "../Shared/Footer/Footer";
import FeedBack from "../FeedBack/FeedBack";

import { ReactComponent as AnalysisIcon } from "./images/SVG/Video/Video_analysis.svg"
import { ReactComponent as KeyframesIcon } from "./images/SVG/Video/Keyframes.svg"
import { ReactComponent as ThumbnailsIcon } from "./images/SVG/Video/Thumbnails.svg"
import { ReactComponent as VideoRightsIcon } from "./images/SVG/Video/Video_rights.svg"

import { ReactComponent as MetadataIcon } from "./images/SVG/Image/Metadata.svg"
import { ReactComponent as MagnifierIcon } from "./images/SVG/Image/Magnifier.svg"
import { ReactComponent as ForensicIcon } from "./images/SVG/Image/Forensic.svg"
import { ReactComponent as GifIcon } from "./images/SVG/Image/Gif.svg"
import { ReactComponent as OcrIcon } from "./images/SVG/Image/OCR.svg"
//import { ReactComponent as AnalysisIconImage }  from "./images/SVG/Image/Analysis_img.svg"
import { ReactComponent as AnalysisIconImage } from "./images/SVG/Image/Image_analysis.svg"


import { ReactComponent as TwitterSearchIcon } from "./images/SVG/Search/Twitter_search.svg"
import { ReactComponent as CovidSearchIcon } from "./images/SVG/Search/Covid19.svg"
import { ReactComponent as XnetworkIcon } from "./images/SVG/Search/Xnetwork.svg"

import { ReactComponent as TwitterSnaIcon } from "./images/SVG/DataAnalysis/Twitter_sna.svg"
import { ReactComponent as CsvSnaIcon } from "./images/SVG/DataAnalysis/CSV_SNA.svg"
import { ReactComponent as DeepfakeIcon } from "./images/SVG/Image/Deepfake.svg"
import { ReactComponent as GeolactionIcon } from "./images/SVG/Image/Geolocation.svg"

import { ReactComponent as ToolsIcon } from "./images/SVG/Navbar/Tools.svg"
import { ReactComponent as ClassroomIcon } from "./images/SVG/Navbar/Classroom.svg"
import { ReactComponent as InteractiveIcon } from "./images/SVG/Navbar/Interactive.svg"
//import { ReactComponent as FactcheckIcon } from "./images/SVG/Navbar/Fact_check.svg"
import { ReactComponent as AboutIcon } from "./images/SVG/Navbar/About.svg"
import { ReactComponent as AssistantIcon } from "./images/SVG/Navbar/Assistant.svg"
import { ReactComponent as GuideIcon } from "./images/SVG/Navbar/Guide.svg"

import { ReactComponent as LogoInvid2 } from "./images/SVG/Navbar/InVID.svg"
import { ReactComponent as LogoWeVerify2 } from "./images/SVG/Navbar/WeVerify.svg"

import { ReactComponent as VideoIcon } from "./images/SVG/Video/Video.svg"
import { ReactComponent as ImageIcon } from "./images/SVG/Image/Images.svg"
import { ReactComponent as SearchIcon } from "./images/SVG/Search/Search.svg"
import { ReactComponent as DataIcon } from "./images/SVG/DataAnalysis/Data_analysis.svg"

import { getSupportedBrowserLanguage } from "../Shared/Languages/getSupportedBrowserLanguage";
import useLoadLanguage from "../../Hooks/useLoadLanguage";
import tsv from "../../LocalDictionary/components/NavBar.tsv";
import tsvWarning from "../../LocalDictionary/components/Shared/OnWarningInfo.tsv";
import Snackbar from "@material-ui/core/Snackbar";
import { setFalse, setTrue } from "../../redux/actions/cookiesActions";
import { changeLanguage } from "../../redux/actions";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import { Collapse, ListSubheader } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIconMaterial from '@material-ui/icons/Search';


/*
function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}
*/

const NavBar = (props) => {
    const classes = useMyStyles();
    const [open, setOpen] = React.useState(true);
    const [classWidthToolbar, setClassWidthToolbar] = React.useState(classes.drawerWidth);

    const tabValue = useSelector(state => state.nav);
    const drawerValue = useSelector(state => state.tool.selected);
    const cookiesUsage = useSelector(state => state.cookies);
    const currentLang = useSelector(state => state.language);
    const defaultLanguage = useSelector(state => state.defaultLanguage);

    const dispatch = useDispatch();

    const drawerRef = React.createRef();

    /*

    const handleChange = (event, newValue) => {
        if (tabItems[newValue].path === "tools")
            history.push("/app/tools/" + drawerItems[newValue].path);
        else
            history.push("/app/" + tabItems[newValue].path)
    };

    */

    const [openAlert, setOpenAlert] = React.useState(false);

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
                history.push({
                    pathname: "/app/tools/" + newValue.path,
                    state: { media: mediaTool }
                })
            }


        } else if (newValueType === "OTHER"){
            history.push("/app/" + newValue.path) 

        }

        

    };

    const error = useSelector(state => state.error);
    const keyword = useLoadLanguage("components/NavBar.tsv", tsv);
    const keywordWarning = useLoadLanguage("components/Shared/OnWarningInfo.tsv", tsvWarning);


    const [classListHeading, setClassListHeading] = React.useState(classes.drawerListHeadingLeft);

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

    const drawerItems = [
        {
            id: 1,
            title: "navbar_tools",
            icon: <ToolsIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            tsvPrefix: "all",
            path: "all",
            type: "General",
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
            type: "video",
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
            type: "video",
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
            type: "video",
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
            type: "video",
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
            type: "video",
            typeId: 1,
            icons: [],
            toolRestrictions: [],
        },

        {
            id: 7,
            title: "navbar_deepfake",
            description: "navbar_deepfake_description",
            icon: (drawerValue === 6) ? <DeepfakeIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter SNA" />
                : <DeepfakeIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_deepfake")} />,
            iconColored: <DeepfakeIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_deepfake")} />,
            tsvPrefix: "deepfake",
            path: "deepfake",
            type: "video",
            typeId: 1,
            icons: ["new", "lock"],
            toolRestrictions: ["lock"],
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
            type: "image",
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
            type: "image",
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
            type: "image",
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
            type: "image",
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
            type: "image",
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
            type: "image",
            typeId: 2,
            icons: ["new", "lock"],
            toolRestrictions: ["lock"],
        },
        {
            id: 14,
            title: "navbar_deepfake",
            description: "navbar_deepfake_description",
            icon: (drawerValue === 13) ? <DeepfakeIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter SNA" />
                : <DeepfakeIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_deepfake")} />,
            iconColored: <DeepfakeIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_deepfake")} />,
            tsvPrefix: "deepfake",
            path: "deepfake",
            type: "image",
            typeId: 2,
            icons: ["new", "lock"],
            toolRestrictions: ["lock"],

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
            type: "image",
            typeId: 2,
            icons: ["new", "lock"],
            toolRestrictions: ["lock"],
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
            type: "search",
            typeId: 3,
            icons: [],
            toolRestrictions: [],
        },
        {
            id: 17,
            title: "navbar_covidsearch",
            description: "navbar_covidsearch_description",
            icon: (drawerValue === 16) ? <CovidSearchIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Covid search"/>
                : <CovidSearchIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_covidsearch")}/>,
            iconColored: <CovidSearchIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_covidsearch")}/>,
            tsvPrefix: "covidsearch",
            path: "covidSearch",
            type: "search",
            typeId: 3,
            icons: ["new"],
            toolRestrictions: [],
        },
        {
            id: 18,
            title: "navbar_xnetwork",
            description: "navbar_xnetwork_description",
            icon: (drawerValue === 17) ? <XnetworkIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Xnetwork"/>
                : <XnetworkIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_xnetwork")}/>,
            iconColored: <XnetworkIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_xnetwork")}/>,
            tsvPrefix: "xnetwork",
            path: "xnetwork",
            type: "search",
            typeId: 3,
            icons: ["new"],
            toolRestrictions: [],
        },
        
        {
            id: 19,
            title: "navbar_twitter_sna",
            description: "navbar_twitter_sna_description",
            icon: (drawerValue === 18) ? <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter SNA" />
                : <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_twitter_sna")} />,
            iconColored: <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_twitter_sna")} />,
            tsvPrefix: "twitter_sna",
            path: "twitterSna",
            type: "data",
            typeId: 4,
            icons: ["lock"],
            toolRestrictions: ["lock"],
        },
        {
            id: 20,
            title: "navbar_twitter_crowdtangle",
            description: "navbar_twitter_crowdtangle_description",
            icon: (drawerValue === 19) ? <CsvSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter SNA" />
                : <CsvSnaIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_twitter_crowdtangle")} />,
            iconColored: <CsvSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_twitter_crowdtangle")} />,
            tsvPrefix: "twitter_crowdtangle",
            type: "data",
            typeId: 4,
            icons: [],
            toolRestrictions: [],
        },
    ];


    const tabItems = [
        {
            title: "navbar_tools",
            icon: (tabValue === 0 && drawerValue === 0) ? <ToolsIcon width="40px" height="40px" style={{ fill: "#51A5B2" }} />
                : <ToolsIcon width="40px" height="40px" style={{ fill: "#4c4c4c" }} />,
            content: <div />,
            path: "tools",
            footer: <div />,
            type: "verification",
        },
        {
            title: "navbar_assistant",
            icon: (tabValue === 1) ? <AssistantIcon width="40px" height="40px" style={{ fill: "#51A5B2" }} />
                : <AssistantIcon width="40px" height="40px" style={{ fill: "#4c4c4c" }} />,
            content: <Assistant />,
            path: "assistant",
            footer: <Footer type={"usfd"} />,
            type: "verification",
        },
        {
            title: "navbar_tuto",
            icon: (tabValue === 2) ? <GuideIcon width="40px" height="40px" style={{ fill: "#51A5B2" }} />
                : <GuideIcon width="40px" height="40px" style={{ fill: "#4c4c4c" }} />,
            content: <Tutorial />,
            path: "tutorial",
            footer: <Footer type={"afp"} />,
            type: "learning"
        },
        {
            title: "navbar_quiz",
            icon: (tabValue === 3) ? <InteractiveIcon width="40px" height="40px" style={{ fill: "#51A5B2" }} />
                : <InteractiveIcon width="40px" height="40px" style={{ fill: "#4c4c4c" }} />,
            content: <Interactive />,
            path: "interactive",
            footer: <Footer type={"afp"} />,
            type: "learning"
        },
        {
            title: "navbar_classroom",
            icon: (tabValue === 4) ? <ClassroomIcon width="40px" height="40px" style={{ fill: "#51A5B2" }} />
                : <ClassroomIcon width="40px" height="40px" style={{ fill: "#4c4c4c" }} />,
            content: <ClassRoom />,
            path: "classroom",
            footer: <Footer type={"afp"} />,
            type: "learning"
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
            icon: (tabValue === 5) ? <AboutIcon width="40px" height="40px" style={{ fill: "#51A5B2" }} />
                : <AboutIcon width="40px" height="40px" style={{ fill: "#4c4c4c" }} />,
            content: <About />,
            path: "about",
            footer: <Footer type={"afp"} />,
            type: "more"
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
        overrides: {
            MuiAppBar:{
                colorPrimary:{
                    backgroundColor: "#ffffff",
                },
                root:{
                    zIndex: 1300,
                    height: "87px",
                    boxShadow: "none",
                    paddingTop: "12px"
                }
            },
            MuiListItem:{
                gutters:{
                    paddingLeft: "26px"
                },
                
            },
            MuiAutocomplete:{
                popupIndicatorOpen: {
                    transform: "none!important"
                },
                popper:{
                    zIndex: 99999
                }
                
            },
            MuiCard: {
                root: {
                    borderRadius: "10px!important"
                }
            }
            
            
        }
    });


    //Video items
    const drawerItemsVideo = drawerItems.filter(item => item.type === "video");
    const [openListVideo, setOpenListVideo] = React.useState(false);
    const [classBorderVideo, setClassBorderVideo] = React.useState(null);

    const handleClickListVideo = () => {
        setOpenListVideo(!openListVideo);
        if (!classBorderVideo) {
            setClassBorderVideo(classes.drawerCategoryBorder);
        } else {
            setClassBorderVideo(null);
        }
    };


    //Image items
    const drawerItemsImage = drawerItems.filter(item => item.type === "image");
    const [openListImage, setOpenListImage] = React.useState(false);
    const [classBorderImage, setClassBorderImage] = React.useState(null);

    const handleClickListImage = () => {
        setOpenListImage(!openListImage);
        if (!openListImage){
            setClassBorderImage(classes.drawerCategoryBorder);
        }else{
            setClassBorderImage(null);
        }
    };

    //Search items
    const drawerItemsSearch = drawerItems.filter(item => item.type === "search");
    const [openListSeach, setOpenListSeach] = React.useState(false);
    const [classBorderSearch, setClassBorderSearch] = React.useState(null);

    const handleClickListSearch = () => {
        setOpenListSeach(!openListSeach);
        if (!openListSeach) {
            setClassBorderSearch(classes.drawerCategoryBorder);
        } else {
            setClassBorderSearch(null);
        }
    };

    //Data items
    const drawerItemsData = drawerItems.filter(item => item.type === "data");
    const [openListData, setOpenListData] = React.useState(false);
    const [classBorderData, setClassBorderData] = React.useState(null);

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
            title: "Video",
            icon: <VideoIcon style={{ fill: "#4c4c4c" }} />,
            list: drawerItemsVideo,
            variableOpen: openListVideo,
            setVariableOpen: setOpenListVideo,
            functionHandleClick: handleClickListVideo,
            classBorder: classBorderVideo,
        },
        {
            title: "Image",
            icon: <ImageIcon style={{ fill: "#4c4c4c" }} />,
            list: drawerItemsImage,
            variableOpen: openListImage,
            setVariableOpen: setOpenListImage,
            functionHandleClick: handleClickListImage,
            classBorder: classBorderImage,
        },
        {
            title: "Search",
            icon: <SearchIcon style = {{ fill: "#4c4c4c" }} />,
            list: drawerItemsSearch,
            variableOpen: openListSeach,
            setVariableOpen: setOpenListSeach,
            functionHandleClick: handleClickListSearch,
            classBorder: classBorderSearch,
        },
        {
            title: "Data analysis",
            icon: <DataIcon style={{ fill: "#4c4c4c" }} />,
            list: drawerItemsData,
            variableOpen: openListData,
            setVariableOpen: setOpenListData,
            functionHandleClick: handleClickListData,
            classBorder: classBorderData,
        },


    ];


    const toolsItem = drawerItems.find(data => data.title === 'navbar_tools');
    const assistantItem = tabItems.find(data => data.title === 'navbar_assistant');
    const drawerItemsLearning = tabItems.filter(item => item.type === "learning");
    const drawerItemsMore = tabItems.filter(item => item.type === "more");
  
    const [value, setValue] = React.useState(null);


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

                       
                        {/*<div style ={{transition: "width .3s"}} className={classWidthToolbar} />*/}

                        <LogoWeVerify2
                            style={{ height: "35px", width: "auto" }}
                            alt="logo"
                            className={classes.logoLeft}
                            onClick={handleImageClick}
                        /> 

                        <LogoInvid2
                            style={{ height: "30px", width: "auto" }}
                            alt="logo"
                            className={classes.logoRight}
                            onClick={handleImageClick}
                        />

                        <div className={classes.grow} />
                        
                        <Autocomplete
                                options={drawerItems.sort(function (a, b) { return a.typeId - b.typeId })}
                            getOptionLabel={(option) => keyword(option.title)}
                            style={{ width: 400 }}
                            popupIcon={<SearchIconMaterial />}
                            forcePopupIcon={true}
                            value={value}
                            groupBy={(option) => option.type}
                            getOptionSelected={(option, value) => option.typeId === value.typeId}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                                changeValue(newValue, "TOOL", newValue.type);
                            }}
                            renderOption={(option) => (
                                <React.Fragment key={option.title}>
                                    <IconButton className={classes.customAllToolsButton} style={{ "width": 24, "height": 24, marginRight :"20px" }}>{option.icon}</IconButton>
                                    {keyword(option.title)}
                                </React.Fragment>
                            )}
                                
                           
                            renderInput={(params) => 
                                <TextField 
                                    {...params} 
                                    size="small" 
                                    label="Search tools"
                                    variant="outlined"
                                    />
                            }
                        />
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

                    <ListItem button onClick={() => changeValue(toolsItem, "TOOL")} >
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
                                    <ListItem button onClick={item.functionHandleClick}>

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
                                                    return (
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
                                                    )
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

                    <ListItem button onClick={() => changeValue(assistantItem, "OTHER")} >
                        <ListItemIcon color="primary.main">
                            {
                                <IconButton className={classes.customAllToolsButton} style={{ "width": 24, "height": 24 }}>
                                    {assistantItem.icon}
                                </IconButton>
                            }
                        </ListItemIcon>
                        <ListItemText primary={<Typography type="body1" className={classes.drawerListText}>{keyword(assistantItem.title)}</Typography>} />
                    </ListItem>

                    <Box m={2} />

                    <ListSubheader style={{ paddingTop: "16px", paddingBottom: "16px" }} className={classListHeading}>
                        <Typography type="body1" style={{ fontWeight: "500", fontSize: "10px", color: "#B0B0B0", textTransform: "uppercase" }}>{open ? keyword("navbar_learning") : keyword("navbar_learning_short")}</Typography>
                    </ListSubheader>

                    {
                        drawerItemsLearning.map((item, key) => {
                            return(
                                <ListItem button key={key} onClick={() => changeValue(item, "OTHER") }>
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

                   
                    
                    

                    {
                        /*
                        drawerItems.map((item, key) => {
                            return (
                                <ListItem button key={key} onClick={() => changeValue(key)} >
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
                        */
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
                        {open ? "COLLAPSE" : ""}
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
export default React.memo(NavBar);
