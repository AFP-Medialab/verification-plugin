import { ThemeProvider } from "@emotion/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import ForceGraph3D from "react-force-graph-3d";

import { createTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import HeaderTool from "components/Shared/HeaderTool/HeaderTool";
import dayjs from "dayjs";
import MultiGraph from "graphology";
import louvain from "graphology-communities-louvain";
import Papa from "papaparse";
import { Brush } from "recharts";
import * as THREE from "three";
import SpriteText from "three-spritetext";

import { dataAnalysisSna } from "../../../../constants/tools";
import useMyStyles, {
  myCardStyles,
} from "../../../Shared/MaterialUiStyles/useMyStyles";
import CoorPanel from "./Components/CoorPanel";
import DataUpload from "./Components/DataUpload";
import CheckboxTable from "./Components/DataUpload";
import EntryDetailTable from "./Components/EntryDetailTable";
import HandleUploadModal from "./Components/HandleUploadModal";
import PropagationTimeline from "./Components/PropagationTimeline";
import SNAPanel from "./Components/SNAPanel";

const TwitterSnaV2 = () => {
  const theme = createTheme({
    components: {
      MuiCardHeader: {
        styleOverrides: {
          root: {
            paddingTop: "11px!important",
            paddingBottom: "11px!important",
          },
          title: {
            fontSize: "20px!important",
            fontweight: 500,
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          wrapper: {
            fontSize: 12,
          },
          root: {
            minWidth: "25%!important",
          },
        },
      },

      MuiAccordion: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            "&:before": {
              width: "0px",
            },
            border: "1px solid #00926c",
          },
          rounded: {
            borderRadius: "15px",
          },
        },
      },
    },

    palette: {
      primary: {
        light: "#00926c",
        main: "#00926c",
        dark: "#00926c",
        contrastText: "#fff",
      },
    },
  });
  const classes = useMyStyles();
  const cardClasses = myCardStyles();
  const [allTweets, setTweets] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [graphSet, setGraph] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchFilter, setSearchFilter] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [customExpanded, setCustomExpanded] = useState(false);
  const [objectChoice, setObjectChoice] = useState("links");

  const [timeWindow, setTimeWindow] = useState(60);
  const [edgeWeight, setEdgeWeight] = useState(0.5);
  const [minParticipation, setMinParticipation] = useState(1);

  const inputRef = useRef();
  const fgRef = useRef();

  const required_fields = {
    Object: "objects",
    "User ID": "username",
    "Entry ID": "id",
    "Share Time": "ts",
  };

  const metaDefaultFields = new Map([
    ["Object", "Link"],
    ["User ID", "Facebook Id"],
    ["Entry ID", "URL"],
    ["Share Time", "Post Created"],
  ]);

  const [dataSources, setDataSources] = useState([]);
  const [headers, setHeaders] = useState([]);

  const required_fields_labels = new Map();

  const handleUploadClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (event) => {
    setLoading(true);
    const file = event.target.files[0];
    setUploadedFile(file);
    Papa.parse(file, {
      header: true,
      complete: (res) => {
        setUploadedData(res.data);
        setShowUploadModal(true);
      },
    });
  };

  const addUploadToDataSources = () => {
    let fieldMap = metaSelected ? metaDefaultFields : required_fields_labels;
    let accountNameMap = metaSelected
      ? new Map(
          uploadedData.map((item) => [item["Facebook Id"], item["Page Name"]]),
        )
      : new Map();

    let reformatedTweets = Array.from(
      new Map(
        uploadedData.map((item) => [item[fieldMap.get("Entry ID")], item]),
      ).values(),
    )
      .filter(
        (x) =>
          x[fieldMap.get("Object")] && x[fieldMap.get("Object")].length > 0,
      )
      .map(
        ({
          [fieldMap.get("Object")]: objects,
          [fieldMap.get("Share Time")]: date,
          [fieldMap.get("Entry ID")]: id,
          [fieldMap.get("User ID")]: uid,
          ...rest
        }) => ({
          objects: objects,
          date: metaSelected ? date.slice(0, -4) : date,
          username: uid,
          id: id,
          ...rest,
        }),
      );
    let reformatedTweets_withHashtag = metaSelected
      ? reformatedTweets.map(({ ["Message"]: text, ...rest }) => ({
          ...rest,
          text,
          hashtags: text
            .split(" ")
            .filter((x) => x.length > 2 && x.includes("#"))
            .join(","),
        }))
      : reformatedTweets;
    console.log(reformatedTweets);
    dataSources.push({
      id: (dataSources.length + 1).toString(),
      name: uploadedFile.name,
      description: uploadedData.length,
      content: reformatedTweets_withHashtag,
      headers: Object.keys(reformatedTweets_withHashtag[0]),
      accountNameMap: accountNameMap,
    });
    setLoading(false);
    setShowUploadModal(false);
    setUploadedFile(null);
  };

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  function samePair(p1, p2) {
    return (
      (p1[0] == p2[0] && p1[1] == p2[1]) || (p1[1] == p2[0] && p1[0] == p2[1])
    );
  }

  function getPercentileThreshold(arr, percentile) {
    // Sort the counts in ascending order
    const sortedArr = arr.slice().sort((a, b) => a - b);
    const index = Math.floor(percentile * sortedArr.length);
    return sortedArr[index];
  }

  function groupCountsWithThreshold(A, percentile) {
    const countMap = {};

    // Step 1: Group counts for the same pair across different objects
    A.forEach((obj) => {
      obj.users.forEach((user) => {
        const pairString = user.pair.join("-"); // Convert pair to string for uniqueness
        if (countMap[pairString]) {
          countMap[pairString].count += user.count; // Aggregate count
        } else {
          countMap[pairString] = { count: user.count }; // Initialize count for new pair
        }
      });
    });

    // Step 2: Calculate the threshold based on the percentile of the counts
    const counts = Object.values(countMap).map((pair) => pair.count); // Get all the aggregated counts
    const threshold = getPercentileThreshold(counts, percentile);

    // Step 3: Add weight_threshold to each pair in the countMap based on the threshold
    Object.keys(countMap).forEach((pairString) => {
      const pair = countMap[pairString];
      pair.threshold = pair.count > threshold ? 1 : 0; // Add threshold based on the count
    });

    return countMap;
  }

  const detectCOOR = (time_window, edge_weight, data) => {
    let data_filtered = data.filter((v) => v.objects.length > 0); //Only keep entries with objects
    let data_min_participants = Object.groupBy(
      data_filtered,
      ({ username }) => username,
    );
    let data_min_participants_filtered = Object.keys(data_min_participants)
      .map((k) => data_min_participants[k])
      .filter((x) => x.length >= minParticipation)
      .flat();

    let data_grouped = Object.groupBy(
      data_min_participants_filtered,
      ({ objects }) => objects,
    ); //Group entries by the same object
    let data_sharers = Object.entries(data_grouped).filter(
      (v) => v[1].map((o) => o.username).filter(onlyUnique).length > 1,
    ); //Keep entries with objects shared by more than 1 user
    console.log(
      data_sharers.map((x) => x[1].map((v) => [v.date, dayjs(v.date).unix])),
    );
    console.log(data_sharers);
    let data_sharers_in_window = data_sharers
      .map((o) => ({
        //Find groups of users that shared the object together within the time window
        objects: o[0],
        users: o[1]
          .map((v) => ({
            username: v.username,
            ts: dayjs(v.date).unix(),
            cosharers: o[1]
              .filter(
                (x) =>
                  x.username != v.username &&
                  Math.abs(dayjs(x.date).unix() - dayjs(v.date).unix()) <=
                    time_window,
              )
              .map((x) => x.username),
          }))
          .filter((x) => x.cosharers.length > 0),
      }))
      .filter((l) => l.users.length > 0);
    console.log(data_sharers_in_window);
    let data_sharers_grouped = //Group kept users together
      data_sharers_in_window
        .map((l) => ({
          objects: l.objects,
          users: Object.groupBy(l.users, ({ username }) => username),
        }))
        .filter((x) => Object.entries(x.users).length > 0);
    let data_sharers_paired = data_sharers_grouped.map(
      //Separate sharers into pairs
      (x) => ({
        link: x.link,
        users: Object.keys(x.users)
          .map((k) =>
            x.users[k]
              .map((z) => z.cosharers)
              .flat()
              .map((v) => [v, k]),
          )
          .flat(),
      }),
    );
    let sharing_pairs_local_weight = data_sharers_paired.map((x) => {
      //Calculate repetition of shares for same link among pairs
      const result = [];
      x.users.forEach((pair) => {
        const found = result.find((entry) => samePair(entry.pair, pair));
        if (found) {
          found.count += 1;
        } else {
          result.push({ pair: pair, count: 1 });
        }
      });
      result.forEach((x) => (x.count = x.count / 2));
      return {
        link: x.link,
        users: result,
      };
    });
    let sharing_pairs_global_weight = groupCountsWithThreshold(
      sharing_pairs_local_weight,
      edge_weight,
    ); //assing global weights
    return sharing_pairs_global_weight;
  };

  const getTweets = async () => {
    const tweets = await chrome.runtime.sendMessage({
      prompt: "getTweets",
    });
    console.log(tweets);
    // const dedpulicatedTweets = Array.from(
    //   new Map(tweets.map((item) => [item.id, item])).values(),
    // );
    // setTweets(dedpulicatedTweets);
    // let reformatedTweets = dedpulicatedTweets.map(({ links, ...rest }) => ({
    //   objects: links,
    //   ...rest,
    // }));

    let x = Object.groupBy(tweets, ({ collectionID }) => collectionID);
    Object.keys(x).map((k, idx) => {
      let tweets = x[k];
      let dedpulicatedTweets = Array.from(
        new Map(tweets.map((item) => [item.id, item])).values(),
      );
      let reformatedTweets = dedpulicatedTweets.map(
        ({
          id,
          username,
          display_name,
          tweet_text,
          links,
          mentions,
          hashtags,
          ...rest
        }) => ({
          id,
          username,
          display_name,
          text: tweet_text,
          objects: links,
          links: links,
          mentions: mentions.map((x) => "@" + x).join(","),
          hashtags: hashtags.map((x) => "#" + x).join(","),
          ...rest,
        }),
      );
      dataSources.push({
        id: `tweets~${idx}`,
        name: k,
        description: reformatedTweets.length,
        content: reformatedTweets,
        headers:
          reformatedTweets.length > 0 ? Object.keys(reformatedTweets[0]) : [],
      });
    });
    // dataSources.push({
    //   id: "tweets",
    //   name: "Collected tweets",
    //   description: reformatedTweets.length,
    //   content: reformatedTweets,
    //   headers: reformatedTweets.length>0 ? Object.keys(reformatedTweets[0]) : [],
    // });

    setLoading(false);
  };

  const runCoorAnalysis = () => {
    let TIME_WINDOW = timeWindow;
    let EDGE_THRESH = edgeWeight;
    let selectedSources = dataSources.filter((source) =>
      selected.includes(source.id),
    );
    let selectedContent = selectedSources
      .map((source) => source.content)
      .flat();
    let filteredContent =
      selected.length > 0 && selected.every((x) => x.includes("tweets~"))
        ? selectedContent
            .map((o) => {
              let x = o[objectChoice];
              o.objects = x;
              return o;
            })
            .filter((x) => x.objects.length > 0)
        : selectedContent;
    let nameMaps = new Map(
      selectedSources
        .map((source) =>
          source.accountNameMap ? source.accountNameMap : new Map(),
        )
        .flatMap((m) => [...m]),
    );
    let coor_result = detectCOOR(TIME_WINDOW, EDGE_THRESH, filteredContent);
    let candidates =
      EDGE_THRESH > 0
        ? Object.entries(coor_result).filter((x) => x[1].threshold > 0)
        : Object.entries(coor_result);
    let nodes = candidates
      .map((x) => x[0].split("-"))
      .flat(2)
      .filter(onlyUnique);
    let edges = nodes.map((x) => ({
      source: nameMaps.has(x) ? nameMaps.get(x) : x,
      dst: candidates
        .filter((y) => y[0].includes(x))
        .map((z) => z[0].split("-").filter((k) => k != x))
        .flat()
        .map((z) => (nameMaps.has(z) ? nameMaps.get(z) : z)),
    }));

    setGraphData(edges);
    setGraph(true);
  };

  useEffect(() => {
    getTweets();
  }, []);

  const downloadTweetCSV = () => {
    let csvData = allTweets
      .filter((v) => v.links.length > 0)
      .map((obj, idx) => [
        idx,
        obj.username,
        obj.id,
        obj.links[0],
        dayjs(obj.date).unix(),
      ])
      .join("\n");

    let csvFile =
      ` ,account_id,content_id,object_id,timestamp_share\n` + csvData;

    const blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    const blobUrl = URL.createObjectURL(blob);
    a.href = blobUrl;
    a.download = `COOR_Test.csv`;
    a.click();
  };

  const deleteTweets = () => {
    chrome.runtime.sendMessage({ prompt: "deleteTweets" });
  };

  const CommunityForceGraph = ({ rawData }) => {
    const graph = new MultiGraph();
    rawData.nodes.forEach((node, idx) => {
      !graph.hasNode(node.id)
        ? graph.addNode(node.id, {})
        : graph.addNode(node.id + idx, {});
    });
    rawData.links.forEach((link) => {
      if (
        graph.hasNode(link.source) &&
        graph.hasNode(link.target) &&
        !graph.hasUndirectedEdge(link.source, link.target)
      ) {
        graph.addUndirectedEdge(link.source, link.target);
      }
    });
    const communities = louvain(graph);
    console.log(communities);

    graph.updateEachNodeAttributes((_, attr, key) => ({
      ...attr,
      community: communities[key],
    }));

    // graph.forEachNode((node)=>console.log(node))

    // Calculate degrees
    const degrees = {};
    graph.forEachNode((node) => {
      degrees[node] = graph.degree(node);
    });

    // // Prepare data for ForceGraph
    const nodes = graph.nodes().map((id) => ({
      id,
      // val: degrees[id], // used for node size
      group: communities[id],
    }));

    // console.log(nodes)

    // const links = graph.edges().map((edge) => {
    //   const { source, target } = graph.extremities(edge);
    //   return { source, target };
    // });

    // const processedData = (() => {
    //   const graph = new MultiGraph();
    //   console.log(graph.multi);

    //   // Add nodes
    //   rawData.nodes.forEach((node) => {
    //     graph.addNode(node.id, {});
    //   });

    //   // Add edges
    //   rawData.links.forEach((link) => {
    //     if (
    //       graph.hasNode(link.source) &&

    //       graph.hasNode(link.target)
    //     ) {

    //       graph.addUndirectedEdge(link.source, link.target);
    //     }
    //   });
    //   console.log("OK")
    //   // Run Louvain
    //   const communities = louvain(graph);
    //   console.log(communities)
    //   graph.updateEachNodeAttributes((_, attr, key) => ({
    //     ...attr,
    //     community: communities[key],
    //   }));

    //   // Calculate degrees
    //   const degrees = {};
    //   graph.forEachNode((node) => {
    //     degrees[node] = graph.degree(node);
    //   });

    //   // Prepare data for ForceGraph
    //   const nodes = graph.nodes().map((id) => ({
    //     id,
    //     val: degrees[id], // used for node size
    //     group: graph.getNodeAttribute(id, "community"),
    //   }));

    //   const links = graph.edges().map((edge) => {
    //     const { source, target } = graph.extremities(edge);
    //     return { source, target };
    //   });

    //   return { nodes, links };
    // }, [rawData]);

    // console.log(processedData[0])
    let links = rawData.links;
    return (
      <ForceGraph2D
        graphData={{ nodes, links }}
        nodeRelSize={6} // this + `val` determines size
        nodeAutoColorBy="group"
        linkColor={() => "#aaa"}
        nodeLabel="id"
        nodeCanvasObjectMode={() => "after"}
        nodeCanvasObject={(node, ctx) => {
          const label = node.id;
          const fontSize = 4;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, node.x, node.y);
        }}
      />
    );
  };

  const LabeledGraph = ({ graphData }) => {
    // Calculate node degrees for sizing
    const nodeDegrees = {};
    graphData.links.forEach(({ source, target }) => {
      nodeDegrees[source] = (nodeDegrees[source] || 0) + 1;
      nodeDegrees[target] = (nodeDegrees[target] || 0) + 1;
    });
    return (
      <ForceGraph3D
        width={1400}
        height={700}
        graphData={graphData}
        nodeAutoColorBy="id"
        nodeThreeObject={(node) => {
          const group = new THREE.Group();
          const degree = nodeDegrees[node.id] || 1;
          const radius = 2 + Math.log(degree + 1) * 3;

          // Sphere node
          const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(radius),
            new THREE.MeshStandardMaterial({
              color: node.color || "steelblue",
              roughness: 0.4,
              metalness: 0.3,
            }),
          );
          group.add(sphere);

          // Label
          const label = new SpriteText(node.id);
          label.color = "white";
          label.textHeight = radius * 0.6;
          label.position.y = radius + 1;
          group.add(label);

          return group;
        }}
        nodeThreeObjectExtend={true}
      />
    );
  };

  const showGraph = () => {
    let n = graphData.map((x) => ({ id: x.source }));
    let e = graphData
      .map((x) => x.dst.map((y) => ({ source: x.source, target: y })))
      .flat();
    const data = {
      nodes: n,
      links: e,
    };
    if (graphData.length === 0) {
      return (
        <>
          {" "}
          <Typography> No coordinated behavior detected </Typography>
        </>
      );
    }
    return <CommunityForceGraph rawData={data}></CommunityForceGraph>;
    // return <LabeledGraph graphData={data}></LabeledGraph>;
    // For 2D Graph
    return (
      <>
        <CardHeader title="COOR Graph" />
        <ForceGraph2D
          width={1400}
          height={700}
          ref={fgRef}
          graphData={data}
          nodeAutoColorBy="id"
          nodeLabel="id"
          nodeCanvasObjectMode={() => "after"}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, node.x, node.y);
          }}
        />
      </>
    );
  };

  const [metaSelected, setMetaSelected] = useState(false);

  const modalProps = {
    showUploadModal,
    setShowUploadModal,
    setLoading,
    required_fields,
    required_fields_labels,
    uploadedData,
    addUploadToDataSources,
    customExpanded,
    setCustomExpanded,
    metaSelected,
    setMetaSelected,
  };

  const tableProps = {
    allTweets,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    searchFilter,
    setSearchFilter,
    expanded,
    setExpanded,
    headers,
  };

  const [selected, setSelected] = useState([]);

  const coorProps = {
    selected,
    timeWindow,
    setGraph,
    setTimeWindow,
    edgeWeight,
    setEdgeWeight,
    minParticipation,
    setMinParticipation,
    uploadedData,
    setShowUploadModal,
    runCoorAnalysis,
    graphSet,
    showGraph,
    objectChoice,
    setObjectChoice,
  };

  const [rows, setRows] = useState(dataSources);

  const [openRowIds, setOpenRowIds] = useState([]);

  const dataProps = {
    inputRef,
    handleFileChange,
    handleUploadClick,
    uploadedFile,
    allTweets,
    deleteTweets,
    downloadTweetCSV,
    selected,
    setSelected,
    rows,
    setRows,
  };

  const checkboxTableProps = {
    inputRef,
    handleFileChange,
    handleUploadClick,
    uploadedFile,
    deleteTweets,
    downloadTweetCSV,
    openRowIds,
    setOpenRowIds,
    rows,
    setRows,
    selected,
    setSelected,
    allTweets,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    searchFilter,
    setSearchFilter,
    expanded,
    setExpanded,
    headers,
  };

  const [plot, setPlot] = useState(undefined);

  const [SNATab, setSNATab] = useState(0);

  const propTimelineProps = {
    dataSources,
    selected,
    setPlot,
    plot,
    SNATab,
    setSNATab,
  };

  const [activityChart, setActivityChart] = useState(undefined);
  const [activitySelect, setActivitySelect] = useState("entries");

  const accountActivityProps = {
    dataSources,
    selected,
    activityChart,
    setActivityChart,
    activitySelect,
    setActivitySelect,
  };

  const [mentionGraph, setMentionGraph] = useState(undefined);

  const mostMentionProps = {
    dataSources,
    selected,
    mentionGraph,
    setMentionGraph,
  };

  const [hashtagGraph, setHashtagGraph] = useState("");

  const hashtagProps = {
    dataSources,
    selected,
    hashtagGraph,
    setHashtagGraph,
  };

  const textAnalysisProps = {
    dataSources,
    selected,
  };
  const SNATabProps = {
    SNATab,
    setSNATab,
    propTimelineProps,
    accountActivityProps,
    coorProps,
    mostMentionProps,
    hashtagProps,
    textAnalysisProps,
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        {uploadedData ? HandleUploadModal(modalProps) : <></>}
        <HeaderTool
          name={"Twitter SNA V2"}
          description={"New twitter analysis tool"}
          icon={
            <dataAnalysisSna.icon sx={{ fill: "#00926c", fontSize: "40px" }} />
          }
        />
        <Card variant="outlined" className={cardClasses.root}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box p={4}>
              {CheckboxTable(checkboxTableProps)}
              {/* <Box p={4}></Box> */}
              {/* {EntryDetailTable(tableProps)} */}
              <Box p={2} />
              {SNAPanel(SNATabProps)}
            </Box>
          )}
        </Card>
      </ThemeProvider>
    </div>
  );
};

export default TwitterSnaV2;
