import {makeStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BuildIcon from '@material-ui/icons/Build';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import CastForEducationIcon from '@material-ui/icons/CastForEducation';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import InfoIcon from '@material-ui/icons/Info';
import Box from '@material-ui/core/Box';
import {useDispatch, useSelector} from "react-redux";
import Languages from "../languages/languages";
import logoInvid from "./images/logo-invid.png";
import logoWeVerify from "./images/logo-we-verify.png";
import Tutorial from "../tutorial/tutorial";
import Fade from "@material-ui/core/Fade";
import {Container} from "@material-ui/core";
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
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import TheatersIcon from '@material-ui/icons/Theaters';
import YouTubeIcon from '@material-ui/icons/YouTube';
import TwitterIcon from '@material-ui/icons/Twitter';
import SearchIcon from '@material-ui/icons/Search';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import CopyrightIcon from '@material-ui/icons/Copyright';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import Analysis from "../tools/analysis/Analysis";
import Keyframes from "../tools/Keyframes/Keyframes";
import ScrollTop from "../ScrollTop/ScrollTop";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Thumbnails from "../tools/Thumbnails/Thumbnails";
import TwitterAdvancedSearch from "../tools/TwitterAdvancedSearch/TwitterAdvancedSearch";
import Magnifier from "../tools/Magnifier/Magnifier";
import Metadata from "../tools/Metadata/Metadata";
import VideoRights from "../tools/VideoRights/VideoRights";
import Forensic from "../tools/Forensic/Forensic";
import AllTools from "../tools/Alltools/AllTools";
import {Link, Route, Switch} from 'react-router-dom'
import history from '../History/History';
import {selectPage, selectTool} from "../../redux/actions";
import TabItem from "./TabItem/TabItem";

const drawerWidth = 200;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    logoLeft: {
        marginRight: theme.spacing(2),
        maxHeight: "60px",
    },
    logoRight: {
        marginLeft: theme.spacing(2),
        maxHeight: "70px",
    },
    grow: {
        flexGrow: 1,
    },
    selectedApp: {
        color: theme.palette.primary.main
    },
    unSelectedApp: {}
}));


function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const NavBar = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const tabValue = useSelector(state => state.nav);
    const drawerValue = useSelector(state => state.tool);
    const dispatch = useDispatch();


    const handleChange = (event, newValue) => {
        dispatch(selectPage(newValue));
        if (tabItems[newValue].path === "tools")
            history.push("/app/tools/" + drawerItems[newValue].path)
        else
            history.push("/app/" + tabItems[newValue].path)
    };

    const changeValue = (newValue) => {
        dispatch(selectTool(newValue));
        history.push("/app/tools/" + drawerItems[newValue].path)
    };

    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

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
            icon: <PlayCircleOutlineIcon fontSize={"large"}
                                         className={(drawerValue === 1) ? classes.selectedApp : classes.unSelectedApp}/>,
            tsvPrefix: "api",
            path: "analysis",
        },
        {
            title: "navbar_keyframes",
            icon: <TheatersIcon fontSize={"large"}
                                className={(drawerValue === 2) ? classes.selectedApp : classes.unSelectedApp}/>,
            tsvPrefix: "keyframes",
            path: "keyframes",
        },
        {
            title: "navbar_thumbnails",
            icon: <YouTubeIcon fontSize={"large"}
                               className={(drawerValue === 3) ? classes.selectedApp : classes.unSelectedApp}/>,
            tsvPrefix: "thumbnails",
            path: "thumbnails",
        },
        {
            title: "navbar_twitter",
            icon: <TwitterIcon fontSize={"large"}
                               className={(drawerValue === 4) ? classes.selectedApp : classes.unSelectedApp}/>,
            tsvPrefix: "twitter",
            path: "twitter",
        },
        {
            title: "navbar_magnifier",
            icon: <SearchIcon fontSize={"large"}
                              className={(drawerValue === 5) ? classes.selectedApp : classes.unSelectedApp}/>,
            tsvPrefix: "magnifier",
            path: "magnifier",
        },
        {
            title: "navbar_metadata",
            icon: <SubscriptionsIcon fontSize={"large"}
                                     className={(drawerValue === 6) ? classes.selectedApp : classes.unSelectedApp}/>,
            tsvPrefix: "metadata",
            path: "metadata",
        },
        {
            title: "navbar_rights",
            icon: <CopyrightIcon fontSize={"large"}
                                 className={(drawerValue === 7) ? classes.selectedApp : classes.unSelectedApp}/>,
            tsvPrefix: "copyright",
            path: "copyright",
        },
        {
            title: "navbar_forensic",
            icon: <ImageSearchIcon fontSize={"large"}
                                   className={(drawerValue === 8) ? classes.selectedApp : classes.unSelectedApp}/>,
            tsvPrefix: "forensic",
            path: "forensic",
        }
    ];


    const tabItems = [
        {
            title: "navbar_tools",
            icon: <BuildIcon fontSize={"large"}/>,
            content: <div/>,
            path: "tools",
        },
        {
            title: "navbar_tuto",
            icon: <VideoLibraryIcon fontSize={"large"}/>,
            content: <Tutorial/>,
            path: "tutorial",
        },
        {
            title: "navbar_classroom",
            icon: <CastForEducationIcon fontSize={"large"}/>,
            content: <div>classroom</div>,
            path: "classroom",
        },
        {
            title: "navbar_quiz",
            icon: <VideogameAssetIcon fontSize={"large"}/>,
            content: <div>Iinteractive</div>,
            path: "interactive",
        },
        {
            title: "navbar_about",
            icon: <InfoIcon fontSize={"large"}/>,
            content: <div>About</div>,
            path: "about",
        }
    ];

    const drawerItemsContent = [
        {
            content: <AllTools tools={drawerItems}/>,
        },
        {
            content: <Analysis/>,
        },
        {
            content: <Keyframes/>,
        },
        {
            content: <Thumbnails/>,
        },
        {
            content: <TwitterAdvancedSearch/>,
        },
        {
            content: <Magnifier/>,
        },
        {
            content: <Metadata/>,
        },
        {
            content: <VideoRights/>,
        },
        {
            content: <Forensic/>,
        }
    ];


    return (
        <div className={classes.root}>
            <AppBar position="fixed" color="default" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Box display={{xs: 'none', md: 'block'}}>
                        <img src={logoInvid} alt="logo" className={classes.logoLeft}/>
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
                                return <Tab key={index} label={keyword(item.title)}
                                            icon={item.icon} {...a11yProps(index)}/>
                            })
                        }
                    </Tabs>
                    <div className={classes.grow}/>
                    <Languages/>
                    <Box display={{xs: 'none', md: 'block'}}>
                        <img src={logoWeVerify} alt="logo" className={classes.logoRight}/>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer hidden={tabValue !== 0 ||  (tabValue === 0 && drawerValue === 0)}
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
                                        {item.icon}
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
                <Switch>
                    <Route path={"/app/:tab"}>
                        <TabItem tabItems={tabItems} drawerItems={drawerItems} drawerItemsContent={drawerItemsContent}/>
                    </Route>
                    <Route>
                        {
                            "Not Found"
                        }
                    </Route>
                </Switch>
                <ScrollTop {...props}>
                    <Fab color="secondary" size="small" aria-label="scroll back to top">
                        <KeyboardArrowUpIcon/>
                    </Fab>
                </ScrollTop>
            </main>
        </div>
    );
};
export default NavBar;
