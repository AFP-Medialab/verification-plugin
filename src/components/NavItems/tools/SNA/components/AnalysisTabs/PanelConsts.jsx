import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SNAButton } from "../../utils/SNAButton";
import AccountActivity from "./AnalysisTools/AccountActivity/AccountActivity";
import COOR from "./AnalysisTools/COOR/COOR";
import HashtagAnalysis from "./AnalysisTools/HashtagAnalysis/HashtagAnalysis";
import MostMentioned from "./AnalysisTools/MostMentioned/MostMentioned";
import TextClusters from "./AnalysisTools/TextClusters/TextClusters";
import TimelineDistribution from "./AnalysisTools/Timeline/TimelineDistribution";
import WordCloud from "./AnalysisTools/WordCloud/WordCloud";

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
    component: (props) => TimelineDistribution(props),
  },
  accountActivity: {
    keywordLabel: "snaTools_accountActivity",
    propKey: "accountActivity",
    component: (props) => AccountActivity(props),
  },
  coorDetection: {
    keywordLabel: "snaTools_coorDetection",
    propKey: "coor",
    component: (props) => COOR(props),
  },
  mostMentioned: {
    keywordLabel: "snaTools_mostMentioned",
    propKey: "mostMentioned",
    component: (props) => MostMentioned(props),
  },
  hashtagAnalysis: {
    keywordLabel: "snaTools_hashtagAnalysis",
    propKey: "hashtagAnalysis",
    component: (props) => HashtagAnalysis(props),
  },
  wordCloud: {
    keywordLabel: "snaTools_wordCloud",
    propKey: "wordCloud",
    component: (props) => WordCloud(props),
  },
  textClusters: {
    keywordLabel: "snaTools_textClusters",
    propKey: "textClusters",
    component: (props) => TextClusters(props),
  },
};

export const analysisDisplayTemplate = (
  keyword,
  toolDescription,
  toolButtonText,
  toolSettings,
  toolButtonFunction,
  toolResult,
) => {
  return (
    <>
      <Box>
        <Box p={2}></Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography pl={2}>{keyword(toolDescription)}</Typography>
          {SNAButton(() => toolButtonFunction(), keyword(toolButtonText))}
        </Stack>
        <Box p={2} />
        {toolSettings}
        {toolResult}
      </Box>
    </>
  );
};
