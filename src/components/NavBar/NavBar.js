import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BuildIcon from '@material-ui/icons/Build';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import GroupIcon from '@material-ui/icons/Group';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Toolbar from "@material-ui/core/Toolbar";

import {useSelector} from "react-redux";
import Languages from "../languages/languages";

import logoInvid from "./images/logo-invid.png";
import logoWeVerify from "./images/logo-we-verify.png";
import Tutorial from "../tutorial/tutorial";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    logoLeft: {
        marginRight: theme.spacing(2),
        maxHeight: "60px",
    },
    logoRight: {
        marginLeft: theme.spacing(2),
        maxHeight: "70px",
    }
}));

const NavBar = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState(1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default" title={logoInvid}>
                <Toolbar>
                    <Box display={{xs: 'none', md: 'block'}}>
                        <img src={logoInvid} alt="logo" className={classes.logoLeft}/>
                    </Box>
                    <div className={classes.grow}/>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="scrollable force tabs example"
                    >
                        <Tab label={keyword("navbar_tools")} icon={<BuildIcon/>} {...a11yProps(0)} />
                        <Tab label={keyword("navbar_tuto")} icon={<VideoLibraryIcon/>} {...a11yProps(1)} />
                        <Tab label={keyword("navbar_classroom")} icon={<GroupIcon/>} {...a11yProps(2)} />
                        <Tab label={keyword("navbar_quiz")} icon={<VideogameAssetIcon/>} {...a11yProps(3)} />
                        <Tab label={keyword("navbar_about")} icon={<InfoIcon/>} {...a11yProps(4)} />
                    </Tabs>
                    <div className={classes.grow}/>
                    <Languages/>
                    <Box display={{xs: 'none', md: 'block'}}>
                        <img src={logoWeVerify} alt="logo" className={classes.logoRight}/>
                    </Box>
                </Toolbar>
            </AppBar>
            <TabPanel value={value} index={0}>
                Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Tutorial/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>
            <TabPanel value={value} index={3}>
                Item Four
            </TabPanel>
            <TabPanel value={value} index={4}>
                Item Five
            </TabPanel>
            <TabPanel value={value} index={5}>
                Item Six
            </TabPanel>
            <TabPanel value={value} index={6}>
                Item Seven
            </TabPanel>
        </div>
    );
};
export default NavBar;