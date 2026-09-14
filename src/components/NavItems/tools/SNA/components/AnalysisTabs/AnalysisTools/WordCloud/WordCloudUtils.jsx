import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setSNAWordCloudLanguages } from "@/redux/reducers/tools/snaDataReducer";
import { eld } from "eld/small";
import stopwords from "stopwords-iso";

import { entryAggregatorByListValue } from "../MostMentioned/MostMentionedUtils";
import { VisxWordcloud } from "./VisxWordcloud";
import { STOP_WORDS_SET } from "./homemadeStopWords.js";

const MAX_WORDS = 100;

const LIMIT_TO_BE_COUNTED = 5;

const STOPWORDS_LANGS = new Set(Object.keys(stopwords));

/**
 * Detects languages present in the dataset.
 * Returns ISO 639-1 codes that both eld recognised reliably and have stopwords-iso coverage.
 */
const detectDatasetLanguages = (selectedContent) => {
  const counts = new Map();
  for (const entry of selectedContent) {
    if (!entry.text) continue;
    const result = eld.detect(entry.text);
    if (
      result.language &&
      result.isReliable() &&
      STOPWORDS_LANGS.has(result.language)
    ) {
      counts.set(result.language, (counts.get(result.language) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, n]) => n > LIMIT_TO_BE_COUNTED)
    .map(([lang]) => lang);
};

export const generateWordCloudGraphData = (selectedContent) => {
  const normalizedContent = selectedContent.map((entry) => ({
    ...entry,
    splitText: entry.text
      .toLowerCase()
      .split(/[\s'',"]/)
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

  const words = ret.slice(0, MAX_WORDS).map((w) => ({
    text: w.text,
    value: w.count,
    entries: w.entries,
  }));

  const detectedLanguages = detectDatasetLanguages(selectedContent);

  return { words, detectedLanguages };
};

export const WordCloud = ({
  setDetailContent,
  setOpenDetailModal,
  wordCloudData,
}) => {
  const dispatch = useDispatch();
  const languages = useSelector((state) => state.snaData.languages);

  useEffect(() => {
    if (wordCloudData?.detectedLanguages) {
      dispatch(setSNAWordCloudLanguages(wordCloudData.detectedLanguages));
    }
  }, [wordCloudData]);

  const words = wordCloudData?.words ?? [];

  const filteredWords =
    languages.length > 0
      ? words.filter(
          (w) => !languages.some((lang) => stopwords[lang]?.includes(w.text)),
        )
      : words;

  const setDetailFromWord = (word) => {
    setDetailContent(word.entries);
    setOpenDetailModal(true);
  };

  return (
    <VisxWordcloud
      words={filteredWords}
      wordClickFunction={setDetailFromWord}
      languages={languages}
    />
  );
};
