import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {useDispatch, useSelector} from "react-redux";
import Languages from "../NavItems/languages/languages";
import logoInvid from "./images/logo-invid.png";
import logoWeVerify from "./images/logo-we-verify.png";
import Tutorial from "../NavItems/tutorial/tutorial";
import React from 'react';
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
import MySnackbar from "../MySnackbar/MySnackbar";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import Footer from "../Shared/Footer/Footer";
import FeedBack from "../FeedBack/FeedBack";
import Icon from "@material-ui/core/Icon";

import toolIcon from "./images/navbar/tools-off.png"
import tutorialIcon from "./images/navbar/tutorial-off.png"
import classRoomIcon from "./images/navbar/classroom-off.png"
import interactiveIcon from "./images/navbar/quiz-off.png"
import aboutIcon from "./images/navbar/about-off.png"
import ImageSearchIcon from '@material-ui/icons/ImageSearch';

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

import useLoadLanguage from "../../Hooks/useLoadLanguage";
import tsv from "../../LocalDictionary/components/NavBar.tsv";
import FactCheck from "../NavItems/FactCheck/FactCheck";
import Snackbar from "@material-ui/core/Snackbar";
import {setFalse, setTrue} from "../../redux/actions/cookiesActions";
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
            title: "navbar_analysis",
            icon: (drawerValue === 1) ? analysisIconOn : analysisIconOff,
            tsvPrefix: "api",
            path: "analysis",
        },
        {
            title: "navbar_keyframes",
            icon: (drawerValue === 2) ? keyframesIconOn : keyframesIconOff,
            tsvPrefix: "keyframes",
            path: "keyframes",
        },
        {
            title: "navbar_thumbnails",
            icon: (drawerValue === 3) ? thumbnailsIconOn : thumbnailsIconOff,
            tsvPrefix: "thumbnails",
            path: "thumbnails",
        },
        {
            title: "navbar_twitter",
            icon: (drawerValue === 4) ? twitterSearchIconOn : twitterSearchIconOff,
            tsvPrefix: "twitter",
            path: "twitter",
        },
        {
            title: "navbar_magnifier",
            icon: (drawerValue === 5) ? magnifierIconOn : magnifierIconOff,
            tsvPrefix: "magnifier",
            path: "magnifier",
        },
        {
            title: "navbar_metadata",
            icon: (drawerValue === 6) ? metadataIconOn : metadataIconOff,
            tsvPrefix: "metadata",
            path: "metadata",
        },
        {
            title: "navbar_rights",
            icon: (drawerValue === 7) ? videoRightsIconOn : videoRightsIconOff,
            tsvPrefix: "copyright",
            path: "copyright",
        },
        {
            title: "navbar_forensic",
            icon: (drawerValue === 8) ? forensicIconOn : forensicIconOff,
            tsvPrefix: "forensic",
            path: "forensic",
        },
        {
            title: "navbar_twitter_sna",
            icon: (drawerValue === 9) ? twitterSnaIconOn : twitterSnaIconOff,
            tsvPrefix: "twitter_sna",
            path: "twitterSna"
        },
        {
            title: "navbar_covidsearch",
            icon: (drawerValue === 10) ? covidSearchIconOn : covidSearchIconOff,
            tsvPrefix: "covidsearch",
            path: "covidSearch"
        },
        {
            title: "navbar_xnetwork",
            icon: (drawerValue === 11) ? xnetworkIconOn : xnetworkIconOff,
            tsvPrefix: "xnetwork",
            path: "xnetwork"
        }
    ];


    const tabItems = [
        {
            title: "navbar_tools",
            icon:
                <Icon classes={{root: classes.iconRootTab}} fontSize={"large"}>
                    <img className={classes.imageIconTab} src={toolIcon} alt={keyword("navbar_tools")} />
                </Icon>,
            content: <div/>,
            path: "tools",
            footer: <div/>,
        },
        {
            title: "navbar_tuto",
            icon:
                <Icon classes={{root: classes.iconRootTab}} fontSize={"large"}>
                    <img className={classes.imageIconTab} src={tutorialIcon} alt={keyword("navbar_tuto")}/>
                </Icon>,
            content: <Tutorial/>,
            path: "tutorial",
            footer: <Footer type={"afp"}/>
        },
        {
            title: "navbar_classroom",
            icon:
                <Icon classes={{root: classes.iconRootTab}} fontSize={"large"} color={'primary'}>
                    <img className={classes.imageIconTab} src={classRoomIcon} alt={keyword("navbar_classroom")} />
                </Icon>,
            content: <ClassRoom/>,
            path: "classroom",
            footer: <Footer type={"afp"}/>
        },
        {
            title: "navbar_quiz",
            icon:
                <Icon classes={{root: classes.iconRootTab}} fontSize={"large"}>
                    <img className={classes.imageIconTab} src={interactiveIcon} alt={keyword("navbar_quiz")} />
                </Icon>,
            content: <Interactive/>,
            path: "interactive",
            footer: <Footer type={"afp"}/>
        },
        {
            title: "navbar_factCheck",
            icon: <ImageSearchIcon fontSize={"large"}/>,
            content: <FactCheck/>,
            path: "factCheck",
            footer: <Footer type={"afp"}/>
        },
        {
            title: "navbar_about",
            icon:
                <Icon classes={{root: classes.iconRootTab}} fontSize={"large"}>
                    <img className={classes.imageIconTab} src={aboutIcon} alt={keyword("navbar_about")} />
                </Icon>,
            content: <About/>,
            path: "about",
            footer: <Footer type={"afp"}/>
        }
    ];

    const handleImageClick = () => {
        history.push("/app/tools/all");
    };

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
                                <ListItem button key={key} onClick={() => changeValue(key)}>
                                    <ListItemIcon color="primary.main">
                                        {
                                            (key === 0) ?
                                                item.icon
                                                :
                                                <Icon className={classes.iconRootDrawer} fontSize={"large"}>
                                                    <img className={classes.imageIconDrawer} src={item.icon} alt={keyword(item.title)}/>
                                                </Icon>
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
                <TabItem tabItems={tabItems} drawerItems={drawerItems}/>
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
                            <Button color={"secondary"} size={"small"} onClick={() => dispatch(setFalse())}> {keyword("cookies_decline")} </Button>,
                            <Button color={"primary"} size={"small"} onClick={() => dispatch(setTrue())}> {keyword("cookies_accept")} </Button>,
                        ]}
                    />
                    }
                <FeedBack/>
            </main>
        </div>
    );
};
export default NavBar;
