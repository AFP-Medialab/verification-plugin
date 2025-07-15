import React from "react";

const {
  generateAccountActivityChart,
} = require("../AccountActivity/AccountActivityUtils");

export const entryAggregatorByListValue = (
  selectedContent,
  listField,
  label,
) => {
  let aggregator = {};
  selectedContent.forEach((entry) => {
    if (!entry[listField].length > 0) return;
    entry[listField].forEach((listItemInitial) => {
      let listItem = listItemInitial.toLowerCase();
      if (aggregator[listItem]) {
        aggregator[listItem].count++;
        aggregator[listItem].entries.push(entry);
      } else {
        aggregator[listItem] = {
          count: 1,
          entries: [entry],
        };
        aggregator[listItem][label] = listItem;
      }
    });
  });

  let aggregatorSorted = Object.values(aggregator).sort(
    (a, b) => b.count - a.count,
  );

  return aggregatorSorted;
};

const generateMostMentionedGraphData = (selectedContent) => {
  return entryAggregatorByListValue(selectedContent, "mentions", "username");
};

const mostMentionedDetailDisplayHandler = (selectedContent, clickPayload) => {
  return clickPayload.entries;
};

export const generateMostMentionedGraph = (
  keyword,
  selectedContent,
  setMostMentionedGraph,
  setDetailContent,
  setOpenDetailModal,
  selected,
  dataSources,
) => {
  let mostMentionedGraphData = generateMostMentionedGraphData(selectedContent);
  if (mostMentionedGraphData.length === 0) return <></>;

  let mostMentionedGraph = generateAccountActivityChart(
    "username",
    true,
    mostMentionedGraphData,
    keyword,
    mostMentionedDetailDisplayHandler,
    "Mentions",
    setMostMentionedGraph,
    setDetailContent,
    setOpenDetailModal,
    selectedContent,
    selected,
    dataSources,
  );
  return mostMentionedGraph;
};
