import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { generateAccountActivityChart } from "../AccountActivity/AccountActivityUtils";
import { generateCoorNetworkGraph } from "../COOR/CoorUtils";
import { entryAggregatorByListValue } from "../MostMentioned/MostMentionedUtils";

export const hashtagAnalysisDetailModalContent = (
  selectedContent,
  clickPayload,
) => {
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
    if (!entry.hashtags) return;
    if (entry.hashtags?.length === 0) return;
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

export const generateHashtagAnalysisBarChartData = (selectedContent) => {
  return entryAggregatorByListValue(selectedContent, "hashtags", "hashtag");
};

export const generateHashtagAnalysisData = (selectedContent) => {
  try {
    let barchart = generateHashtagAnalysisBarChartData(selectedContent);
    let graph = generateCohashtagGraphData(selectedContent);
    if (barchart.length === 0) return [];
    return {
      barchart: barchart,
      graph: graph,
    };
  } catch {
    throw Error();
  }
};

export const generateHashtagAnalysisViz = (vizArgs, toolResult) => {
  let keyword = vizArgs.barChart.keyword;

  let barChartData = toolResult.barchart;
  let cohashtagGraphData = toolResult.graph;

  let hashtagAnalysisBarChart = generateAccountActivityChart(
    vizArgs.barChart,
    barChartData,
  );

  let cohashtagGraph = generateCoorNetworkGraph(
    cohashtagGraphData,
    vizArgs.networkGraph,
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
