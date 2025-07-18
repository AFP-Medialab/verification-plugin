import React from "react";

import CircularProgress from "@mui/material/CircularProgress";

import { getSelectedSourcesContent } from "components/NavItems/tools/SNA/utils/accessSavedCollections";

import { analysisDisplayTemplate } from "../../PanelConsts";
import { generateTextClusterGraph } from "./TextClustersUtils";

const TextClusters = (textClustersProps) => {
  let keyword = textClustersProps.keyword;
  let textClustersGraph = textClustersProps.textClustersGraph;
  let setTextClustersGraph = textClustersProps.setTextClustersGraph;
  let selected = textClustersProps.selected;
  let dataSources = textClustersProps.dataSources;
  let authenticatedRequest = textClustersProps.authenticatedRequest;
  let setDetailContent = textClustersProps.setDetailContent;
  let setOpenDetailModal = textClustersProps.setOpenDetailModal;

  const displayTextClusters = async () => {
    setTextClustersGraph(
      <>
        <CircularProgress />
      </>,
    );
    let selectedContent = getSelectedSourcesContent(dataSources, selected);
    let textClusterViz = await generateTextClusterGraph(
      selectedContent,
      authenticatedRequest,
      keyword,
      setDetailContent,
      setOpenDetailModal,
    );
    setTextClustersGraph(textClusterViz);
  };

  return (
    <>
      {analysisDisplayTemplate(
        keyword,
        "snaTools_textClusterDescription",
        "snaTools_textClusterButton",
        <></>,
        () => {
          displayTextClusters();
        },
        textClustersGraph,
      )}
    </>
  );
};

export default TextClusters;
