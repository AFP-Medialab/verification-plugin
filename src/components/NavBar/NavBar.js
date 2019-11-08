import {makeStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BuildIcon from '@material-ui/icons/Build';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import CastForEducationIcon from '@material-ui/icons/CastForEducation';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import InfoIcon from '@material-ui/icons/Info';
import Box from '@material-ui/core/Box';
import {useSelector} from "react-redux";
import Languages from "../languages/languages";
import logoInvid from "./images/logo-invid.png";
import logoWeVerify from "./images/logo-we-verify.png";
import Tutorial from "../tutorial/tutorial";
import Fade from "@material-ui/core/Fade";
import {Container} from "@material-ui/core";
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
    unSelectedApp: {
    }
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

    const [tabValue, setTabValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const [drawerValue, setDrawerValue] = React.useState(0);
    const changeValue = (newValue) => {
        setDrawerValue(newValue);
    };

    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const tabItems = [
        {
            title: "navbar_tools",
            icon: <BuildIcon fontSize={"large"}/>,
            content: <div/>
        },
        {
            title: "navbar_tuto",
            icon: <VideoLibraryIcon fontSize={"large"}/>,
            content: <Tutorial/>
        },
        {
            title: "navbar_classroom",
            icon: <CastForEducationIcon fontSize={"large"}/>,
            content: <div>classroom</div>
        },
        {
            title: "navbar_quiz",
            icon: <VideogameAssetIcon fontSize={"large"}/>,
            content: <div>Iinteractive</div>
        },
        {
            title: "navbar_about",
            icon: <InfoIcon fontSize={"large"}/>,
            content: <div>About</div>
        }
    ];

    const drawerItems = [
        {
            title: "",
            icon: <AppsIcon fontSize={"large"} className={(drawerValue === 0)? classes.selectedApp : classes.unSelectedApp}/>,
            content: <div>all apps</div>
        },
        {
            title: "navbar_analysis",
            icon: <PlayCircleOutlineIcon fontSize={"large"} className={(drawerValue === 1)? classes.selectedApp : classes.unSelectedApp}/>,
            content: <Analysis/>
        },
        {
            title: "navbar_keyframes",
            icon: <TheatersIcon fontSize={"large"} className={(drawerValue === 2)? classes.selectedApp : classes.unSelectedApp}/>,
            content: <Keyframes/>
        },
        {
            title: "navbar_thumbnails",
            icon: <YouTubeIcon fontSize={"large"} className={(drawerValue === 3)? classes.selectedApp : classes.unSelectedApp}/>,
            content: <Thumbnails/>
        },
        {
            title: "navbar_twitter",
            icon: <TwitterIcon fontSize={"large"} className={(drawerValue === 4)? classes.selectedApp : classes.unSelectedApp}/>,
            content: <TwitterAdvancedSearch/>
        },
        {
            title: "navbar_magnifier",
            icon: <SearchIcon fontSize={"large"} className={(drawerValue === 5)? classes.selectedApp : classes.unSelectedApp}/>,
            content: <Magnifier/>
        },
        {
            title: "navbar_metadata",
            icon: <SubscriptionsIcon fontSize={"large"} className={(drawerValue === 6)? classes.selectedApp : classes.unSelectedApp}/>,
            content: <div>Metadada</div>
        },
        {
            title: "navbar_rights",
            icon: <CopyrightIcon fontSize={"large"} className={(drawerValue === 7)? classes.selectedApp : classes.unSelectedApp}/>,
            content: <div>Copyrights</div>
        },
        {
            title: "navbar_forensic",
            icon: <ImageSearchIcon fontSize={"large"} className={(drawerValue === 8)? classes.selectedApp : classes.unSelectedApp}/>,
            content: <div>Forensic</div>
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
            <Drawer hidden={tabValue !== 0}
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
                                    <ListItemIcon color="primary.main" >
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
                <div className={classes.toolbar}  id="back-to-top-anchor"/>
                {
                    tabValue !== 0 &&
                    tabItems.map((item, index) => {
                        return (
                            <Container key={index} value={index} hidden={tabValue !== index}>
                                <Fade in={tabValue === index}>
                                    <div>
                                        {item.content}
                                    </div>
                                </Fade>
                            </Container>
                        );
                    })
                }
                {
                    tabValue === 0 &&
                    drawerItems.map((item, index) => {
                        return (
                            <Container key={index} value={index} hidden={drawerValue !== index}>
                                <Fade in={drawerValue === index}>
                                    <div>
                                        {item.content}
                                    </div>
                                </Fade>
                            </Container>
                        );
                    })
                }
                <ScrollTop {...props}>
                    <Fab color="secondary" size="small" aria-label="scroll back to top">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </ScrollTop>
            </main>
        </div>
    );
};
export default NavBar;
