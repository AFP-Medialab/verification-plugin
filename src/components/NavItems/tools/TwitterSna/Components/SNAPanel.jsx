import React from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import PropTypes from "prop-types";

import AccountActivity from "./AccountActivity";
import CoorPanel from "./CoorPanel";
import Hashtags from "./Hashtags";
import MostMentions from "./MostMentions";
import PropagationTimeline from "./PropagationTimeline";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const SNAPanel = (props) => {
  let SNATab = props.SNATab;
  let setSNATab = props.setSNATab;
  let propTimelineProps = props.propTimelineProps;
  let COORProps = props.coorProps;
  let mostMentionProps = props.mostMentionProps;
  let hashtagProps = props.hashtagProps;

  const handleChange = (event, newValue) => {
    setSNATab(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={SNATab}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Temporal distribution" {...a11yProps(0)} />
            <Tab label="Account activity" {...a11yProps(1)} />
            <Tab label="Coordinated behavior" {...a11yProps(2)} />
            <Tab label="Most mentioned users" {...a11yProps(3)} />
            <Tab label="Hashtag analysis" {...a11yProps(4)} />
            <Tab label="Text analysis" {...a11yProps(5)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={SNATab} index={0}>
          {PropagationTimeline(propTimelineProps)}
        </CustomTabPanel>
        <CustomTabPanel value={SNATab} index={1}>
          {AccountActivity(props.accountActivityProps)}
        </CustomTabPanel>
        <CustomTabPanel value={SNATab} index={2}>
          {CoorPanel(COORProps)}
        </CustomTabPanel>
        <CustomTabPanel value={SNATab} index={3}>
          {MostMentions(mostMentionProps)}
        </CustomTabPanel>
        <CustomTabPanel value={SNATab} index={4}>
          {Hashtags(hashtagProps)}
        </CustomTabPanel>
        <CustomTabPanel value={SNATab} index={5}>
          Item #6
        </CustomTabPanel>
      </Box>
    </>
  );
};

export default SNAPanel;
