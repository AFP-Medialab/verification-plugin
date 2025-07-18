import React from "react";

import { getSelectedSourcesContent } from "components/NavItems/tools/SNA/utils/accessSavedCollections";

import { analysisDisplayTemplate } from "../../PanelConsts";
import {
  accountActivityDetailDisplayHandler,
  accountActivitySettings,
  generateAccountActivityChart,
  generateAccountActivityData,
} from "./AccountActivityUtils";

const AccountActivity = (accountActivityProps) => {
  let keyword = accountActivityProps.keyword;
  let dataSources = accountActivityProps.dataSources;
  let selected = accountActivityProps.selected;
  let accountActivityGraph = accountActivityProps.accountActivityGraph;
  let setAccountActivityGraph = accountActivityProps.setAccountActivityGraph;
  let setDetailContent = accountActivityProps.setDetailContent;
  let setOpenDetailModal = accountActivityProps.setOpenDetailModal;
  let activitySelect = accountActivityProps.activitySelect;
  let setActivitySelect = accountActivityProps.setActivitySelect;

  const displayAccountActivityGraph = () => {
    let selectedContent = getSelectedSourcesContent(dataSources, selected);
    let accountActivityData = generateAccountActivityData(
      selectedContent,
      activitySelect,
    );
    let accountActivityResult = generateAccountActivityChart(
      "username",
      true,
      accountActivityData,
      keyword,
      accountActivityDetailDisplayHandler,
      activitySelect,
      setAccountActivityGraph,
      setDetailContent,
      setOpenDetailModal,
      selectedContent,
      selected,
      dataSources,
    );
    setAccountActivityGraph(accountActivityResult);
  };

  return (
    <>
      {analysisDisplayTemplate(
        keyword,
        "snaTools_accountActivityDescription",
        "snaTools_accountActivityButtonText",
        accountActivitySettings(
          keyword,
          dataSources,
          selected,
          activitySelect,
          setActivitySelect,
        ),
        displayAccountActivityGraph,
        accountActivityGraph,
      )}
    </>
  );
};

export default AccountActivity;
