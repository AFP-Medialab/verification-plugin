import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import {useSelector} from "react-redux";
import Analysis from "../analysis/Analysis";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
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
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 224,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function VerticalTabs() {
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
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                className={classes.tabs}
            >
                <Tab label={keyword("navbar_analysis")} icon={<PlayCircleOutlineIcon fontSize={"large"}/>} {...a11yProps(0)} />
                <Tab label={keyword("navbar_keyframes")} icon={<TheatersIcon fontSize={"large"}/>} {...a11yProps(1)} />
                <Tab label={keyword("navbar_thumbnails")} icon={<YouTubeIcon fontSize={"large"}/>} {...a11yProps(2)} />
                <Tab label={keyword("navbar_twitter")} icon={<TwitterIcon fontSize={"large"}/>} {...a11yProps(3)} />
                <Tab label={keyword("navbar_magnifier")} icon={<SearchIcon fontSize={"large"}/>} {...a11yProps(4)} />
                <Tab label={keyword("navbar_metadata")} icon={<SubscriptionsIcon fontSize={"large"}/>} {...a11yProps(5)} />
                <Tab label={keyword("navbar_rights")} icon={<CopyrightIcon fontSize={"large"}/>} {...a11yProps(6)} />
                <Tab label={keyword("navbar_forensic")} icon={<ImageSearchIcon fontSize={"large"}/>} {...a11yProps(7)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <div>
                    <Analysis/>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
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
            <TabPanel value={value} index={7}>
                Item Height
            </TabPanel>
        </div>
    );
}