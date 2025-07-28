import { entryAggregatorByListValue } from "../MostMentioned/MostMentionedUtils";
import { getVisxWordcloud } from "./VisxWordcloud";

const MAX_WORDS = 100;

export const generateWordCloudGraphData = (selectedContent) => {
  selectedContent.forEach(
    (entry) => (entry.splitText = entry.text.toLowerCase().split(" ")),
  );
  let ret = entryAggregatorByListValue(selectedContent, "splitText", "text");
  return ret;
};

export const generateWordCloud = (
  { setDetailContent, setOpenDetailModal },
  wordCloudData,
) => {
  let wordCloudDataCleaned = wordCloudData.slice(0, MAX_WORDS);

  wordCloudDataCleaned.forEach((w) => (w.value = w.count));

  const setDetailFromWord = (word) => {
    setDetailContent(word.entries);
    setOpenDetailModal(true);
  };

  let wordCloudGraph = getVisxWordcloud(
    wordCloudDataCleaned,
    setDetailFromWord,
  );

  return wordCloudGraph;
};
