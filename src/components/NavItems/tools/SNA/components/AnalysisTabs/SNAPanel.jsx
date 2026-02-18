import React from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import PropTypes from "prop-types";

import { SNAPanelTab, analysisTools, snaPanelTabProps } from "./PanelConsts";

const SNAPanel = ({ snaTab, setSnaTab, keyword, analysisToolsProps }) => {
  const essentialProps = analysisToolsProps?.essentialProps ?? {};

  const switchTabs = (event, newValue) => {
    setSnaTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={snaTab ?? 0}
          onChange={switchTabs}
          aria-label="sna tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {Object.values(analysisTools).map((tool, idx) => (
            <Tab
              key={tool.propKey}
              label={keyword(tool.keywordLabel)}
              {...snaPanelTabProps(idx)}
            />
          ))}
        </Tabs>
      </Box>
      {Object.values(analysisTools).map((tool, idx) => {
        const toolProps = analysisToolsProps?.[tool.propKey] || {};
        let toolDisplayProps = toolProps.toolDisplayProps;
        let toolAnalysisProps = toolProps.toolAnalysisProps;
        const ToolComponent = tool.component;

        return (
          <SNAPanelTab key={tool.propKey} value={snaTab ?? 0} index={idx}>
            <ToolComponent
              essentialProps={essentialProps}
              toolDisplayProps={toolDisplayProps}
              toolAnalysisProps={toolAnalysisProps}
            />
          </SNAPanelTab>
        );
      })}
    </Box>
  );
};

SNAPanel.propTypes = {
  snaTab: PropTypes.number,
  setSnaTab: PropTypes.func.isRequired,
  keyword: PropTypes.func.isRequired,
  analysisToolsProps: PropTypes.object,
};

export default SNAPanel;
