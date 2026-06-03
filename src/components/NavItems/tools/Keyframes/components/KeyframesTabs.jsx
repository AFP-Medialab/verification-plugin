import React from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tab from "@mui/material/Tab";

import ConstructionIcon from "@mui/icons-material/Construction";
import LinkIcon from "@mui/icons-material/Link";

import { KeyframeInputType as TAB_VALUES } from "@/components/NavItems/tools/Keyframes/api/createKeyframeJob";
import { TabList } from "@mui/lab";

const KeyframesTabs = ({ value, onChange, keyword }) => (
  <Box>
    <TabList value={value} onChange={onChange} aria-label="keyframes tabs">
      <Tab
        icon={<LinkIcon />}
        iconPosition="start"
        label={keyword("linkmode_title")}
        value={TAB_VALUES.URL}
        sx={{ minWidth: "inherit !important", textTransform: "none" }}
      />
      <Tab
        icon={<ConstructionIcon />}
        iconPosition="start"
        label={keyword("filemode_title")}
        value={TAB_VALUES.FILE}
        sx={{ minWidth: "inherit", textTransform: "none" }}
      />
    </TabList>
    <Divider />
  </Box>
);

export default KeyframesTabs;
