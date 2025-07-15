import React from "react";

import { getSelectedSourcesContent } from "components/NavItems/tools/SNA/utils/accessSavedCollections";

import { analysisDisplayTemplate } from "../../PanelConsts";
import { generateHashtagAnalysisViz } from "./HashtagAnalysisUtils";

const HashtagAnalysis = (hashtagAnalysisProps) => {
  let dataSources = hashtagAnalysisProps.dataSources;
  let selected = hashtagAnalysisProps.selected;
  let keyword = hashtagAnalysisProps.keyword;
  let hashtagAnalysisGraph = hashtagAnalysisProps.hashtagAnalysisGraph;
  let setHashtagAnalysisGraph = hashtagAnalysisProps.setHashtagAnalysisGraph;
  let setHashtagBarChart = hashtagAnalysisProps.setHashtagBarChart;
  let setDetailContent = hashtagAnalysisProps.setDetailContent;
  let setOpenDetailModal = hashtagAnalysisProps.setOpenDetailModal;

  const displayHashtagAnalysis = () => {
    let selectedContent = getSelectedSourcesContent(dataSources, selected);
    let hashtagAnalysisViz = generateHashtagAnalysisViz(
      selectedContent,
      keyword,
      setHashtagBarChart,
      setDetailContent,
      setOpenDetailModal,
      selected,
      dataSources,
    );
    setHashtagAnalysisGraph(hashtagAnalysisViz);
  };

  return (
    <>
      {analysisDisplayTemplate(
        keyword,
        "snaTools_hashtagAnalysisDescription",
        "snaTools_hashtagAnalysisButton",
        <></>,
        () => {
          displayHashtagAnalysis();
        },
        hashtagAnalysisGraph,
      )}
    </>
  );
};

export default HashtagAnalysis;
