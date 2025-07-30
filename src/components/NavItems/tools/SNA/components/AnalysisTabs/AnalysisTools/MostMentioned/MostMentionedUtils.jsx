export const entryAggregatorByListValue = (
  selectedContent,
  listField,
  label,
) => {
  let aggregator = {};
  selectedContent.forEach((entry) => {
    if (!entry[listField]) return;
    if (!entry[listField]?.length > 0) return;
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
