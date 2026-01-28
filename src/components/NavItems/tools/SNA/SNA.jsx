import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { cardClasses } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

import useAuthenticatedRequest from "@/components/Shared/Authentication/useAuthenticatedRequest";
import HeaderTool from "@/components/Shared/HeaderTool/HeaderTool";
import { dataAnalysisSna } from "@/constants/tools";
import {
  setSNADataSources,
  setSNALoading,
} from "@/redux/reducers/tools/snaDataReducer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import {
  AccountActivityChart,
  accountActivityDetailDisplayHandler,
  accountActivitySettings,
  generateAccountActivityData,
} from "./components/AnalysisTabs/AnalysisTools/AccountActivity/AccountActivityUtils";
import {
  CoorViz,
  coorSettingsDisplay,
  getObjectSelectOptions,
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
  refreshPageSelective,
  refreshSpecificCollection,
  updateCollectionMetrics,
} from "./utils/accessSavedCollections";

const SNA = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/NewSNA");
  const dispatch = useDispatch();

  // Get cached data from Redux
  const cachedDataSources = useSelector((state) => state.snaData.dataSources);

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
  const dataSourcesRef = useRef(dataSources);
  const isInitialized = useRef(false);
  const recordingState = useRef({
    isRecording: false,
    collectionId: null,
    platforms: [],
  });

  const [initLoading, setInitLoading] = useState(true);

  /**
   * Wrapper function to update both local state and Redux cache
   */
  const updateDataSources = useCallback(
    (newDataSources) => {
      setDataSources(newDataSources);
      dataSourcesRef.current = newDataSources;
      dispatch(setSNADataSources(newDataSources));
    },
    [dispatch],
  );

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

  // Memoize selected sources with stable reference
  // Only recalculate when selected IDs change or when specific collections in dataSources change
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

  const coorObjectSelectOptions = useMemo(() => {
    return getObjectSelectOptions(dataSources, selected);
  }, [selected]);

  useEffect(() => {
    if (
      !coorObjectSelectOptions.map((x) => x.value).includes(coorObjectChoice)
    ) {
      setCoorObjectChoice(coorObjectSelectOptions[0].value);
    }
  });

  const coorResultViz = ({ result }) => {
    if (!result) return;
    let coorResult = result.coorResult;
    let coorGraphData = result.coorGraphData;

    return (
      <CoorViz
        keyword={keyword}
        setDetailContent={setDetailContent}
        setOpenDetailModal={setOpenDetailModal}
        dataSources={dataSources}
        selected={selected}
        coorResult={coorResult}
        coorGraphData={coorGraphData}
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

  const detailModalProps = useMemo(
    () => ({
      detailContent,
      openDetailModal,
      setOpenDetailModal,
      detailSearchFilter,
      setDetailSearchFilter,
      keyword,
    }),
    [detailContent, openDetailModal, detailSearchFilter, keyword],
  );

  const collectionsTableProps = useMemo(
    () => ({
      selected,
      setSelected,
      setDetailContent,
      setOpenDetailModal,
      fileInputRef,
      dataSources,
      dlAnchorEl,
      setDlAnchorEl,
      setDataSources: updateDataSources,
      keyword,
    }),
    [
      selected,
      dataSources,
      dlAnchorEl,
      keyword,
      fileInputRef,
      updateDataSources,
    ],
  );

  const dataUploadProps = {
    keyword,
    dataUploadInputRef,
    setUploadedData,
    setShowUploadModal,
    setUploadedFileName,
    showZeeschuimerUploadModal,
    setShowZeeschuimerUploadModal,
  };

  const handleRefreshCollections = useCallback(async () => {
    await refreshPageSelective(
      setInitLoading,
      dataSourcesRef.current,
      updateDataSources,
    );
  }, [updateDataSources]);

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
    onUploadComplete: handleRefreshCollections,
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
          coorObjectSelectOptions,
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
   * Initialize data sources once on mount
   */
  useEffect(() => {
    // Only initialize once
    if (isInitialized.current) return;
    isInitialized.current = true;

    const loadData = async () => {
      // Check if we have cached data in Redux
      if (cachedDataSources !== null) {
        console.log("Using cached data from Redux");
        setDataSources(cachedDataSources);
        setInitLoading(false);
        return;
      }

      // Load from IndexedDB if no cache
      //console.log("Loading data from IndexedDB");
      dispatch(setSNALoading(true));
      const loadedCollections = await initializePage();
      updateDataSources(loadedCollections);
      setInitLoading(false);
    };

    loadData();
  }, [cachedDataSources, dispatch, updateDataSources]);

  /**
   * Update collection metrics when SNA tab/window becomes visible
   * Event-driven approach - only updates when user views the tab
   * Triggers targeted refresh of recorded collections when recording stops
   */
  useEffect(() => {
    const updateMetricsIfRecording = async () => {
      try {
        const recordingInfo = await browser.runtime.sendMessage({
          prompt: "getRecordingInfo",
        });

        const isRecording =
          recordingInfo.recording &&
          recordingInfo.recording[0] &&
          recordingInfo.recording[0].state !== false;

        const collectionId = isRecording
          ? recordingInfo.recording[0].state
          : null;
        const platforms = isRecording
          ? recordingInfo.recording[0].platforms.split(",")
          : [];

        // Detect when recording STARTS (load all collections to show new one)
        if (!recordingState.current.isRecording && isRecording) {
          // Do a full refresh to show the new collection alongside existing ones
          setInitLoading(true);
          const allCollections = await initializePage();
          setDataSources(allCollections);
          dataSourcesRef.current = allCollections;
          dispatch(setSNADataSources(allCollections));
          setInitLoading(false);

          // Update state
          recordingState.current = {
            isRecording: true,
            collectionId,
            platforms,
          };
          return;
        }

        // Detect when recording STOPS
        if (recordingState.current.isRecording && !isRecording) {
          // Targeted refresh: only reload the collections that were being recorded
          await refreshSpecificCollection(
            recordingState.current.collectionId,
            recordingState.current.platforms,
            dataSourcesRef.current,
            (newDataSources) => {
              setDataSources(newDataSources);
              dataSourcesRef.current = newDataSources;
              dispatch(setSNADataSources(newDataSources));
            },
          );

          // Reset state
          recordingState.current = {
            isRecording: false,
            collectionId: null,
            platforms: [],
          };
          return;
        }

        // Update tracking state
        recordingState.current = {
          isRecording,
          collectionId,
          platforms,
        };

        if (isRecording) {
          // Update only metrics (counts), not full content
          await updateCollectionMetrics(
            dataSourcesRef.current,
            (newDataSources) => {
              setDataSources(newDataSources);
              dataSourcesRef.current = newDataSources;
              dispatch(setSNADataSources(newDataSources));
            },
          );
        }
      } catch (error) {
        console.error("Error updating collection metrics:", error);
      }
    };

    const handleVisibilityChange = async () => {
      // Only check when tab becomes visible
      if (document.visibilityState === "visible") {
        await updateMetricsIfRecording();
      }
    };

    const handleWindowFocus = async () => {
      // Check when extension popup window gains focus
      await updateMetricsIfRecording();
    };

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    // Check immediately when component mounts (if visible)
    if (document.visibilityState === "visible") {
      updateMetricsIfRecording();
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [dispatch]);

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
