import { onlyUnique } from "@/components/NavItems/tools/SNA/utils/accessSavedCollections";

import { STOP_WORDS_SET } from "./stopWords";

export const entryAggregatorByListValue = (
  selectedContent,
  listField,
  label,
  excludeWords = STOP_WORDS_SET,
) => {
  console.log(selectedContent);
  let aggregator = {};
  selectedContent.forEach((entry) => {
    if (!entry[listField]) return;
    if (!entry[listField]?.length > 0) return;
    entry[listField]
      .map((x) => x.toLowerCase())
      .filter(onlyUnique)
      .filter((listItem) => !excludeWords.has(listItem))
      .forEach((listItem) => {
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
  console.log(Object.values(aggregator).sort((a, b) => b.count - a.count));
  return Object.values(aggregator).sort((a, b) => b.count - a.count);
};

export const generateMostMentionedData = (selectedContent) => {
  if (!selectedContent[0].mentions) return [];
  return entryAggregatorByListValue(selectedContent, "mentions", "username");
};

export const mostMentionedDetailDisplayHandler = (
  selectedContent,
  clickPayload,
) => {
  return clickPayload.entries;
};
