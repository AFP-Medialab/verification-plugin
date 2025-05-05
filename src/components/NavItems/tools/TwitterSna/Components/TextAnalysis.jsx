import React from "react";

const TextAnalysis = (props) => {
  let dataSources = props.dataSources;
  let selected = props.selected;
  let selectedSources = dataSources.filter((source) =>
    selected.includes(source.id),
  );
  let selectedContent = selectedSources.map((source) => source.content).flat();
  let nameMaps = new Map(
    selectedSources
      .map((source) =>
        source.accountNameMap ? source.accountNameMap : new Map(),
      )
      .flatMap((m) => [...m]),
  );
  let s = selectedContent.map((x) =>
    x.tweet_text
      ? x.tweet_text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(" ")
      : "",
  );

  return <></>;
};

export default TextAnalysis;
