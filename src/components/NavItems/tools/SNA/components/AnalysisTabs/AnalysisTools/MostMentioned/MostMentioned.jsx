import React from "react";

import { getSelectedSourcesContent } from "components/NavItems/tools/SNA/utils/accessSavedCollections";

import { analysisDisplayTemplate } from "../../PanelConsts";
import { generateMostMentionedGraph } from "./MostMentionedUtils";

const MostMentioned = (mostMentionedProps) => {
  let keyword = mostMentionedProps.keyword;
  let mostMentionedGraph = mostMentionedProps.mostMentionedGraph;

  let setMostMentionedGraph = mostMentionedProps.setMostMentionedGraph;
  let setDetailContent = mostMentionedProps.setDetailContent;
  let setOpenDetailModal = mostMentionedProps.setOpenDetailModal;
  let selected = mostMentionedProps.selected;
  let dataSources = mostMentionedProps.dataSources;

  const showMostMentioned = () => {
    let selectedContent = getSelectedSourcesContent(dataSources, selected);
    let mostMentionedViz = generateMostMentionedGraph(
      keyword,
      selectedContent,
      setMostMentionedGraph,
      setDetailContent,
      setOpenDetailModal,
      selected,
      dataSources,
    );
    setMostMentionedGraph(mostMentionedViz);
  };

  return (
    <>
      {analysisDisplayTemplate(
        keyword,
        "snaTools_mostMentionedDescription",
        "snaTools_mostMentionedButton",
        <></>,
        () => {
          showMostMentioned();
        },
        mostMentionedGraph,
      )}
    </>
  );
};

export default MostMentioned;
