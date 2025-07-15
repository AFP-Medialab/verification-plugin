import React from "react";

import { getSelectedSourcesContent } from "components/NavItems/tools/SNA/utils/accessSavedCollections";

import { analysisDisplayTemplate } from "../../PanelConsts";
import {
  TimelineChart,
  generateTimelineData,
  getTimelineChartOptions,
} from "./TimelineUtils";

const TimelineDistribution = (timelineDistributionProps) => {
  let keyword = timelineDistributionProps.keyword;
  let dataSources = timelineDistributionProps.dataSources;
  let selected = timelineDistributionProps.selected;
  let setDetailContent = timelineDistributionProps.setDetailContent;
  let setOpenDetailModal = timelineDistributionProps.setOpenDetailModal;
  let timelineGraph = timelineDistributionProps.timelineGraph;
  let setTimelineGraph = timelineDistributionProps.setTimelineGraph;

  const displayTimelineGraph = () => {
    let selectedContent = getSelectedSourcesContent(dataSources, selected);
    let timelineChartData = generateTimelineData(selectedContent);
    let timelineChartOptions = getTimelineChartOptions(
      keyword,
      timelineChartData,
    );
    let timeline = TimelineChart(
      timelineChartOptions,
      setDetailContent,
      setOpenDetailModal,
      timelineChartData,
      selectedContent,
    );
    setTimelineGraph(timeline);
  };

  return (
    <>
      {analysisDisplayTemplate(
        keyword,
        "snaTools_timelineDescription",
        "snaTools_timelineButton",
        <></>,
        displayTimelineGraph,
        timelineGraph,
      )}
    </>
  );
};

export default TimelineDistribution;
