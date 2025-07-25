import React, { useEffect, useRef, useState } from "react";

import { cardClasses } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

import useAuthenticatedRequest from "components/Shared/Authentication/useAuthenticatedRequest";
import HeaderTool from "components/Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { dataAnalysisSna } from "../../../../constants/tools";
import {
  accountActivityDetailDisplayHandler,
  accountActivitySettings,
  generateAccountActivityChart,
  generateAccountActivityData,
} from "./components/AnalysisTabs/AnalysisTools/AccountActivity/AccountActivityUtils";
import {
  coorSettingsDisplay,
  generateCoorViz,
  runCoorAnalysis,
} from "./components/AnalysisTabs/AnalysisTools/COOR/CoorUtils";
import {
  generateHashtagAnalysisData,
  generateHashtagAnalysisViz,
  hashtagAnalysisDetailModalContent,
} from "./components/AnalysisTabs/AnalysisTools/HashtagAnalysis/HashtagAnalysisUtils";
import {
  generateMostMentionedData,
  mostMentionedDetailDisplayHandler,
} from "./components/AnalysisTabs/AnalysisTools/MostMentioned/MostMentionedUtils";
import {
  generateTextClusterData,
  textClustersTable,
} from "./components/AnalysisTabs/AnalysisTools/TextClusters/TextClustersUtils";
import {
  TimelineChart,
  generateTimelineData,
} from "./components/AnalysisTabs/AnalysisTools/Timeline/TimelineUtils";
import {
  generateWordCloud,
  generateWordCloudGraphData,
} from "./components/AnalysisTabs/AnalysisTools/WordCloud/WordCloudUtils";
import SNAPanel from "./components/AnalysisTabs/SNAPanel";
import CollectionsTable from "./components/CollectionsTable";
import DataUpload from "./components/DataUpload/DataUpload";
import DataUploadModal from "./components/DataUpload/DataUploadModal";
import ZeeschuimerUploadModal from "./components/DataUpload/ZeeschuimerUploadModal";
import DetailModal from "./components/DetailModal";
import { initializePage } from "./utils/accessSavedCollections";

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
  const [timelineDistributionLoading, setTimelineDistributionLoading] =
    useState(false);
  const [timelineDistributionResult, setTimelineDistributionResult] =
    useState(null);
  const [
    timelineDistributionErrorMessage,
    setTimelineDistributionErrorMessage,
  ] = useState("");

  //Account activity props
  const [accountActivityResult, setAccountActivityResult] = useState(null);
  const [accountActivityOnlyShowTop, setAccountActivityOnlyShowTop] =
    useState(true);
  const [activitySelect, setActivitySelect] = useState("entries");
  const [accountActivityLoading, setAccountActivityLoading] = useState(false);
  const [accountActivityErrorMessage, setAccountActivityErrorMessage] =
    useState("");
  //Coor props
  const [coorTimeWindow, setCoorTimeWindow] = useState(60);
  const [coorEdgeThresh, setCoorEdgeThresh] = useState(0);
  const [coorMinParticipation, setCoorMinParticipation] = useState(1);
  const [coorObjectChoice, setCoorObjectChoice] = useState("objects");
  const [coorLoading, setCoorLoading] = useState(false);
  const [coorResult, setCoorResult] = useState(false);
  const [coorErrorMessage, setCoorErrorMessage] = useState("");

  //Most mentioned props
  const [mostMentionedLoading, setMostMentionedLoading] = useState(false);
  const [mostMentionedOnlyShowTop, setMostMentionedOnlyShowTop] =
    useState(true);
  const [mostMentionedResult, setMostMentionedResult] = useState(null);
  const [mostMentionedErrorMessage, setMostMentionedErrorMessage] =
    useState("");

  //Hashtag analysis props
  const [hashtagAnalysisResult, setHashtagAnalysisResult] = useState(null);
  const [hashtagAnalysisLoading, setHashtagAnalysisLoading] = useState(false);
  const [hashtagAnalysisOnlyShowTop, setHashtagAnalysisOnlyShowTop] =
    useState(true);
  const [hashtagAnalysisErrorMessage, setHashtagAnalysisErrorMessage] =
    useState("");

  //Word cloud props
  const [wordCloudLoading, setWordCloudLoading] = useState(false);
  const [wordCloudResult, setWordCloudResult] = useState(null);
  const [wordCloudErrorMessage, setWordCloudErrorMessage] = useState("");

  //Text clusters props
  const [textClustersLoading, setTextClustersLoading] = useState(false);
  const [textClustersResult, setTextClustersResult] = useState(null);
  const [textClustersErrorMessage, setTextClustersErrorMessage] = useState("");

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
    toolDisplayProps: {
      toolDescription: "snaTools_timelineDistributionDescription",
      toolButtonText: "snaTools_timelineDistributionButtonText",
      toolLoading: timelineDistributionLoading,
      setToolLoading: setTimelineDistributionLoading,
      errorMessage: timelineDistributionErrorMessage,
      setErrorMessage: setTimelineDistributionErrorMessage,
    },
    toolAnalysisProps: {
      analysisFunction: generateTimelineData,
      vizFunction: TimelineChart,
      vizArgs: {
        keyword,
        setDetailContent,
        setOpenDetailModal,
      },
      toolResult: timelineDistributionResult,
      setToolResult: setTimelineDistributionResult,
    },
  };

  const mostMentionedProps = {
    toolDisplayProps: {
      toolDescription: "snaTools_mostMentionedDescription",
      toolButtonText: "snaTools_mostMentionedButtonText",
      toolLoading: mostMentionedLoading,
      setToolLoading: setMostMentionedLoading,
      errorMessage: mostMentionedErrorMessage,
      setErrorMessage: setMostMentionedErrorMessage,
    },
    toolAnalysisProps: {
      analysisFunction: generateMostMentionedData,
      vizFunction: generateAccountActivityChart,
      vizArgs: {
        groupingFactor: "username",
        onlyShowTop: mostMentionedOnlyShowTop,
        setOnlyShowTop: setMostMentionedOnlyShowTop,
        activitySelect: "Mentions",
        setDetailContent,
        setOpenDetailModal,
        selected,
        dataSources,
        keyword,
        detailDisplayFilter: mostMentionedDetailDisplayHandler,
      },
      toolResult: mostMentionedResult,
      setToolResult: setMostMentionedResult,
    },
  };

  const accountActivityProps = {
    toolDisplayProps: {
      toolDescription: "snaTools_accountActivityDescription",
      toolButtonText: "snaTools_accountActivityButtonText",
      toolSettings: {
        display: (args) => accountActivitySettings(args),
        args: {
          keyword,
          dataSources,
          selected,
          activitySelect,
          setActivitySelect,
        },
      },
      toolLoading: accountActivityLoading,
      setToolLoading: setAccountActivityLoading,
      errorMessage: accountActivityErrorMessage,
      setErrorMessage: setAccountActivityErrorMessage,
    },
    toolAnalysisProps: {
      analysisFunction: generateAccountActivityData,
      analysisArgs: { activitySelect },
      vizFunction: generateAccountActivityChart,
      vizArgs: {
        groupingFactor: "username",
        onlyShowTop: accountActivityOnlyShowTop,
        setOnlyShowTop: setAccountActivityOnlyShowTop,
        activitySelect,
        setDetailContent,
        setOpenDetailModal,
        selected,
        dataSources,
        keyword,
        detailDisplayFilter: accountActivityDetailDisplayHandler,
      },
      toolResult: accountActivityResult,
      setToolResult: setAccountActivityResult,
    },
  };

  const hashtagAnalysisProps = {
    toolDisplayProps: {
      toolDescription: "snaTools_hashtagAnalysisDescription",
      toolButtonText: "snaTools_hashtagAnalysisButtonText",
      toolLoading: hashtagAnalysisLoading,
      setToolLoading: setHashtagAnalysisLoading,
      errorMessage: hashtagAnalysisErrorMessage,
      setErrorMessage: setHashtagAnalysisErrorMessage,
    },
    toolAnalysisProps: {
      analysisFunction: generateHashtagAnalysisData,
      vizFunction: generateHashtagAnalysisViz,
      vizArgs: {
        barChart: {
          groupingFactor: "hashtag",
          onlyShowTop: hashtagAnalysisOnlyShowTop,
          setOnlyShowTop: setHashtagAnalysisOnlyShowTop,
          activitySelect: "Hashtags",
          setDetailContent,
          setOpenDetailModal,
          selected,
          dataSources,
          keyword,
          detailDisplayFilter: hashtagAnalysisDetailModalContent,
        },
        networkGraph: {
          setDetailContent,
          setOpenDetailModal,
        },
      },
      toolResult: hashtagAnalysisResult,
      setToolResult: setHashtagAnalysisResult,
    },
  };

  const coorProps = {
    toolDisplayProps: {
      toolDescription: "snaTools_coorDescription",
      toolButtonText: "snaTools_coorButtonText",
      toolSettings: {
        display: (args) => coorSettingsDisplay(args),
        args: {
          keyword,
          dataSources,
          selected,
          coorTimeWindow,
          setCoorTimeWindow,
          coorEdgeThresh,
          setCoorEdgeThresh,
          coorMinParticipation,
          setCoorMinParticipation,
          coorObjectChoice,
          setCoorObjectChoice,
        },
      },
      toolLoading: coorLoading,
      setToolLoading: setCoorLoading,
      errorMessage: coorErrorMessage,
      setErrorMessage: setCoorErrorMessage,
    },
    toolAnalysisProps: {
      analysisFunction: runCoorAnalysis,
      analysisArgs: {
        coorTimeWindow,
        coorEdgeThresh,
        coorMinParticipation,
        coorObjectChoice,
        authenticatedRequest,
      },
      vizFunction: generateCoorViz,
      vizArgs: {
        keyword,
        setDetailContent,
        setOpenDetailModal,
        dataSources,
        selected,
      },
      toolResult: coorResult,
      setToolResult: setCoorResult,
    },
  };

  const wordCloudProps = {
    toolDisplayProps: {
      toolDescription: "snaTools_wordCloudDescription",
      toolButtonText: "snaTools_wordCloudButtonText",
      toolLoading: wordCloudLoading,
      setToolLoading: setWordCloudLoading,
      errorMessage: wordCloudErrorMessage,
      setErrorMessage: setWordCloudErrorMessage,
    },
    toolAnalysisProps: {
      analysisFunction: generateWordCloudGraphData,
      vizFunction: generateWordCloud,
      vizArgs: {
        setDetailContent,
        setOpenDetailModal,
      },
      toolResult: wordCloudResult,
      setToolResult: setWordCloudResult,
    },
  };

  const textClustersProps = {
    toolDisplayProps: {
      toolDescription: "snaTools_textClustersDescription",
      toolButtonText: "snaTools_textClustersButtonText",
      toolLoading: textClustersLoading,
      setToolLoading: setTextClustersLoading,
      errorMessage: textClustersErrorMessage,
      setErrorMessage: setTextClustersErrorMessage,
    },
    toolAnalysisProps: {
      analysisFunction: generateTextClusterData,
      analysisArgs: {
        authenticatedRequest,
      },
      vizFunction: textClustersTable,
      vizArgs: {
        keyword,
        setDetailContent,
        setOpenDetailModal,
      },
      toolResult: textClustersResult,
      setToolResult: setTextClustersResult,
    },
  };

  const analysisToolsProps = {
    essentialProps: {
      keyword,
      dataSources,
      selected,
    },
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
    </>
  );
};

export default SNA;
