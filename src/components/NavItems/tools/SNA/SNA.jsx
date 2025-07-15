import React, { useEffect, useRef, useState } from "react";

import { ThemeProvider, cardClasses } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

import useAuthenticatedRequest from "components/Shared/Authentication/useAuthenticatedRequest";
import HeaderTool from "components/Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { dataAnalysisSna } from "../../../../constants/tools";
import SNAPanel from "./components/AnalysisTabs/SNAPanel";
import CollectionsTable from "./components/CollectionsTable";
import DataUpload from "./components/DataUpload/DataUpload";
import DataUploadModal from "./components/DataUpload/DataUploadModal";
import ZeeschuimerUploadModal from "./components/DataUpload/ZeeschuimerUploadModal";
import DetailModal from "./components/DetailModal";
import { initializePage } from "./utils/accessSavedCollections";
import theme from "./utils/theme";

const SNA = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/NewSNA");

  /**
   * Holds the gathered and uploaded collections
   * as objects formatted as:
   * {
   *  id: string
   *  name: string
   *  length: int
   *  content: Object[]
   *  headers: String[]
   *  accountNameMap: Map(String -> String)
   *  source: String
   * }
   */
  const [dataSources, setDataSources] = useState([]);

  const [initLoading, setInitLoading] = useState(true);

  //Detailed view props
  const [detailContent, setDetailContent] = useState([]);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [detailSearchFilter, setDetailSearchFilter] = useState("");
  //Collections table props
  const [selected, setSelected] = useState([]);
  const fileInputRef = useRef(null);
  const [dlAnchorEl, setDlAnchorEl] = useState(null);
  //Data upload props
  const dataUploadInputRef = useRef(null);
  const [uploadedData, setUploadedData] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  //Data upload modal props
  const [socialMediaSelected, setSocialMediaSelected] = useState("");
  const [customExpanded, setCustomExpanded] = useState(false);
  //Zeeschuimer data upload modal props
  const [showZeeschuimerUploadModal, setShowZeeschuimerUploadModal] =
    useState(false);
  //SNA Panel props
  const [snaTab, setSnaTab] = useState(0);
  //Timeline props
  const [timelineGraph, setTimelineGraph] = useState(<></>);
  //Account activity props
  const [accountActivityGraph, setAccountActivityGraph] = useState(<></>);
  const [activitySelect, setActivitySelect] = useState("entries");
  //Coor props
  const [coorTimeWindow, setCoorTimeWindow] = useState(60);
  const [coorEdgeThresh, setCoorEdgeThresh] = useState(0);
  const [coorMinParticipants, setCoorMinParticipants] = useState(1);
  const [coorObjectChoice, setCoorObjectChoice] = useState("objects");
  const [coorGraph, setCoorGraph] = useState(<></>);
  //Most mentioned props
  const [mostMentionedGraph, setMostMentionedGraph] = useState(<></>);
  //Hashtag analysis props
  const [hashtagAnalysisBarChart, setHashtagAnalysisBarChart] = useState(<></>);
  const [hashtagAnalysisGraph, setHashtagAnalysisGraph] = useState(<></>);
  //Word cloud props
  const [wordCloudGraph, setWordCloudGraph] = useState(<></>);
  //Text clusters props
  const [textClustersGraph, setTextClustersGraph] = useState(<></>);

  const authenticatedRequest = useAuthenticatedRequest();

  const detailModalProps = {
    detailContent,
    openDetailModal,
    setOpenDetailModal,
    detailSearchFilter,
    setDetailSearchFilter,
    keyword,
  };
  const collectionsTableProps = {
    selected,
    setSelected,
    setDetailContent,
    setOpenDetailModal,
    fileInputRef,
    dataSources,
    dlAnchorEl,
    setDlAnchorEl,
    setDataSources,
    keyword,
  };

  const dataUploadProps = {
    keyword,
    dataUploadInputRef,
    setUploadedData,
    setShowUploadModal,
    setUploadedFileName,
    showZeeschuimerUploadModal,
    setShowZeeschuimerUploadModal,
  };

  const dataUploadModalProps = {
    dataSources,
    showUploadModal,
    setUploadedData,
    setShowUploadModal,
    keyword,
    socialMediaSelected,
    setSocialMediaSelected,
    setCustomExpanded,
    customExpanded,
    uploadedData,
    uploadedFileName,
    setUploadedFileName,
  };

  const zeeschuimerDataUploadModalProps = {
    dataSources,
    showZeeschuimerUploadModal,
    setUploadedData,
    setShowZeeschuimerUploadModal,
    keyword,
    socialMediaSelected,
    setSocialMediaSelected,
    uploadedData,
    uploadedFileName,
    setUploadedFileName,
  };

  const timelineDistributionProps = {
    keyword,
    dataSources,
    selected,
    setDetailContent,
    setOpenDetailModal,
    timelineGraph,
    setTimelineGraph,
  };

  const accountActivityProps = {
    keyword,
    dataSources,
    selected,
    accountActivityGraph,
    setAccountActivityGraph,
    setDetailContent,
    setOpenDetailModal,
    activitySelect,
    setActivitySelect,
  };

  const coorProps = {
    keyword,
    dataSources,
    selected,
    coorTimeWindow,
    setCoorTimeWindow,
    coorEdgeThresh,
    setCoorEdgeThresh,
    coorMinParticipants,
    setCoorMinParticipants,
    coorObjectChoice,
    setCoorObjectChoice,
    coorGraph,
    setCoorGraph,
    authenticatedRequest,
    setDetailContent,
    setOpenDetailModal,
  };

  const mostMentionedProps = {
    keyword,
    mostMentionedGraph,
    setMostMentionedGraph,
    setDetailContent,
    setOpenDetailModal,
    selected,
    dataSources,
  };

  const hashtagAnalysisProps = {
    keyword,
    hashtagAnalysisGraph,
    setHashtagAnalysisGraph,
    hashtagAnalysisBarChart,
    setHashtagAnalysisBarChart,
    setDetailContent,
    setOpenDetailModal,
    selected,
    dataSources,
  };

  const wordCloudProps = {
    keyword,
    dataSources,
    selected,
    wordCloudGraph,
    setWordCloudGraph,
    setDetailContent,
    setOpenDetailModal,
  };

  const textClustersProps = {
    keyword,
    dataSources,
    selected,
    textClustersGraph,
    setTextClustersGraph,
    authenticatedRequest,
    setDetailContent,
    setOpenDetailModal,
  };

  const analysisToolsProps = {
    timelineDistribution: timelineDistributionProps,
    accountActivity: accountActivityProps,
    coor: coorProps,
    mostMentioned: mostMentionedProps,
    hashtagAnalysis: hashtagAnalysisProps,
    wordCloud: wordCloudProps,
    textClusters: textClustersProps,
  };

  const snaPanelProps = {
    snaTab,
    setSnaTab,
    keyword,
    analysisToolsProps,
  };

  /**
   * On page load, send message to background
   * to add gathered collections to dataSources
   */
  useEffect(() => {
    initializePage(setInitLoading, dataSources);
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        {DetailModal(detailModalProps)}
        {DataUploadModal(dataUploadModalProps)}
        {ZeeschuimerUploadModal(zeeschuimerDataUploadModalProps)}
        <HeaderTool
          name={keyword("SNA_header_title")}
          description={keyword("SNA_header_description")}
          icon={
            <dataAnalysisSna.icon sx={{ fill: "#00926c", fontSize: "40px" }} />
          }
        />
        <Card variant="outlined" className={cardClasses.root}>
          {initLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {CollectionsTable(collectionsTableProps)}
              <Box p={2} />
              {DataUpload(dataUploadProps)}
              <Box p={2} />
              {SNAPanel(snaPanelProps)}
            </>
          )}
        </Card>
      </ThemeProvider>
    </>
  );
};

export default SNA;
