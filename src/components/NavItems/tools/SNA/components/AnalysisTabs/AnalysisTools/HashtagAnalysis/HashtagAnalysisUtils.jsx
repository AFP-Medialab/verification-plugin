import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { generateAccountActivityChart } from "../AccountActivity/AccountActivityUtils";
import { generateCoorNetworkGraph } from "../COOR/CoorUtils";
import { entryAggregatorByListValue } from "../MostMentioned/MostMentionedUtils";

const setDetailModalContent = (selectedContent, clickPayload) => {
  return clickPayload.entries;
};

const generateCohashtagGraphData = (selectedContent) => {
  const nodes = {};

  const updateCohashtags = (hashtags, hashtag) => {
    hashtags
      .filter((h) => h != hashtag)
      .forEach((otherHashtag) => {
        if (nodes[hashtag].cohashtags[otherHashtag]) {
          nodes[hashtag].cohashtags[otherHashtag]++;
        } else {
          nodes[hashtag].cohashtags[otherHashtag] = 1;
        }
      });
  };

  selectedContent.forEach((entry) => {
    if (entry.hashtags.length === 0) return;
    let hashtags = entry.hashtags.map((h) => h.toLowerCase());

    hashtags.forEach((hashtag) => {
      if (nodes[hashtag]) {
        updateCohashtags(hashtags, hashtag);
        nodes[hashtag].entries.push(entry);
      } else {
        nodes[hashtag] = {
          id: hashtag,
          entries: [entry],
          cohashtags: {},
          displayName: hashtag,
        };
        updateCohashtags(hashtags, hashtag);
      }
    });
  });

  const edges = Object.values(nodes)
    .filter((n) => Object.keys(n.cohashtags).length > 0)
    .map((hashtag) =>
      Object.keys(hashtag.cohashtags).map((cohashtag) => ({
        source: hashtag.id,
        target: cohashtag,
      })),
    )
    .flat();

  return {
    nodes: Object.values(nodes),
    links: edges,
  };
};

export const generateHashtagAnalysisViz = (
  selectedContent,
  keyword,
  setHashtagBarChart,
  setDetailContent,
  setOpenDetailModal,
  selected,
  dataSources,
) => {
  let hashtagAnalysisData = entryAggregatorByListValue(
    selectedContent,
    "hashtags",
    "hashtag",
  );
  let hashtagAnalysisBarChart = generateAccountActivityChart(
    "hashtag",
    true,
    hashtagAnalysisData,
    keyword,
    setDetailModalContent,
    "Hashtags",
    setHashtagBarChart,
    setDetailContent,
    setOpenDetailModal,
    selectedContent,
    selected,
    dataSources,
  );

  let cohashtagGraphData = generateCohashtagGraphData(selectedContent);

  let cohashtagGraph = generateCoorNetworkGraph(
    cohashtagGraphData,
    setDetailContent,
    setOpenDetailModal,
  );

  return (
    <>
      {hashtagAnalysisBarChart}
      <Box p={2} />
      <Typography>{keyword("snaTools_hashtagGraphLabel")}</Typography>
      <Box p={2} />
      {cohashtagGraph}
    </>
  );
};
