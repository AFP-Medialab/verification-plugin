import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {useDispatch, useSelector} from "react-redux";
import Languages from "../NavItems/languages/languages";
import logoInvid from "./images/logo-invid.png";
import logoWeVerify from "../PopUp/images/logo-we-verify.png";
import Tutorial from "../NavItems/tutorial/tutorial";
import React, {useEffect} from 'react';
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
import AppsIcon from '@material-ui/icons/Apps';
import ScrollTop from "../Shared/ScrollTop/ScrollTop";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import history from '../Shared/History/History';
import {cleanError} from "../../redux/actions/errorActions";
import TabItem from "./TabItem/TabItem";
import ClassRoom from "../NavItems/ClassRoom/ClassRoom";
import Interactive from "../NavItems/Interactive/Interactive";
import About from "../NavItems/About/About";
import Assistant from "../NavItems/Assistant/Assistant";
import MySnackbar from "../MySnackbar/MySnackbar";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import Footer from "../Shared/Footer/Footer";
import FeedBack from "../FeedBack/FeedBack";

/*
import Icon from "@material-ui/core/Icon";

import assistantIcon from "./images/navbar/assistant-icon-grey.svg";
import toolIcon from "./images/navbar/tools-off.png"
import tutorialIcon from "./images/navbar/tutorial-off.png"
import classRoomIcon from "./images/navbar/classroom-off.png"
import interactiveIcon from "./images/navbar/quiz-off.png"
import aboutIcon from "./images/navbar/about-off.png"
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import FaceIcon from '@material-ui/icons/Face';

import analysisIconOn from "./images/tools/video_logoOn.png"
import analysisIconOff from "./images/tools/video_logoOff.png"

import keyframesIconOn from "./images/tools/keyframesOn.png"
import keyframesIconOff from "./images/tools/keyframesOff.png"

import thumbnailsIconOn from "./images/tools/youtubeOn.png"
import thumbnailsIconOff from "./images/tools/youtubeOff.png"

import twitterSearchIconOn from "./images/tools/twitterOn.png"
import twitterSearchIconOff from "./images/tools/twitterOff.png"

import magnifierIconOn from "./images/tools/magnifierOn.png"
import magnifierIconOff from "./images/tools/magnifierOff.png"

import metadataIconOn from "./images/tools/metadataOn.png"
import metadataIconOff from "./images/tools/metadataOff.png"

import videoRightsIconOn from "./images/tools/copyrightOn.png"
import videoRightsIconOff from "./images/tools/copyrightOff.png"

import forensicIconOn from "./images/tools/forensic_logoOn.png"
import forensicIconOff from "./images/tools/forensic_logoOff.png"

import twitterSnaIconOn from "./images/tools/twitter-sna-on.png"
import twitterSnaIconOff from "./images/tools/twitter-sna-off.png"

import covidSearchIconOn from "./images/tools/covid_search_logoOn.png"
import covidSearchIconOff from "./images/tools/covid_search_logoOff.png"

import xnetworkIconOn from "./images/tools/xnetwork_logoOn.png"
import xnetworkIconOff from "./images/tools/xnetwork_logoOff.png"
*/

import { ReactComponent as AnalysisIcon } from "./images/SVG/Video/Video_analysis.svg"
import { ReactComponent as KeyframesIcon } from "./images/SVG/Video/Keyframes.svg"
import { ReactComponent as ThumbnailsIcon } from "./images/SVG/Video/Thumbnails.svg"
import { ReactComponent as VideoRightsIcon } from "./images/SVG/Video/Video_rights.svg"

import { ReactComponent as MetadataIcon } from "./images/SVG/Image/Metadata.svg"
import { ReactComponent as MagnifierIcon } from "./images/SVG/Image/Magnifier.svg"
import { ReactComponent as ForensicIcon } from "./images/SVG/Image/Forensic.svg"
import { ReactComponent as GifIcon }  from "./images/SVG/Image/Gif.svg"
import { ReactComponent as OcrIcon }  from "./images/SVG/Image/OCR.svg"
//import { ReactComponent as AnalysisIconImage }  from "./images/SVG/Image/Analysis_img.svg"
import { ReactComponent as AnalysisIconImage }  from "./images/SVG/Video/Video_analysis.svg"


import { ReactComponent as TwitterSearchIcon } from "./images/SVG/Search/Twitter_search.svg"
import { ReactComponent as CovidSearchIcon } from "./images/SVG/Search/Covid19.svg"
import { ReactComponent as XnetworkIcon } from "./images/SVG/Search/Xnetwork.svg"

import { ReactComponent as TwitterSnaIcon } from "./images/SVG/DataAnalysis/Twitter_sna.svg"

