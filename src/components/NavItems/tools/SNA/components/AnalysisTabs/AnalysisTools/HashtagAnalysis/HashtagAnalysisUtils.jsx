import React from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AccountActivityChart } from "../AccountActivity/AccountActivityUtils";
import { CoorNetworkGraph } from "../COOR/CoorUtils";
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
      .filter((h) => h !== hashtag)
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

export const HashtagAnalysisViz = ({
  groupingFactor,
  onlyShowTop,
  setOnlyShowTop,
  activitySelect,
  setDetailContent,
  setOpenDetailModal,
  selected,
  dataSources,
  keyword,
  detailDisplayFilter,
  toolResult,
}) => {
  let barChartData = toolResult.barchart;
  let cohashtagGraphData = toolResult.graph;

  return (
    <Stack direction="row" spacing={2}>
      <AccountActivityChart
        groupingFactor={groupingFactor}
        onlyShowTop={onlyShowTop}
        setOnlyShowTop={setOnlyShowTop}
        activitySelect={activitySelect}
        setDetailContent={setDetailContent}
        setOpenDetailModal={setOpenDetailModal}
        selected={selected}
        dataSources={dataSources}
        detailDisplayFilter={detailDisplayFilter}
        activityChartData={barChartData}
      />
      <Typography>{keyword("snaTools_hashtagGraphLabel")}</Typography>
      <CoorNetworkGraph
        graphData={cohashtagGraphData}
        setDetailContent={setDetailContent}
        setOpenDetailModal={setOpenDetailModal}
      />
    </Stack>
  );
};
