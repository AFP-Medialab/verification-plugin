import React from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { SNAPanelTab, analysisTools, snaPanelTabProps } from "./PanelConsts";

const SNAPanel = (snaPanelProps) => {
  let snaTab = snaPanelProps.snaTab;
  let setSnaTab = snaPanelProps.setSnaTab;
  let keyword = snaPanelProps.keyword;
  let analysisToolsProps = snaPanelProps.analysisToolsProps;
  let essentialProps = snaPanelProps.analysisToolsProps.essentialProps;

  const switchTabs = (event, newValue) => {
    setSnaTab(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={snaTab}
            onChange={switchTabs}
            aria-label="sna tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            {Object.values(analysisTools).map((tool, idx) => (
              <Tab
                key={"toolTab_" + idx}
                label={keyword(tool.keywordLabel)}
                {...snaPanelTabProps(idx)}
              />
            ))}
          </Tabs>
        </Box>
        {Object.values(analysisTools).map((tool, idx) => {
          let toolDisplayProps =
            analysisToolsProps[tool.propKey].toolDisplayProps;
          let toolAnalysisProps =
            analysisToolsProps[tool.propKey].toolAnalysisProps;

          return (
            <SNAPanelTab key={"snaPanel_" + idx} value={snaTab} index={idx}>
              {tool.component(
                essentialProps,
                toolDisplayProps,
                toolAnalysisProps,
              )}
            </SNAPanelTab>
          );
        })}
      </Box>
    </>
  );
};

export default SNAPanel;