import { ReactComponent as ToolsIcon } from "./images/SVG/Navbar/Tools.svg"
import { ReactComponent as ClassroomIcon } from "./images/SVG/Navbar/Classroom.svg"
import { ReactComponent as InteractiveIcon } from "./images/SVG/Navbar/Interactive.svg"
import { ReactComponent as FactcheckIcon } from "./images/SVG/Navbar/Fact_check.svg"
import { ReactComponent as AboutIcon } from "./images/SVG/Navbar/About.svg"
import { ReactComponent as AssistantIcon } from "./images/SVG/Navbar/Assistant.svg"
import { ReactComponent as GuideIcon } from "./images/SVG/Navbar/Guide.svg"




import {getSupportedBrowserLanguage} from "../Shared/Languages/getSupportedBrowserLanguage";
import useLoadLanguage from "../../Hooks/useLoadLanguage";
import tsv from "../../LocalDictionary/components/NavBar.tsv";
import FactCheck from "../NavItems/FactCheck/FactCheck";
import Snackbar from "@material-ui/core/Snackbar";
import {setFalse, setTrue} from "../../redux/actions/cookiesActions";
import {changeLanguage} from "../../redux/actions";
import Button from "@material-ui/core/Button";


function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const NavBar = (props) => {
    const classes = useMyStyles();
    const [open, setOpen] = React.useState(false);

    const tabValue = useSelector(state => state.nav);
    const drawerValue = useSelector(state => state.tool.selected);
    const cookiesUsage = useSelector(state => state.cookies);
    const currentLang = useSelector(state => state.language);
    const defaultLanguage = useSelector(state => state.defaultLanguage);


    const dispatch = useDispatch();


    const handleChange = (event, newValue) => {
        if (tabItems[newValue].path === "tools")
            history.push("/app/tools/" + drawerItems[newValue].path);
        else
            history.push("/app/" + tabItems[newValue].path)
    };

    const changeValue = (newValue) => {
        history.push("/app/tools/" + drawerItems[newValue].path)
    };

    const error = useSelector(state => state.error);
    const keyword = useLoadLanguage("components/NavBar.tsv", tsv);


    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const drawerItems = [
        {
            title: "navbar_tools",
            icon: <AppsIcon fontSize={"large"}
                            className={(drawerValue === 0) ? classes.selectedApp : classes.unSelectedApp}/>,
            tsvPrefix: "all",
            path: "all",
        },
        {
            title: "navbar_analysis_video",
            description: "navbar_analysis_description",
            icon: <AnalysisIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            iconColored: <AnalysisIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "api",
            path: "analysis",
        },
        {
            title: "navbar_keyframes",
            description: "navbar_keyframes_description",
            icon: <KeyframesIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            iconColored: <KeyframesIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "keyframes",
            path: "keyframes",
        },
        {
            title: "navbar_thumbnails",
            description: "navbar_thumbnails_description",
            icon: <ThumbnailsIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            iconColored: <ThumbnailsIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "thumbnails",
            path: "thumbnails",
        },
        {
            title: "navbar_twitter",
            description: "navbar_twitter_description",
            icon: <TwitterSearchIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            iconColored: <TwitterSearchIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "twitter",
            path: "twitter",
        },
        {
            title: "navbar_analysis_image",
            description: "navbar_analysis_description_image",
            icon: <AnalysisIconImage width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            iconColored: <AnalysisIconImage width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "api",
            path: "analysisImage",
        },
        {
            title: "navbar_magnifier",
            description: "navbar_magnifier_description",
            icon: <MagnifierIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            iconColored: <MagnifierIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "magnifier",
            path: "magnifier",
        },
        {
            title: "navbar_metadata",
            description: "navbar_metadata_description",
            icon: <MetadataIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            iconColored: <MetadataIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "metadata",
            path: "metadata",
        },
        {
            title: "navbar_rights",
            description: "navbar_rights_description",
            icon: <VideoRightsIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            iconColored: <VideoRightsIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "copyright",
            path: "copyright",
        },
        {
            title: "navbar_forensic",
            description: "navbar_forensic_description",
            icon: <ForensicIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            iconColored: <ForensicIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "forensic",
            path: "forensic",
        },
        {
            title: "navbar_twitter_sna",
            description: "navbar_twitter_sna_description",
            icon: <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            iconColored: <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "twitter_sna",
            path: "twitterSna"
        },
        
        {
            title: "navbar_covidsearch",
            description: "navbar_covidsearch_description",
            icon: <CovidSearchIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            iconColored: <CovidSearchIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "covidsearch",
            path: "covidSearch"
        },
        {
            title: "navbar_xnetwork",
            description: "navbar_xnetwork_description",
            icon: <XnetworkIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            iconColored: <XnetworkIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "xnetwork",
            path: "xnetwork"
        },
        {
            title: "navbar_ocr",
            description: "navbar_ocr_description",
            icon: <OcrIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} />,
            iconColored: <OcrIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "ocr",
            path: "ocr"
        },
        
        {
            title: "navbar_gif",
            description: "navbar_gif_description",
            icon: <GifIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }}/>,
            iconColored: <GifIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} />,
            tsvPrefix: "gif",
            path: "gif"
        }
    ];


    const tabItems = [
        {
            title: "navbar_tools",
            icon: <ToolsIcon width="40px" height="40px" style={{ fill: "#717171" }} />,
            content: <div/>,
            path: "tools",
            footer: <div/>,
        },
        {
            title: "navbar_tuto",
            icon: <GuideIcon width="40px" height="40px" style={{ fill: "#717171" }} />,
            content: <Tutorial/>,
            path: "tutorial",
            footer: <Footer type={"afp"}/>
        },
        {
            title: "navbar_classroom",
            icon: <ClassroomIcon width="40px" height="40px" style={{ fill: "#717171" }} />,
            content: <ClassRoom/>,
            path: "classroom",
            footer: <Footer type={"afp"}/>
        },
        {
            title: "navbar_quiz",
            icon: <InteractiveIcon width="40px" height="40px" style={{ fill: "#717171" }} />,
            content: <Interactive/>,
            path: "interactive",
            footer: <Footer type={"afp"}/>
        },
        {
            title: "navbar_factCheck",
            icon: <FactcheckIcon width="40px" height="40px" style={{ fill: "#717171" }} />,
            content: <FactCheck/>,
            path: "factCheck",
            footer: <Footer type={"afp"}/>
        },
        {
            title: "navbar_about",
            icon: <AboutIcon width="40px" height="40px" style={{ fill: "#717171" }} />,
            content: <About/>,
            path: "about",
            footer: <Footer type={"afp"}/>
        },
        {
            title: "navbar_assistant",
            icon: <AssistantIcon width="40px" height="40px" style={{ fill: "#717171" }} />,
            content: <Assistant/>,
            path: "assistant",
            footer: <Footer type={"usfd"}/>
        }
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


    return (
        <div className={classes.flex}>
            <AppBar position="fixed" color="default" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Box display={{xs: 'none', md: 'block'}}>
                        <img
                            src={logoInvid} alt="logo"
                            className={classes.logoLeft}
                            onClick={handleImageClick}
                        />
                    </Box>
                    <div className={classes.grow}/>
                    <Tabs
                        value={tabValue}
                        variant="scrollable"
                        onChange={handleChange}
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="scrollable force tabs example"
                    >
                        {
                            tabItems.map((item, index) => {
                                return <Tab key={index}
                                            label={keyword(item.title)}
                                            icon={item.icon}
                                            className={classes.tab}
                                            {...a11yProps(index)}/>
                            })
                        }
                    </Tabs>
                    <div className={classes.grow}/>
                    <Languages/>
                    <Box display={{xs: 'none', md: 'block'}}>
                        <img
                            src={logoWeVerify}
                            alt="logo"
                            className={classes.logoRight}
                            onClick={handleImageClick}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer hidden={tabValue !== 0 || (tabValue === 0 && drawerValue === 0)}
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
                    open={open}
            >
                <Box m={5}/>
                <IconButton onClick={handleDrawerToggle}>
                    {!open ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                </IconButton>
                <Divider/>
                <List>
                    {
                        drawerItems.map((item, key) => {
                            return (
                                <ListItem button key={key} onClick={() => changeValue(key)} >
                                    <ListItemIcon color="primary.main">
                                        {
                                            <IconButton className={classes.customAllToolsButton} style={{ "width": 40, "height": 40}}>
                                                {item.icon}
                                            </IconButton>
                                        }
                                    </ListItemIcon>
                                    <ListItemText primary={keyword(item.title)}/>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} id="back-to-top-anchor"/>
                <TabItem className={classes.noMargin} tabItems={tabItems} drawerItems={drawerItems}/>
                <ScrollTop {...props}>
                    <Fab color="secondary" size="small" aria-label="scroll back to top">
                        <KeyboardArrowUpIcon/>
                    </Fab>
                </ScrollTop>
                {
                    (error !== null) &&
                    <MySnackbar variant="error" message={error} onClick={() => dispatch(cleanError())}/>
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
                <FeedBack/>
            </main>
        </div>
    );
};
export default React.memo(NavBar);
