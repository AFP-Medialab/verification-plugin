import React from "react";

import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import VisibilityIcon from "@mui/icons-material/Visibility";

import { getTextClusters } from "components/NavItems/tools/SNA/utils/accessSavedCollections";

const textClustersTableHeader = (keyword) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell>{keyword("snaTools_d3ltaTableClusterHeader")}</TableCell>
        <TableCell>{keyword("snaTools_d3ltaTableMetricsHeader")}</TableCell>
      </TableRow>
    </TableHead>
  );
};

const textClustersTableBody = (
  textClusterData,
  setDetailContent,
  setOpenDetailModal,
) => {
  return (
    <>
      {Object.keys(textClusterData)
        .sort((a, b) => {
          textClusterData[b].length - textClusterData[a].length;
        })
        .map((cluster) => (
          <TableRow key={"textClusterRow" + cluster}>
            <TableCell>
              <IconButton
                onClick={() => {
                  setDetailContent(textClusterData[cluster]);
                  setOpenDetailModal(true);
                }}
              >
                <VisibilityIcon />
              </IconButton>
            </TableCell>
            <TableCell>{"Cluster #" + cluster}</TableCell>
            <TableCell>{textClusterData[cluster].length}</TableCell>
          </TableRow>
        ))}
    </>
  );
};

export const textClustersTable = (
  { keyword, setDetailContent, setOpenDetailModal },
  textClusterData,
) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "600px",
        overflow: "auto",
      }}
    >
      <Table>
        {textClustersTableHeader(keyword)}
        {textClustersTableBody(
          textClusterData,
          setDetailContent,
          setOpenDetailModal,
        )}
      </Table>
    </TableContainer>
  );
};

export const generateTextClusterData = async (
  selectedContent,
  { authenticatedRequest },
) => {
  let entriesWithTextClusters = await getTextClusters(
    selectedContent,
    authenticatedRequest,
  );
  console.log(entriesWithTextClusters);
  let entriesWithTextClustersFiltered = entriesWithTextClusters.filter(
    (entry) => entry.cluster != "nan",
  );

  let entriesGroupedByCluster = Object.groupBy(
    entriesWithTextClustersFiltered,
    ({ cluster }) => cluster,
  );

  return entriesGroupedByCluster;
};
