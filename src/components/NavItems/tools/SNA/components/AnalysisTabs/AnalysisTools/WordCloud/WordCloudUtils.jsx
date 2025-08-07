import React from "react";

import { entryAggregatorByListValue } from "../MostMentioned/MostMentionedUtils";
import { VisxWordcloud } from "./VisxWordcloud";

const MAX_WORDS = 100;

export const generateWordCloudGraphData = (selectedContent) => {
  const normalizedContent = selectedContent.map((entry) => ({
    ...entry,
    splitText: entry.text.toLowerCase().split(" "),
  }));

  let ret = entryAggregatorByListValue(normalizedContent, "splitText", "text");
  ret.sort((a, b) => b.count - a.count);

  return ret.slice(0, MAX_WORDS).map((w) => ({
    text: w.text,
    value: w.count,
    entries: w.entries,
  }));
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
