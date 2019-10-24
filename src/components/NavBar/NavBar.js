import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BuildIcon from '@material-ui/icons/Build';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import CastForEducationIcon from '@material-ui/icons/CastForEducation';
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
import Fade from "@material-ui/core/Fade";
import ToolsMenu from "../tools/ToolsMenu/ToolsMenu";
import {Container} from "@material-ui/core";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <Container
            maxWidth={"xl"}
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {children}
        </Container>
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
    const [value, setValue] = React.useState(0);

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
            <AppBar position="static" color="default">
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
                        <Tab label={keyword("navbar_tools")} icon={<BuildIcon fontSize={"large"}/>} {...a11yProps(0)} />
                        <Tab label={keyword("navbar_tuto")} icon={<VideoLibraryIcon fontSize={"large"}/>} {...a11yProps(1)} />
                        <Tab label={keyword("navbar_classroom")} icon={<CastForEducationIcon fontSize={"large"}/>} {...a11yProps(2)} />
                        <Tab label={keyword("navbar_quiz")} icon={<VideogameAssetIcon fontSize={"large"}/>} {...a11yProps(3)} />
                        <Tab label={keyword("navbar_about")} icon={<InfoIcon fontSize={"large"}/>} {...a11yProps(4)} />
                    </Tabs>
                    <div className={classes.grow}/>
                    <Languages/>
                    <Box display={{xs: 'none', md: 'block'}}>
                        <img src={logoWeVerify} alt="logo" className={classes.logoRight}/>
                    </Box>
                </Toolbar>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Fade in={value === 0}>
                    <div>
                        <ToolsMenu/>
                    </div>
                </Fade>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Fade in={value === 1}>
                    <div>
                        <Tutorial/>
                    </div>
                </Fade>
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