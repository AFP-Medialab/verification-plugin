import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import VisibilityIcon from "@mui/icons-material/Visibility";

import dayjs from "dayjs";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const clusterTable = (props) => {
  let rows = props.rows;
  let setDetailContent = props.setDetailContent;
  let setOpenDetailModal = props.setOpenDetailModal;
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Cluster</TableCell>
              <TableCell>Number of entries</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.length > 0 ? (
              rows.map((row, idx) => {
                return (
                  <React.Fragment key={"cluster-" + idx}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setDetailContent(row.content);
                            setOpenDetailModal(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.count}</TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                  <Box sx={{ margin: 2 }}>
                    <Typography>
                      Tweets you collect will appear here alongside uploaded
                      data.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
}

const claimTimeline = (clusters, data) => {
  return (
    <ResponsiveContainer width="100%" height={1200}>
      <LineChart
        width={800}
        height={600}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis type="number" domain={[0, "dataMax"]} />
        <Tooltip />
        {/* <Legend /> */}
        {clusters.map((x) => {
          let color = getRandomColor();
          return (
            <Line
              key={"timelineLineCluster_x"}
              type="monotone"
              dataKey={x}
              stroke={color}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

const TextSimilarity = (props) => {
  let setDetailContent = props.setDetailContent;
  let setOpenDetailModal = props.setOpenDetailModal;
  let CommunityForceGraph = props.CommunityForceGraph;
  let TextSimilarityGraph = props.TextSimilarityGraph;
  let setTextSimilarityGraph = props.setTextSimilarityGraph;
  let onlyUnique = props.onlyUnique;
  let dataSources = props.dataSources;
  let selected = props.selected;
  let getTextClusters = props.getTextClusters;
  let selectedSources = dataSources.filter((source) =>
    selected.includes(source.id),
  );
  let selectedContent = selectedSources.map((source) => source.content).flat();
  let nameMaps = new Map(
    selectedSources
      .map((source) =>
        source.accountNameMap ? source.accountNameMap : new Map(),
      )
      .flatMap((m) => [...m]),
  );

  const analyzeTextSimilarity = async () => {
    let resp = await getTextClusters(selectedContent);
    let respFilter = resp.filter((x) => x.cluster != "nan");
    let clusterCounts = {};
    let respGroupedByDate = Object.groupBy(respFilter, ({ date }) =>
      dayjs(date).format("YYYY-MM-DDTHH:mm"),
    );
    let timelineData = Object.keys(respGroupedByDate).map((k) => {
      let dateClusters = Object.groupBy(
        respGroupedByDate[k],
        ({ cluster }) => cluster,
      );
      let ret = { date: k };
      Object.keys(dateClusters).forEach((c) => {
        ret[c] = dateClusters[c].length;
      });
      //  Object.keys(dateClusters).forEach(c=>{
      //     if (clusterCounts[c]) {
      //         clusterCounts[c]+=dateClusters[c].length
      //         ret[c]=clusterCounts[c]
      //     } else {
      //         clusterCounts[c]=dateClusters[c].length
      //         ret[c]=clusterCounts[c]
      //     }
      //  })
      return ret;
    });
    console.log(timelineData);

    let respCluster = Object.groupBy(respFilter, ({ cluster }) => cluster);

    let clusters = Object.keys(respCluster);

    let edges = Object.entries(respCluster)
      .map((x) => x[1].map((y) => y.username).filter(onlyUnique))
      .map((x) => x.map((y) => ({ source: y, dst: x.filter((v) => v != y) })));
    console.log(edges);
    let links = edges
      .map((k) =>
        k.map((x) => x.dst.map((y) => ({ source: x.source, target: y }))),
      )
      .flat()
      .filter((x) => x.length > 0)
      .map((x) => x[0]);
    console.log(links);
    let nodes = links
      .map((x) => x.source)
      .filter(onlyUnique)
      .map((x) => ({ id: x }));
    const data = {
      nodes: nodes,
      links: links,
    };

    let rows = Object.keys(respCluster).map((k, idx) => ({
      name: "Cluster " + idx,
      content: respCluster[k],
      count: respCluster[k].length,
    }));
    console.log(rows);
    let clusterTableProps = {
      rows,
      setDetailContent,
      setOpenDetailModal,
    };

    setTextSimilarityGraph(
      <Stack direction="column">
        <CommunityForceGraph rawData={data}></CommunityForceGraph>
        <Box p={2} />
        {/* {claimTimeline(clusters,timelineData)} */}
        <Box p={2} />
        {clusterTable(clusterTableProps)}
      </Stack>,
    );
  };

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography>Clusters with similar text content</Typography>
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
          onClick={analyzeTextSimilarity}
        >
          Show graph
        </Button>
      </Stack>
      {TextSimilarityGraph ? TextSimilarityGraph : <></>}
    </>
  );
};

export default TextSimilarity;
