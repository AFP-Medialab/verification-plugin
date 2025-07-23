import React from "react";
import ForceGraph2D from "react-force-graph-2d";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { SNAButton } from "components/NavItems/tools/SNA/utils/SNAButton";
import {
  getSelectedSourceSharedHeaders,
  getSelectedSourcesNameMaps,
  getTextClusters,
  onlyUnique,
} from "components/NavItems/tools/SNA/utils/accessSavedCollections";
import { dayjs } from "dayjs";
import { MultiUndirectedGraph } from "graphology";
import louvain from "graphology-communities-louvain";

const MAX_TABLE_TEXT_LENGTH = 45;

const coorTextEntry = (
  keyword,
  fieldDescription,
  fieldHelpText,
  textFieldVar,
  textFieldVarSetter,
) => {
  return (
    <Box key={"coorEntry_" + fieldDescription}>
      <Typography sx={{ padding: 0.5 }}>{keyword(fieldDescription)}</Typography>
      <Tooltip title={keyword(fieldHelpText)}>
        <IconButton>
          <HelpOutlineIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <FormControl>
        <TextField
          variant="outlined"
          sx={{ width: "100px" }}
          value={textFieldVar}
          onChange={(e) => {
            textFieldVarSetter(e.target.value);
          }}
        />
      </FormControl>
    </Box>
  );
};

