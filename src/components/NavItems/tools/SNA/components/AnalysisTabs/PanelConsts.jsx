import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { getSelectedSourcesContent } from "../../utils/accessSavedCollections";

export const SNAPanelTab = (props) => {
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
};

export const snaPanelTabProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

export const analysisTools = {
  timelineDistribution: {
    keywordLabel: "snaTools_timelineDistribution",
    propKey: "timelineDistribution",
    component: (essentialProps, toolDisplayProps, toolAnalysisProps) =>
      analysisDisplayTemplate(
        essentialProps,
        toolDisplayProps,
        toolAnalysisProps,
      ),
  },
  accountActivity: {
    keywordLabel: "snaTools_accountActivity",
    propKey: "accountActivity",
    component: (essentialProps, toolDisplayProps, toolAnalysisProps) =>
      analysisDisplayTemplate(
        essentialProps,
        toolDisplayProps,
        toolAnalysisProps,
      ),
  },
  coorDetection: {
    keywordLabel: "snaTools_coorDetection",
    propKey: "coor",
    component: (essentialProps, toolDisplayProps, toolAnalysisProps) =>
      analysisDisplayTemplate(
        essentialProps,
        toolDisplayProps,
        toolAnalysisProps,
      ),
  },
  mostMentioned: {
    keywordLabel: "snaTools_mostMentioned",
    propKey: "mostMentioned",
    component: (essentialProps, toolDisplayProps, toolAnalysisProps) =>
      analysisDisplayTemplate(
        essentialProps,
        toolDisplayProps,
        toolAnalysisProps,
      ),
  },
  hashtagAnalysis: {
    keywordLabel: "snaTools_hashtagAnalysis",
    propKey: "hashtagAnalysis",
    component: (essentialProps, toolDisplayProps, toolAnalysisProps) =>
      analysisDisplayTemplate(
        essentialProps,
        toolDisplayProps,
        toolAnalysisProps,
      ),
  },
  wordCloud: {
    keywordLabel: "snaTools_wordCloud",
    propKey: "wordCloud",
    component: (essentialProps, toolDisplayProps, toolAnalysisProps) =>
      analysisDisplayTemplate(
        essentialProps,
        toolDisplayProps,
        toolAnalysisProps,
      ),
  },
  textClusters: {
    keywordLabel: "snaTools_textClusters",
    propKey: "textClusters",
    component: (essentialProps, toolDisplayProps, toolAnalysisProps) =>
      analysisDisplayTemplate(
        essentialProps,
        toolDisplayProps,
        toolAnalysisProps,
      ),
  },
};
/**
 *
 * @param {*} essentialProps includes keyword, dataSources, selected
 * @param {*} toolDisplayProps includes toolDescription, toolButtonText, toolSettings, toolLoading
 * @param {*} toolAnalysisProps includes analysisFunction, analysisFunctionArgs, vizFunction, vizFunctionArgs, toolResult, setToolResult
 * @returns jsx fragment
 *
 * Fills a template with descrpition of an SNA tool
 * the settings for the tool when applicable (such as which field to choose in COOR)
 * and the result display
 */
export const analysisDisplayTemplate = (
  { keyword, dataSources, selected },
  {
    toolSettings,
    toolDescription,
    toolButtonText,
    toolLoading,
    setToolLoading,
    errorMessage,
    setErrorMessage,
  },
  { analysisFunction, analysisArgs, toolResult, setToolResult, toolVizResult },
) => {
  const generateResult = async () => {
    setErrorMessage("");
    setToolLoading(true);
    let selectedContent = getSelectedSourcesContent(dataSources, selected);
    try {
      let result = await analysisFunction(selectedContent, analysisArgs);
      if (Array.isArray(result) && result.length == 0) {
        setErrorMessage("snaTools_noResultMessage");
      } else {
        setToolResult(result);
      }
    } catch {
      setErrorMessage("snaTools_analysisErrorMessage");
    } finally {
      setToolLoading(false);
    }
  };

  const ToolVizResult = React.memo(function ToolVizResult({ result }) {
    return toolVizResult({ result });
  });

  return (
    <>
      <Stack direction="column" spacing={2} key={"toolTab_" + toolDescription}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ padding: 2 }}>
            {keyword(toolDescription)}
          </Typography>
          <Button variant="outlined" onClick={() => generateResult()}>
            {keyword(toolButtonText)}
          </Button>
        </Stack>
        {toolSettings ? toolSettings.display(toolSettings.args) : <></>}
        {toolLoading ? (
          <Box
            sx={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : toolResult && errorMessage.length == 0 ? (
          <ToolVizResult result={toolResult} />
        ) : (
          <Typography>{keyword(errorMessage)}</Typography>
        )}
      </Stack>
    </>
  );
};
