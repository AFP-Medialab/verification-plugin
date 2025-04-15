import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
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

const EntryDetailTable = ({
  allTweets,
  headers,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  searchFilter,
  setSearchFilter,
  expanded,
  setExpanded,
}) => {
  const ExpandableTableCell = ({ text, maxChars = 100 }) => {
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper elevation={1} sx={{ width: "100%" }}>
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
              {headers ? (
                headers.map((k) => (
                  <TableCell key={k} align="center" style={{ minWidth: 200 }}>
                    {k}
                  </TableCell>
                ))
              ) : (
                <></>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {searchFilter.length > 0
              ? allTweets
                  .filter((x) =>
                    Object.entries(x)
                      .flat(2)
                      .some((k) => k.toString().includes(searchFilter)),
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((x) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={x.id + "#"}
                      >
                        {headers.map((k) => (
                          <ExpandableTableCell
                            text={x[k] ? x[k] : "Missing"}
                            key={k}
                            align="left"
                          ></ExpandableTableCell>
                        ))}
                      </TableRow>
                    );
                  })
              : allTweets
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((x) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={x.id + "#"}
                      >
                        {headers.map((k) => (
                          <ExpandableTableCell
                            text={x[k] ? x[k] : "Missing"}
                            key={k}
                            align="left"
                          ></ExpandableTableCell>
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
                    .some((k) => k.toString().includes(searchFilter)),
                ).length
              : allTweets.length
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Paper>
  );
};

export default EntryDetailTable;
