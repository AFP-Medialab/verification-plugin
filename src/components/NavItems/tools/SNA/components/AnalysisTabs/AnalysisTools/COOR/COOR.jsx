import React from "react";

import CircularProgress from "@mui/material/CircularProgress";

import { getSelectedSourcesContent } from "components/NavItems/tools/SNA/utils/accessSavedCollections";

import { analysisDisplayTemplate } from "../../PanelConsts";
import {
  coorSettingsDisplay,
  generateCoorViz,
  getObjectSelectOptions,
  runCoorAnalysis,
} from "./CoorUtils";

const COOR = (coorProps) => {
  let keyword = coorProps.keyword;
  let dataSources = coorProps.dataSources;
  let selected = coorProps.selected;

  let coorTimeWindow = coorProps.coorTimeWindow;
  let setCoorTimeWindow = coorProps.setCoorTimeWindow;
  let coorEdgeThresh = coorProps.coorEdgeThresh;
  let setCoorEdgeThresh = coorProps.setCoorEdgeThresh;
  let coorMinParticipants = coorProps.coorMinParticipants;
  let setCoorMinParticipants = coorProps.setCoorMinParticipants;
  let coorObjectChoice = coorProps.coorObjectChoice;
  let setCoorObjectChoice = coorProps.setCoorObjectChoice;
  let coorGraph = coorProps.coorGraph;
  let setCoorGraph = coorProps.setCoorGraph;
  let authenticatedRequest = coorProps.authenticatedRequest;

  let setDetailContent = coorProps.setDetailContent;
  let setOpenDetailModal = coorProps.setOpenDetailModal;

  const displayCoorGraph = async () => {
    let selectedContent = getSelectedSourcesContent(dataSources, selected);
    setCoorGraph(
      <>
        <CircularProgress />
      </>,
    );
    let coorResult = await runCoorAnalysis(
      selectedContent,
      coorTimeWindow,
      coorEdgeThresh,
      coorMinParticipants,
      coorObjectChoice,
      authenticatedRequest,
    );

    let coorViz = generateCoorViz(
      coorResult,
      keyword,
      setDetailContent,
      setOpenDetailModal,
      dataSources,
      selected,
    );
    setCoorGraph(coorViz);
  };

  const coorObjectSelectOptions = getObjectSelectOptions(dataSources, selected);

  return (
    <>
      {analysisDisplayTemplate(
        keyword,
        "snaTools_CoorDescription",
        "snaTools_CoorButtonText",
        coorSettingsDisplay(
          keyword,
          coorTimeWindow,
          setCoorTimeWindow,
          coorEdgeThresh,
          setCoorEdgeThresh,
          coorMinParticipants,
          setCoorMinParticipants,
          coorObjectChoice,
          setCoorObjectChoice,
          coorObjectSelectOptions,
        ),
        displayCoorGraph,
        coorGraph,
      )}
    </>
  );
};

export default COOR;