const coorFieldSelect = (
  keyword,
  fieldDescription,
  fieldHelpText,
  selectVar,
  setSelectVar,
  selectOptions,
) => {
  return (
    <>
      <Typography sx={{ padding: 0.5 }}>{fieldDescription}</Typography>
      <Tooltip title={keyword(fieldHelpText)}>
        <IconButton>
          <HelpOutlineIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <FormControl>
        <InputLabel>{keyword(fieldDescription)}</InputLabel>
        <Select
          value={selectVar}
          onChange={(e) => {
            setSelectVar(e.target.value);
          }}
        >
          {selectOptions.map((option, idx) => (
            <MenuItem key={option.value + idx} value={option.value}>
              {option.isKeyword ? keyword(option.label) : option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export const getObjectSelectOptions = (dataSources, selected) => {
  let textSimilarityObjectSelect = [
    {
      label: "snaTools_coorTextSimilarityOption",
      value: "textSimilarity",
      isKeyword: true,
    },
  ];

  let sharedHeadersObjectSelect = getSelectedSourceSharedHeaders(
    dataSources,
    selected,
  ).map((header) => ({
    label: header,
    value: header,
    isKeyword: false,
  }));

  let coorObjectSelectOptions = textSimilarityObjectSelect.concat(
    sharedHeadersObjectSelect,
  );
  return coorObjectSelectOptions;
};

export const coorSettingsDisplay = ({
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
}) => {
  let coorObjectSelectOptions = getObjectSelectOptions(dataSources, selected);

  const coorSettingsFields = [
    {
      id: "timeWindow",
      component: coorTextEntry(
        keyword,
        "snaTools_coorTimeWindowLabel",
        "snaTools_coorTimeWindowHelperText",
        coorTimeWindow,
        setCoorTimeWindow,
      ),
    },
    {
      id: "edgeThresh",
      component: coorTextEntry(
        keyword,
        "snaTools_coorEdgeThreshLabel",
        "snaTools_coorEdgeThreshHelperText",
        coorEdgeThresh,
        setCoorEdgeThresh,
      ),
    },
    {
      id: "minParticipants",
      component: coorTextEntry(
        keyword,
        "snaTools_coorMinParticipantsLabel",
        "snaTools_coorMinParticipantsHelperText",
        coorMinParticipation,
        setCoorMinParticipation,
      ),
    },
    {
      id: "objectChoice",
      component: coorFieldSelect(
        keyword,
        "snaTools_coorObjectChoiceLabel",
        "snaTools_coorObjectChoiceHelperText",
        coorObjectChoice,
        setCoorObjectChoice,
        coorObjectSelectOptions,
      ),
    },
  ];

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        {coorSettingsFields.map((option) => option.component)}
      </Stack>
    </>
  );
};

const getCoorContent = async (
  objectChoice,
  selectedContent,
  authenticatedRequest,
) => {
  if (!selectedContent.length > 0) return;
  if (objectChoice === "textSimilarity") {
    let resp = await getTextClusters(selectedContent, authenticatedRequest);
    let filteredResp = resp
      .map((o) => {
        let x = o["cluster"];
        o.objects = x;
        return o;
      })
      .filter(
        (x) =>
          x.objects?.length > 0 && x.objects != "NaN" && x.objects != "nan",
      );
    return filteredResp;
  }
  let filteredContent = selectedContent
    .map((o) => {
      let x = o[objectChoice];
      o.objects = x;
      return o;
    })
    .filter((o) => o.objects?.length > 0);
  return filteredContent;
};

/**
 * Takes entries already filtered
 * to retain only those with objects
 *
 * Filter the entries to keep only users
 * meeting the minParticipation criterion
 * then by those containing a same object
 * shared by more than one user
 * then those shared within the timeWindow
 * then assign weights to the retained
 * pairs of users measuring how often they
 * shared hte same content.
 *
 * If edgeThresh>0 return only entries
 * in the edgeThresh percentile
 * Else return all entries meeting
 * cosharing criteria
 *
 * returns [{
 *      cosharers: str ("firstUserId-secondUserId"),
 *      count: int,
 *      entries: Object[],
 * }]
 *
 * @param {int} timeWindow the timeWindow to detect cosharing separating two entries with the same object
 * @param {double} edgeThresh to retain users who coshared only in the edgeThresh [0-1] percentile
 * @param {int} minParticipation to retain users who authored dataset entries more than minParticipation
 * @param {object[]} content the dataset, list of objects that has been pre-processed
 * @returns {object[]} list of cosharing user pairs, how often they posted the same object and their entries in the dataset
 */
const detectCoor = (timeWindow, edgeThresh, minParticipation, content) => {
  let contentGroupedByUser = Object.groupBy(
    content,
    ({ username }) => username,
  );

  let contentFilteredByMinParticipation = Object.values(contentGroupedByUser)
    .filter((x) => x.length >= minParticipation)
    .flat();

  let contentGroupedByObject = Object.groupBy(
    contentFilteredByMinParticipation,
    ({ objects }) => objects,
  );

  let contentSharedByMultipleUsers = Object.values(
    contentGroupedByObject,
  ).filter(
    (entriesByObject) =>
      entriesByObject.map((e) => e.username).filter(onlyUnique).length > 1,
  );

  let cosharingInTimeWindow = contentSharedByMultipleUsers
    .map((groupedContent) => {
      let objects = groupedContent[0].objects;
      let entryList = groupedContent.map((entry) => ({
        entry: entry,
        username: entry.username,
        ts: dayjs(entry.date).unix(),
      }));
      entryList.forEach((user) => {
        user.cosharers = entryList
          .filter(
            (other) =>
              other.username != user.username &&
              Math.abs(user.ts - other.ts) <= timeWindow,
          )
          .map((other) => other.username);
      });
      let onlyCosharingEntryList = entryList.filter(
        (user) => user.cosharers.length > 0,
      );
      return {
        objects: objects,
        entries: onlyCosharingEntryList,
      };
    })
    .flat()
    .filter((groupedContent) => groupedContent.entries.length > 0);

  let cosharingPairs = {};

  cosharingInTimeWindow.forEach((sharedObject) => {
    sharedObject.entries.forEach((entry) =>
      entry.cosharers.forEach((cosharer) => {
        let pairId = [entry.username, cosharer].sort().join("-");
        if (cosharingPairs[pairId]) {
          cosharingPairs[pairId].count++;

          cosharingPairs[pairId].entries
            .map((e) => e.id)
            .includes(entry.entry.id)
            ? {}
            : cosharingPairs[pairId].entries.push(entry.entry);
        } else {
          cosharingPairs[pairId] = {
            count: 1,
            entries: [entry.entry],
            cosharers: pairId,
          };
        }
      }),
    );
  });

  if (edgeThresh > 0) {
    let ret = Object.values(cosharingPairs)
      .sort((a, b) => a.count - b.count)
      .slice(Math.floor(edgeThresh * Object.values(cosharingPairs).length));

    return ret;
  } else {
    return Object.values(cosharingPairs);
  }
};

const getCosharersByObject = (coorResult) => {
  let cosharedEntries = coorResult
    .map((sharingPair) => sharingPair.entries)
    .flat();
  let cosharingByObjects = Object.groupBy(
    cosharedEntries,
    ({ objects }) => objects,
  );
  return cosharingByObjects;
};

export const runCoorAnalysis = async (
  selectedContent,
  {
    coorTimeWindow,
    coorEdgeThresh,
    coorMinParticipation,
    coorObjectChoice,
    authenticatedRequest,
  },
) => {
  let readiedContent = await getCoorContent(
    coorObjectChoice,
    selectedContent,
    authenticatedRequest,
  );
  let coorResult = detectCoor(
    coorTimeWindow,
    coorEdgeThresh,
    coorMinParticipation,
    readiedContent,
  );
  return coorResult;
};

export const generateCoorGraphData = (coorResult, dataSources, selected) => {
  let nodes = {};
  let edges = [];
  let nameMaps = getSelectedSourcesNameMaps(dataSources, selected);
  coorResult.forEach((cosharingPair) => {
    let userPair = cosharingPair.cosharers.split("-");
    edges.push({
      source: userPair[0],
      target: userPair[1],
    });
    userPair.forEach((user) => {
      if (nodes[user]) {
        cosharingPair.entries.forEach((entry) => {
          if (!nodes[user].entries.map((e) => e.id).includes(entry.id)) {
            nodes[user].entries.push(entry);
          }
        });
      } else {
        nodes[user] = {
          id: user,
          entries: cosharingPair.entries,
          displayName: nameMaps.has(user) ? nameMaps.get(user) : user,
        };
      }
    });
  });
  let graphData = {
    nodes: Object.values(nodes),
    links: edges,
  };
  return graphData;
};

export const generateCoorNetworkGraph = (graphData, vizArgs) => {
  let setDetailContent = vizArgs.setDetailContent;
  let setOpenDetailModal = vizArgs.setOpenDetailModal;

  let graph = new MultiUndirectedGraph();

  graphData.nodes.forEach((node) => {
    if (!graph.hasNode(node.id)) graph.addNode(node.id, node);
  });
  graphData.links.forEach((edge) => {
    if (
      graph.hasNode(edge.source) &&
      graph.hasNode(edge.target) &&
      !graph.hasUndirectedEdge(edge.source, edge.target)
    ) {
      graph.addUndirectedEdge(edge.source, edge.target);
    }
  });

  const communities = louvain(graph);

  graphData.nodes.forEach((node) => (node.community = communities[node.id]));

  const handleNodeClick = (node) => {
    let detailModalContent = graph.getNodeAttribute(node.id, "entries");
    setDetailContent(detailModalContent);
    setOpenDetailModal(true);
  };

  return (
    <ForceGraph2D
      graphData={graphData}
      warmupTicks={100}
      cooldownTicks={0}
      autoPauseRedraw={true}
      nodeRelSize={6} // this + `val` determines size
      nodeAutoColorBy="community"
      linkColor={() => "#aaa"}
      nodeLabel={"displayName"}
      nodeCanvasObjectMode={() => "after"}
      nodeCanvasObject={(node, ctx) => {
        const fontSize = 4;
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.displayName, node.x, node.y);
      }}
      onNodeClick={(node) => handleNodeClick(node)}
    />
  );
};

const coorTableHeader = (keyword) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell>{keyword("snaTools_coorTableObjectsHeader")}</TableCell>
        <TableCell>{keyword("snaTools_coorTableEntryCountHeader")}</TableCell>
        <TableCell>{keyword("snaTools_coorTableUserCountHeader")}</TableCell>
      </TableRow>
    </TableHead>
  );
};

const coorTableBody = (coorResult, setDetailContent, setOpenDetailModal) => {
  let coorByObject = getCosharersByObject(coorResult);
  const showDetailModalWithObject = (detailContent) => {
    setDetailContent(detailContent);
    setOpenDetailModal(true);
  };

  const countUsersByObject = (objectEntries) => {
    return objectEntries.map((entry) => entry.username).filter(onlyUnique)
      .length;
  };
  return Object.keys(coorByObject).map((sharedObject) => (
    <TableRow key={"coorTableRow-" + sharedObject}>
      <TableCell>
        <IconButton
          onClick={() => showDetailModalWithObject(coorByObject[sharedObject])}
        >
          <VisibilityIcon />
        </IconButton>
      </TableCell>
      <TableCell>
        {String(sharedObject).length > MAX_TABLE_TEXT_LENGTH
          ? String(sharedObject).slice(0, MAX_TABLE_TEXT_LENGTH) + "..."
          : String(sharedObject)}
      </TableCell>
      <TableCell>{coorByObject[sharedObject].length}</TableCell>
      <TableCell>{countUsersByObject(coorByObject[sharedObject])}</TableCell>
    </TableRow>
  ));
};

const generateCoorTable = (
  coorResult,
  keyword,
  setDetailContent,
  setOpenDetailModal,
) => {
  if (coorResult.length == 0) return <> </>;

  return (
    <TableContainer component={Paper}>
      <Table>
        {coorTableHeader(keyword)}
        {coorTableBody(coorResult, setDetailContent, setOpenDetailModal)}
      </Table>
    </TableContainer>
  );
};

const exportCoorResult = (coorResult) => {
  let res = {
    cosharingPairs: coorResult,
    cosharingByObject: getCosharersByObject(coorResult),
  };
  let dl = JSON.stringify(res);
  const blob = new Blob([dl], { type: "application/json;charset=utf-8;" });
  const a = document.createElement("a");
  const blobUrl = URL.createObjectURL(blob);
  a.href = blobUrl;
  a.download = `COOR_export.json`;
  a.click();
};

const coorExportButton = (keyword, coorResult) => {
  return (
    <>
      <Stack direction={"row"} spacing={1}>
        <Typography>{keyword("snaTools_coorExportDescription")}</Typography>
        {SNAButton(() => {
          exportCoorResult(coorResult);
        }, keyword("snaTools_coorExportButton"))}
      </Stack>
    </>
  );
};

export const generateCoorViz = (
  { keyword, setDetailContent, setOpenDetailModal, dataSources, selected },
  coorResult,
) => {
  if (coorResult.length == 0)
    return (
      <Typography> {keyword("snaTools_noCoorDetectedMessage")} </Typography>
    );

  let coorGraphData = generateCoorGraphData(coorResult, dataSources, selected);

  const coorNetworkGraph = generateCoorNetworkGraph(coorGraphData, {
    setDetailContent,
    setOpenDetailModal,
  });
  const coorTable = generateCoorTable(
    coorResult,
    keyword,
    setDetailContent,
    setOpenDetailModal,
  );
  return (
    <>
      <Box p={2} />
      {coorExportButton(keyword, coorResult)}
      <Box p={2} />
      {coorNetworkGraph}
      <Box p={2} />
      {coorTable}
    </>
  );
};
