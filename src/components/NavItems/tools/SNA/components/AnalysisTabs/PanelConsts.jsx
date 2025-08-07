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
    component: (props) => <AnalysisDisplayTemplate {...props} />,
  },
  accountActivity: {
    keywordLabel: "snaTools_accountActivity",
    propKey: "accountActivity",
    component: (props) => <AnalysisDisplayTemplate {...props} />,
  },
  coorDetection: {
    keywordLabel: "snaTools_coorDetection",
    propKey: "coor",
    component: (props) => <AnalysisDisplayTemplate {...props} />,
  },
  mostMentioned: {
    keywordLabel: "snaTools_mostMentioned",
    propKey: "mostMentioned",
    component: (props) => <AnalysisDisplayTemplate {...props} />,
  },
  hashtagAnalysis: {
    keywordLabel: "snaTools_hashtagAnalysis",
    propKey: "hashtagAnalysis",
    component: (props) => <AnalysisDisplayTemplate {...props} />,
  },
  wordCloud: {
    keywordLabel: "snaTools_wordCloud",
    propKey: "wordCloud",
    component: (props) => <AnalysisDisplayTemplate {...props} />,
  },
  textClusters: {
    keywordLabel: "snaTools_textClusters",
    propKey: "textClusters",
    component: (props) => <AnalysisDisplayTemplate {...props} />,
  },
};
/**
 *
 * @param {*} props includes essentialProps, toolDisplayProps, toolAnalysisProps
 * @returns jsx fragment
 *
 * Fills a template with description of an SNA tool
 * the settings for the tool when applicable (such as which field to choose in COOR)
 * and the result display
 */
export const AnalysisDisplayTemplate = ({
  essentialProps,
  toolDisplayProps,
  toolAnalysisProps,
}) => {
  const { keyword, dataSources, selected } = essentialProps;
  const {
    toolSettings,
    toolDescription,
    toolButtonText,
    toolLoading,
    setToolLoading,
    errorMessage,
    setErrorMessage,
  } = toolDisplayProps;
  const {
    analysisFunction,
    analysisArgs,
    toolResult,
    setToolResult,
    ToolVizResult,
  } = toolAnalysisProps;

  const generateResult = async () => {
    setErrorMessage("");
    setToolLoading(true);
    let selectedContent = getSelectedSourcesContent(dataSources, selected);
    try {
      let result = await analysisFunction(selectedContent, analysisArgs);
      if (Array.isArray(result) && result.length === 0) {
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
        ) : toolResult && errorMessage.length === 0 ? (
          <ToolVizResult result={toolResult} />
        ) : (
          <Typography>{keyword(errorMessage)}</Typography>
        )}
      </Stack>
    </>
  );
};
