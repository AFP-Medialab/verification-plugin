import React from "react";

import { getSelectedSourcesContent } from "components/NavItems/tools/SNA/utils/accessSavedCollections";

import { analysisDisplayTemplate } from "../../PanelConsts";
import { generateWordCloud } from "./WordCloudUtils";

const WordCloud = (wordCloudProps) => {
  let keyword = wordCloudProps.keyword;
  let wordCloudGraph = wordCloudProps.wordCloudGraph;
  let setWordCloudGraph = wordCloudProps.setWordCloudGraph;
  let dataSources = wordCloudProps.dataSources;
  let selected = wordCloudProps.selected;
  let setDetailContent = wordCloudProps.setDetailContent;
  let setOpenDetailModal = wordCloudProps.setOpenDetailModal;

  const displayWordCloud = () => {
    let selectedContent = getSelectedSourcesContent(dataSources, selected);
    let wordCloudViz = generateWordCloud(
      selectedContent,
      setDetailContent,
      setOpenDetailModal,
    );

    setWordCloudGraph(wordCloudViz);
  };

  return (
    <>
      {analysisDisplayTemplate(
        keyword,
        "snaTools_wordCloudDescription",
        "snaTools_wordCloudButton",
        <></>,
        () => {
          displayWordCloud();
        },
        wordCloudGraph,
      )}
    </>
  );
};

export default WordCloud;
