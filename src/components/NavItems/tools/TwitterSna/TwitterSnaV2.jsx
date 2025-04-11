import { ThemeProvider } from "@emotion/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import ForceGraph3D from "react-force-graph-3d";

import { createTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Grid2 from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { GridExpandMoreIcon } from "@mui/x-data-grid";
import HeaderTool from "components/Shared/HeaderTool/HeaderTool";
import dayjs from "dayjs";
import MultiGraph from "graphology";
import louvain from "graphology-communities-louvain";
import Papa from "papaparse";
import * as THREE from "three";
import SpriteText from "three-spritetext";

import { dataAnalysisSna } from "../../../../constants/tools";
import useMyStyles, {
  myCardStyles,
} from "../../../Shared/MaterialUiStyles/useMyStyles";

const CustomTableCell = ({ text, maxChars = 100 }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > maxChars;

  const handleToggle = () => setExpanded((prev) => !prev);

  return (
    <TableCell sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
      <Typography variant="body2">
        {expanded || !isLong ? text : `${text.slice(0, maxChars)}...`}
      </Typography>
      {isLong && (
        <Button onClick={handleToggle} size="small">
          {expanded ? "Show less" : "Show more"}
        </Button>
      )}
    </TableCell>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

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

  const [timeWindow, setTimeWindow] = useState(60);
  const [edgeWeight, setEdgeWeight] = useState(0.5);

  const inputRef = useRef();
  const fgRef = useRef();

  const required_fields = {
    Object: "objects",
    "User ID": "username",
    "Entry ID": "id",
    "Share Time": "ts",
  };

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
      },
    });
    setLoading(false);
  };

  const processUploadedFile = () => {
    setShowUploadModal(false);
    let file = uploadedFile;
    let TIME_WINDOW = timeWindow;
    let EDGE_THRESH = edgeWeight;
    let accountNameMap = new Map(
      uploadedData.map((item) => [item["Facebook Id"], item["Page Name"]]),
    );
    console.log(accountNameMap);
    let reformatedTweets = Array.from(
      new Map(
        uploadedData.map((item) => [
          item[required_fields_labels.get("Entry ID")],
          item,
        ]),
      ).values(),
    )
      .filter(
        (x) =>
          x[required_fields_labels.get("Object")] &&
          x[required_fields_labels.get("Object")].length > 0,
      )
      .map(
        ({
          [required_fields_labels.get("Object")]: objects,
          [required_fields_labels.get("Share Time")]: date,
          [required_fields_labels.get("Entry ID")]: id,
          [required_fields_labels.get("User ID")]: uid,
          ...rest
        }) => ({
          objects: objects,
          date: date.slice(0, -4),
          username: uid,
          id: id,
          ...rest,
        }),
      );
    console.log(reformatedTweets);
    setTweets(reformatedTweets);

    let coor_result = detectCOOR(TIME_WINDOW, EDGE_THRESH, reformatedTweets);
    console.log(coor_result);
    console.log(Object.keys(coor_result));
    console.log(
      Object.keys(coor_result)
        .map((x) => x.split("-"))
        .filter((x) => x.length > 2),
    );
    let candidates =
      EDGE_THRESH > 0
        ? Object.entries(coor_result).filter((x) => x[1].threshold > 0)
        : Object.entries(coor_result);
    console.log(candidates);
    let nodes = candidates
      .map((x) => x[0].split("-"))
      .flat(2)
      .filter(onlyUnique);
    console.log(nodes);

    // Object.entries(grC).map(x=>console.log(x))
    console.log(candidates);
    let edges = nodes.map((x) => ({
      source: accountNameMap.get(x),
      dst: candidates
        .filter((y) => y[0].includes(x))
        .map((z) => z[0].split("-").filter((k) => k != x))
        .flat()
        .map((z) => accountNameMap.get(z)),
    }));
    console.log(edges);

    setGraphData(edges);
    setGraph(true);
    setLoading(false);

    // Papa.parse(file, {
    //   header: true,
    //   complete: (res) => {
    //     console.log("----------------START CSV PROCESSING--------------");
    //     console.log(res.data);
    //     let accountNameMap = new Map(
    //       res.data.map((item) => [item["Facebook Id"], item["Page Name"]]),
    //     );
    //     console.log(accountNameMap);
    //     let reformatedTweets = Array.from(
    //       new Map(res.data.map((item) => [item.URL, item])).values(),
    //     )
    //       .filter((x) => x.Link && x.Link.length > 0)
    //       .map(
    //         ({
    //           Link,
    //           ["Post Created"]: date,
    //           URL,
    //           ["Facebook Id"]: fid,
    //           ...rest
    //         }) => ({
    //           objects: Link,
    //           date: date.slice(0, -4),
    //           username: fid,
    //           id: URL,
    //           ...rest,
    //         }),
    //       );
    //     console.log(reformatedTweets);
    //     setTweets(reformatedTweets);

    //     let coor_result = detectCOOR(
    //       TIME_WINDOW,
    //       EDGE_THRESH,
    //       reformatedTweets,
    //     );
    //     console.log(coor_result);
    //     console.log(Object.keys(coor_result));
    //     console.log(
    //       Object.keys(coor_result)
    //         .map((x) => x.split("-"))
    //         .filter((x) => x.length > 2),
    //     );
    //     let candidates =
    //       EDGE_THRESH > 0
    //         ? Object.entries(coor_result).filter((x) => x[1].threshold > 0)
    //         : Object.entries(coor_result);
    //     console.log(candidates);
    //     let nodes = candidates
    //       .map((x) => x[0].split("-"))
    //       .flat(2)
    //       .filter(onlyUnique);
    //     console.log(nodes);

    //     // Object.entries(grC).map(x=>console.log(x))
    //     console.log(candidates);
    //     let edges = nodes.map((x) => ({
    //       source: accountNameMap.get(x),
    //       dst: candidates
    //         .filter((y) => y[0].includes(x))
    //         .map((z) => z[0].split("-").filter((k) => k != x))
    //         .flat()
    //         .map((z) => accountNameMap.get(z)),
    //     }));
    //     console.log(edges);

    //     setGraphData(edges);
    //     setGraph(true);
    //     setLoading(false);
    //   },
    // });
    // setLoading(true)
    // setTweets()
    // do something with the file here
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
    let data_grouped = Object.groupBy(data_filtered, ({ objects }) => objects); //Group entries by the same object
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
    let TIME_WINDOW = 600;
    let EDGE_THRESH = 0.5;
    const tweets = await chrome.runtime.sendMessage({
      prompt: "getTweets",
    });
    console.log(tweets);
    const dedpulicatedTweets = Array.from(
      new Map(tweets.map((item) => [item.id, item])).values(),
    );
    setTweets(dedpulicatedTweets);

    setLoading(false);
  };

  const runTweetCoor = () => {
    let TIME_WINDOW = timeWindow;
    let EDGE_THRESH = edgeWeight;

    let reformatedTweets = allTweets.map(({ links, ...rest }) => ({
      objects: links,
      ...rest,
    }));
    let coor_result = detectCOOR(TIME_WINDOW, EDGE_THRESH, reformatedTweets);

    let candidates =
      EDGE_THRESH > 0
        ? Object.entries(coor_result).filter((x) => x[1].threshold > 0)
        : Object.entries(coor_result);
    let nodes = candidates
      .map((x) => x[0].split("-"))
      .flat(2)
      .filter(onlyUnique);
    console.log(nodes);

    // Object.entries(grC).map(x=>console.log(x))
    console.log(candidates);
    let edges = nodes.map((x) => ({
      source: x,
      dst: candidates
        .filter((y) => y[0].includes(x))
        .map((z) => z[0].split("-").filter((k) => k != x))
        .flat(),
    }));
    console.log(edges);

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
    const processedData = useMemo(() => {
      const graph = new MultiGraph();

      // Add nodes
      rawData.nodes.forEach((node) => {
        graph.addNode(node.id, {});
      });

      // Add edges
      rawData.links.forEach((link) => {
        if (
          graph.hasNode(link.source) &&
          graph.hasNode(link.target) &&
          !graph.hasEdge({ source: link.source, target: link.target })
        ) {
          graph.addUndirectedEdge(link.source, link.target);
        }
      });

      // Run Louvain
      const communities = louvain(graph);
      graph.updateEachNodeAttributes((_, attr, key) => ({
        ...attr,
        community: communities[key],
      }));

      // Calculate degrees
      const degrees = {};
      graph.forEachNode((node) => {
        degrees[node] = graph.degree(node);
      });

      // Prepare data for ForceGraph
      const nodes = graph.nodes().map((id) => ({
        id,
        val: degrees[id], // used for node size
        group: graph.getNodeAttribute(id, "community"),
      }));

      const links = graph.edges().map((edge) => {
        const { source, target } = graph.extremities(edge);
        return { source, target };
      });

      return { nodes, links };
    }, [rawData]);

    return (
      <ForceGraph2D
        graphData={processedData}
        nodeRelSize={6} // this + `val` determines size
        nodeAutoColorBy="group"
        linkColor={() => "#aaa"}
        nodeLabel="id"
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
    // return (<CommunityForceGraph rawData={data}></CommunityForceGraph>)
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

  return (
    <div>
      <ThemeProvider theme={theme}>
        {uploadedData ? (
          <Modal
            open={showUploadModal}
            onClose={() => {
              setUploadedData(null);
              setUploadedFile(null);
              setShowUploadModal(false);
              setLoading(false);
            }}
          >
            <Box display="flex" flexDirection="column" gap={2} sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Set required fields for COOR Analysis
              </Typography>
              {Object.keys(required_fields).map((k) => (
                <FormControl key={k} fullWidth>
                  <InputLabel>{k}</InputLabel>
                  <Select
                    onChange={(e) => {
                      required_fields_labels.set(k, e.target.value);
                    }}
                  >
                    {Object.keys(uploadedData[0]).map((x) => (
                      <MenuItem key={x} value={x}>
                        {x}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
              <Button
                variant="outlined"
                sx={{
                  color: "green",
                  borderColor: "green",
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(0, 128, 0, 0.1)", // light green on hover
                    borderColor: "darkgreen",
                  },
                }}
                onClick={processUploadedFile}
              >
                Upload
              </Button>
            </Box>
          </Modal>
        ) : (
          <></>
        )}
        <HeaderTool
          name={"Twitter SNA V2"}
          description={"New twitter analysis tool"}
          icon={
            <dataAnalysisSna.icon sx={{ fill: "#00926c", fontSize: "40px" }} />
          }
        />
        <Card variant="outlined" className={cardClasses.root}>
          <CardHeader
            title={"Collected tweets"}
            className={classes.headerUploadedImage}
          />
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box p={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h6" align="left">
                  Upload CrowdTangle CSV:
                </Typography>
                <input
                  type="file"
                  hidden
                  ref={inputRef}
                  onChange={handleFileChange}
                />
                <Button
                  variant="outlined"
                  sx={{
                    color: "green",
                    borderColor: "green",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(0, 128, 0, 0.1)", // light green on hover
                      borderColor: "darkgreen",
                    },
                  }}
                  onClick={handleUploadClick}
                >
                  {uploadedFile ? uploadedFile.name : "Upload file"}
                </Button>
              </Stack>
              <Box p={4}></Box>
              <Grid2 container spacing={4} alignItems="center">
                <Grid2>
                  <Typography
                    variant="h6"
                    align="left"
                    style={{ paddingLeft: "0px" }}
                  >
                    {"Total number of tweets collected: " + allTweets.length}{" "}
                    {/** keyword */}
                  </Typography>
                </Grid2>
                <Grid2
                  size={{ xs: 4 }}
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid2 size={{ xs: 8 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      onClick={deleteTweets}
                    >
                      Delete {/** keyword */}
                    </Button>
                  </Grid2>
                  <Grid2 size={{ xs: 8 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={downloadTweetCSV}
                    >
                      Download CSV {/** keyword */}
                    </Button>
                  </Grid2>
                </Grid2>
              </Grid2>
              <Box p={4}></Box>
              <Paper elevation={3} sx={{ width: "100%" }}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography component="span"> Tweet details </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box p={2}></Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography pl={2}> Search:</Typography>
                      <TextField
                        variant="outlined"
                        sx={{ width: "400px" }}
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                      />
                    </Stack>
                    <Box p={2}></Box>
                    <TableContainer sx={{ maxHeight: 600 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {Object.keys(allTweets[0]).map((k) => (
                              <TableCell
                                key={k}
                                align="center"
                                style={{ minWidth: 200 }}
                              >
                                {k}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {searchFilter.length > 0
                            ? allTweets
                                .filter((x) =>
                                  Object.entries(x)
                                    .flat(2)
                                    .some((k) =>
                                      k.toString().includes(searchFilter),
                                    ),
                                )
                                .slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage,
                                )
                                .map((x) => {
                                  return (
                                    <TableRow
                                      hover
                                      role="checkbox"
                                      tabIndex={-1}
                                      key={x.id + "#"}
                                    >
                                      {Object.keys(allTweets[0]).map((k) => (
                                        <CustomTableCell
                                          text={x[k] ? x[k] : "Missing"}
                                          key={k}
                                          align="left"
                                        ></CustomTableCell>
                                      ))}
                                    </TableRow>
                                  );
                                })
                            : allTweets
                                .slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage,
                                )
                                .map((x) => {
                                  return (
                                    <TableRow
                                      hover
                                      role="checkbox"
                                      tabIndex={-1}
                                      key={x.id + "#"}
                                    >
                                      {Object.keys(allTweets[0]).map((k) => (
                                        <CustomTableCell
                                          text={x[k] ? x[k] : "Missing"}
                                          key={k}
                                          align="left"
                                        ></CustomTableCell>
                                      ))}
                                    </TableRow>
                                  );
                                })}
                        </TableBody>
                      </Table>
                      <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={
                          searchFilter.length > 0
                            ? allTweets.filter((x) =>
                                Object.entries(x)
                                  .flat(2)
                                  .some((k) =>
                                    k.toString().includes(searchFilter),
                                  ),
                              ).length
                            : allTweets.length
                        }
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              </Paper>
              <Box p={2} />
              <Accordion>
                <AccordionSummary
                  expandIcon={<GridExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography component="span"> COOR Graph </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Box p={2}></Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography pl={2}> Time window:</Typography>
                      <TextField
                        variant="outlined"
                        sx={{ width: "200px" }}
                        value={timeWindow}
                        onChange={(e) => {
                          setGraph(false);
                          setTimeWindow(e.target.value);
                        }}
                      />
                      <Typography pl={2}> Edge weight:</Typography>
                      <TextField
                        variant="outlined"
                        sx={{ width: "200px" }}
                        value={edgeWeight}
                        onChange={(e) => {
                          setGraph(false);
                          setEdgeWeight(e.target.value);
                        }}
                      />
                      <Button
                        variant="outlined"
                        sx={{
                          color: "green",
                          borderColor: "green",
                          backgroundColor: "transparent",
                          "&:hover": {
                            backgroundColor: "rgba(0, 128, 0, 0.1)", // light green on hover
                            borderColor: "darkgreen",
                          },
                        }}
                        onClick={
                          uploadedData ? setShowUploadModal : runTweetCoor
                        }
                      >
                        Run COOR Detection
                      </Button>
                    </Stack>
                  </Box>
                  <Box p={2}></Box>
                  {graphSet ? showGraph() : <></>}
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </Card>
      </ThemeProvider>
    </div>
  );
};

export default TwitterSnaV2;
