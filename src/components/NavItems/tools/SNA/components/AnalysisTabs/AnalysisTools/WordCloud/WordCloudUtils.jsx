import React, { useState } from "react";

import stopwords from "stopwords-iso";

import { entryAggregatorByListValue } from "../MostMentioned/MostMentionedUtils";
import { VisxWordcloud } from "./VisxWordcloud";
import { STOP_WORDS_SET } from "./homemadeStopWords.js";

const MAX_WORDS = 100;

export const generateWordCloudGraphData = (selectedContent) => {
  const normalizedContent = selectedContent.map((entry) => ({
    ...entry,
    splitText: entry.text
      .toLowerCase()
      .split(/[\s'’,"]/)
      // here we want to exclude emoticones so we filter the words that dont contain neither letter or number
      .filter(
        (word) =>
          word.length > 1 &&
          /[a-z0-9à-ÿ]/.test(word) &&
          !STOP_WORDS_SET.has(word),
      ),
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
  const [language, setLanguage] = useState("en");

  console.log(stopwords[language]);

  const filteredWords = language
    ? wordCloudData?.filter((w) => !stopwords[language]?.includes(w.text))
    : wordCloudData;

  const setDetailFromWord = (word) => {
    setDetailContent(word.entries);
    setOpenDetailModal(true);
  };

  return (
    <VisxWordcloud
      words={filteredWords}
      wordClickFunction={setDetailFromWord}
      language={language}
      onLanguageChange={setLanguage}
    />
  );
};
