import React, { useEffect, useMemo, useRef, useState } from "react";

import { cardClasses } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

import { dataAnalysisSna } from "@/constants/tools";
import useAuthenticatedRequest from "components/Shared/Authentication/useAuthenticatedRequest";
import HeaderTool from "components/Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import {
  AccountActivityChart,
  accountActivityDetailDisplayHandler,
  accountActivitySettings,
  generateAccountActivityData,
} from "./components/AnalysisTabs/AnalysisTools/AccountActivity/AccountActivityUtils";
import {
  CoorViz,
  coorSettingsDisplay,
  runCoorAnalysis,
} from "./components/AnalysisTabs/AnalysisTools/COOR/CoorUtils";
import {
  HashtagAnalysisViz,
  generateHashtagAnalysisData,
  hashtagAnalysisDetailModalContent,
} from "./components/AnalysisTabs/AnalysisTools/HashtagAnalysis/HashtagAnalysisUtils";
import {
  generateMostMentionedData,
  mostMentionedDetailDisplayHandler,
} from "./components/AnalysisTabs/AnalysisTools/MostMentioned/MostMentionedUtils";
import {
  TextClustersTable,
  generateTextClusterData,
} from "./components/AnalysisTabs/AnalysisTools/TextClusters/TextClustersUtils";
import {
  TimelineChart,
  generateTimelineData,
} from "./components/AnalysisTabs/AnalysisTools/Timeline/TimelineUtils";
import {
  WordCloud,
  generateWordCloudGraphData,
} from "./components/AnalysisTabs/AnalysisTools/WordCloud/WordCloudUtils";
import SNAPanel from "./components/AnalysisTabs/SNAPanel";
import CollectionsTable from "./components/CollectionsTable";
import DataUpload from "./components/DataUpload/DataUpload";
import DataUploadModal from "./components/DataUpload/DataUploadModal";
import ZeeschuimerUploadModal from "./components/DataUpload/ZeeschuimerUploadModal";
import DetailModal from "./components/DetailModal";
import {
  initializePage,
  keepOnlyNumberFields,
  onlyUnique,
  refreshPage,
} from "./utils/accessSavedCollections";

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
  const [uploadModalError, setUploadModalError] = useState(false);

  //Zeeschuimer data upload modal props
  const [showZeeschuimerUploadModal, setShowZeeschuimerUploadModal] =
    useState(false);
  const [zeeschuimerUploadModalError, setZeeschuimerUploadModalError] =
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

  const timelineViz = ({ result }) => {
    if (!result) return;
    return (
      <TimelineChart
        keyword={keyword}
        setDetailContent={setDetailContent}
        setOpenDetailModal={setOpenDetailModal}
        timelineChartData={result}
      />
    );
  };

  //Account activity props
  const [accountActivityResult, setAccountActivityResult] = useState(null);
  const [accountActivityOnlyShowTop, setAccountActivityOnlyShowTop] =
    useState(true);
  const [activitySelect, setActivitySelect] = useState("entries");
  const [accountActivityLoading, setAccountActivityLoading] = useState(false);
  const [accountActivityErrorMessage, setAccountActivityErrorMessage] =
    useState("");

  const accountActivityViz = ({ result }) => {
    if (!result) return;
    return (
      <AccountActivityChart
        groupingFactor="username"
        onlyShowTop={accountActivityOnlyShowTop}
        setOnlyShowTop={setAccountActivityOnlyShowTop}
        activitySelect={activitySelect}
        setDetailContent={setDetailContent}
        setOpenDetailModal={setOpenDetailModal}
        selected={selected}
        dataSources={dataSources}
        keyword={keyword}
        detailDisplayFilter={accountActivityDetailDisplayHandler}
        activityChartData={result}
      />
    );
  };

  const selectedSources = useMemo(() => {
    if (!selected || !dataSources) return [];
    return dataSources.filter((source) => selected.includes(source.id));
  }, [selected, dataSources]);

  const numberFieldsinSources = useMemo(() => {
    if (!selectedSources) return [];
    return selectedSources
      .map((source) => keepOnlyNumberFields(source.content[0]))
      .flat();
  }, [selectedSources]);

  const commonNumberFields = useMemo(() => {
    if (!numberFieldsinSources) return [];
    return numberFieldsinSources
      .filter((field) =>
        selectedSources.every((source) => source.headers.includes(field)),
      )
      .filter(onlyUnique);
  }, [numberFieldsinSources]);

  //Coor props
  const [coorTimeWindow, setCoorTimeWindow] = useState(60);
  const [coorEdgeThresh, setCoorEdgeThresh] = useState(0);
  const [coorMinParticipation, setCoorMinParticipation] = useState(1);
  const [coorObjectChoice, setCoorObjectChoice] = useState("objects");
  const [coorLoading, setCoorLoading] = useState(false);
  const [coorResult, setCoorResult] = useState(false);
  const [coorErrorMessage, setCoorErrorMessage] = useState("");

  const coorResultViz = ({ result }) => {
    if (!result) return;
    return (
      <CoorViz
        keyword={keyword}
        setDetailContent={setDetailContent}
        setOpenDetailModal={setOpenDetailModal}
        dataSources={dataSources}
        selected={selected}
        coorResult={result.coorResult}
        coorGraphData={result.coorGraphData}
      />
    );
  };

  //Most mentioned props
  const [mostMentionedLoading, setMostMentionedLoading] = useState(false);
  const [mostMentionedOnlyShowTop, setMostMentionedOnlyShowTop] =
    useState(true);
  const [mostMentionedResult, setMostMentionedResult] = useState(null);
  const [mostMentionedErrorMessage, setMostMentionedErrorMessage] =
    useState("");

  const mostMentionedViz = ({ result }) => {
    if (!result) return;
    return (
      <AccountActivityChart
        groupingFactor={"username"}
        onlyShowTop={mostMentionedOnlyShowTop}
        setOnlyShowTop={setMostMentionedOnlyShowTop}
        activitySelect={"Mentions"}
        setDetailContent={setDetailContent}
        setOpenDetailModal={setOpenDetailModal}
        selected={selected}
        dataSources={dataSources}
        keyword={keyword}
        detailDisplayFilter={mostMentionedDetailDisplayHandler}
        activityChartData={result}
      />
    );
  };

  //Hashtag analysis props
  const [hashtagAnalysisResult, setHashtagAnalysisResult] = useState(null);
  const [hashtagAnalysisLoading, setHashtagAnalysisLoading] = useState(false);
  const [hashtagAnalysisOnlyShowTop, setHashtagAnalysisOnlyShowTop] =
    useState(true);
  const [hashtagAnalysisErrorMessage, setHashtagAnalysisErrorMessage] =
    useState("");

  const hashtagAnalysisViz = ({ result }) => {
    if (!result) return;
    return (
      <HashtagAnalysisViz
        groupingFactor="hashtag"
        onlyShowTop={hashtagAnalysisOnlyShowTop}
        setOnlyShowTop={setHashtagAnalysisOnlyShowTop}
        activitySelect="Hashtags"
        setDetailContent={setDetailContent}
        setOpenDetailModal={setOpenDetailModal}
        selected={selected}
        dataSources={dataSources}
        keyword={keyword}
        detailDisplayFilter={hashtagAnalysisDetailModalContent}
        toolResult={result}
      />
    );
  };

  //Word cloud props
  const [wordCloudLoading, setWordCloudLoading] = useState(false);
  const [wordCloudResult, setWordCloudResult] = useState(null);
  const [wordCloudErrorMessage, setWordCloudErrorMessage] = useState("");

  const wordCloudViz = ({ result }) => {
    if (!result) return;
    return (
      <WordCloud
        setDetailContent={setDetailContent}
        setOpenDetailModal={setOpenDetailModal}
        wordCloudData={result}
      />
    );
  };

  //Text clusters props
  const [textClustersLoading, setTextClustersLoading] = useState(false);
  const [textClustersResult, setTextClustersResult] = useState(null);
  const [textClustersErrorMessage, setTextClustersErrorMessage] = useState("");

  const textClustersViz = ({ result }) => {
    if (!result) return;
    return (
      <TextClustersTable
        keyword={keyword}
        setDetailContent={setDetailContent}
        setOpenDetailModal={setOpenDetailModal}
        textClusterData={result}
      />
    );
  };

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
    uploadModalError,
    setUploadModalError,
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
    zeeschuimerUploadModalError,
    setZeeschuimerUploadModalError,
  };

  const timelineDistributionProps = {
    toolDisplayProps: {
      toolDescription: "snaTools_timelineDistributionDescription",
      toolButtonText: "snaTools_timelineButton",
      toolLoading: timelineDistributionLoading,
      setToolLoading: setTimelineDistributionLoading,
      errorMessage: timelineDistributionErrorMessage,
      setErrorMessage: setTimelineDistributionErrorMessage,
    },
    toolAnalysisProps: {
      analysisFunction: generateTimelineData,
      toolResult: timelineDistributionResult,
      setToolResult: setTimelineDistributionResult,
      ToolVizResult: timelineViz,
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
      toolResult: mostMentionedResult,
      setToolResult: setMostMentionedResult,
      ToolVizResult: mostMentionedViz,
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
          commonNumberFields,
          selectedSources,
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
      toolResult: accountActivityResult,
      setToolResult: setAccountActivityResult,
      ToolVizResult: accountActivityViz,
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
      toolResult: hashtagAnalysisResult,
      setToolResult: setHashtagAnalysisResult,
      ToolVizResult: hashtagAnalysisViz,
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
        dataSources,
        selected,
      },
      toolResult: coorResult,
      setToolResult: setCoorResult,
      ToolVizResult: coorResultViz,
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
      toolResult: wordCloudResult,
      setToolResult: setWordCloudResult,
      ToolVizResult: wordCloudViz,
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
      toolResult: textClustersResult,
      setToolResult: setTextClustersResult,
      ToolVizResult: textClustersViz,
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
    const loadData = async () => {
      const loadedCollections = await initializePage();
      setDataSources(loadedCollections);
      setInitLoading(false);
    };

    loadData();

    const refreshOnReturnToTab = async () => {
      if (document.visibilityState === "visible") {
        await refreshPage(setInitLoading, dataSources);
      }
    };

    document.addEventListener("visibilitychange", refreshOnReturnToTab);

    return () => {
      document.removeEventListener("visibilitychange", refreshOnReturnToTab);
    };
  }, []);

  return (
    <>
      <DetailModal {...detailModalProps} />
      <DataUploadModal {...dataUploadModalProps} />
      <ZeeschuimerUploadModal {...zeeschuimerDataUploadModalProps} />
      <HeaderTool
        name={keyword("SNA_header_title")}
        description={keyword("SNA_header_description")}
        icon={
          <dataAnalysisSna.icon sx={{ fill: "#00926c", fontSize: "40px" }} />
        }
      />
      <Stack direction={"column"} spacing={4}>
        {initLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <DataUpload {...dataUploadProps} />
            <Card variant="outlined" className={cardClasses.root}>
              <CollectionsTable {...collectionsTableProps} />
            </Card>
            <Card variant="outlined" className={cardClasses.root}>
              <SNAPanel {...snaPanelProps} />
            </Card>
          </>
        )}
      </Stack>
    </>
  );
};

export default SNA;
