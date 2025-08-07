import React from "react";

import { entryAggregatorByListValue } from "../MostMentioned/MostMentionedUtils";
import { VisxWordcloud } from "./VisxWordcloud";

const MAX_WORDS = 100;

export const generateWordCloudGraphData = (selectedContent) => {
  selectedContent.forEach(
    (entry) => (entry.splitText = entry.text.toLowerCase().split(" ")),
  );
  let ret = entryAggregatorByListValue(selectedContent, "splitText", "text");

  let wordCloudDataCleaned = ret.slice(0, MAX_WORDS);

  wordCloudDataCleaned.forEach((w) => (w.value = w.count));

  return wordCloudDataCleaned;
};

export const WordCloud = ({
  setDetailContent,
  setOpenDetailModal,
  wordCloudData,
}) => {
  const setDetailFromWord = (word) => {
    setDetailContent(word.entries);
    setOpenDetailModal(true);
  };

  return (
    <VisxWordcloud
      words={wordCloudData}
      wordClickFunction={setDetailFromWord}
    />
  );
};
