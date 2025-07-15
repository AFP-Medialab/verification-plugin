import React from "react";
import ReactWordcloud from "react-wordcloud";

const {
  entryAggregatorByListValue,
} = require("../MostMentioned/MostMentionedUtils");

const MAX_WORDS = 100;

const wordCloudGraphOptions = {
  enableTooltip: true,
  deterministic: true,
  fontFamily: "impact",
  fontSizes: [15, 30],
  fontStyle: "normal",
  fontWeight: "normal",
  padding: 1,
  rotations: 3,
  rotationAngles: [15, -15],
  scale: "sqrt",
  spiral: "rectangular",
  transitionDuration: 1000,
};

const generateWordCloudGraphData = (selectedContent) => {
  selectedContent.forEach(
    (entry) => (entry.splitText = entry.text.toLowerCase().split(" ")),
  );
  let ret = entryAggregatorByListValue(selectedContent, "splitText", "text");
  return ret;
};

export const generateWordCloud = (
  selectedContent,
  setDetailContent,
  setOpenDetailModal,
) => {
  let wordCloudData = generateWordCloudGraphData(selectedContent);

  let wordCloudDataCleaned = wordCloudData.slice(0, MAX_WORDS);

  wordCloudDataCleaned.forEach((w) => (w.value = w.count));

  const setDetailFromWord = {
    onWordClick: (word) => {
      setDetailContent(word.entries);
      setOpenDetailModal(true);
    },
  };

  let wordCloudGraph = (
    <ReactWordcloud
      words={wordCloudDataCleaned}
      options={wordCloudGraphOptions}
      callbacks={setDetailFromWord}
    />
  );

  return wordCloudGraph;
};
