import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SettingsIcon from "@mui/icons-material/Settings";

import EntryDetailTable from "./EntryDetailTable";

// adjust import path as needed

const CheckboxTable = ({
  inputRef,
  handleFileChange,
  handleUploadClick,
  uploadedFile,
  openRowIds,
  setOpenRowIds,
  rows,
  setRows,
  selected,
  setSelected,
  dataProps,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  searchFilter,
  setSearchFilter,
  expanded,
  setExpanded,
  dlAnchorEl,
  setDlAnchorEl,
  dataSources,
  setDataSources,
}) => {
  const toggleCollapse = (id) => {
    setOpenRowIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const open = Boolean(dlAnchorEl);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    console.log(selected);
    console.log(newSelected);

    setSelected(newSelected);
  };

  const handleRemove = (id) => {
    setRows(rows.filter((row) => row.id !== id));
    setSelected(selected.filter((item) => item !== id));
    if (id.includes("tweets~")) {
      console.log(id);
      let colID = dataSources.filter((x) => x.id === id)[0].name;
      chrome.runtime.sendMessage({ prompt: "deleteTweets", collection: colID });
    }
    setDataSources(dataSources.filter((x) => x.id != id));
  };

  const handleSettings = (id) => {
    // Placeholder
  };

  const downloadTweetCSV = () => {
    let id = dlAnchorEl.getAttribute("rowkey");
    let selectedData = dataSources.filter((source) => source.id === id)[0];
    let headers = selectedData.headers.join(",");
    let csvData = selectedData.content
      .map((obj) =>
        Object.values(obj).map(
          (y) =>
            `"${y.toString().replaceAll('"', '""').replaceAll("\n", " ")}"`,
        ),
      )
      .join("\n");

    let csvFile = headers + `\n` + csvData;

    const blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    const blobUrl = URL.createObjectURL(blob);
    a.href = blobUrl;
    a.download = `${selectedData.name}_export.csv`;
    a.click();
    setDlAnchorEl(null);
  };

  const downloadTweetsJson = () => {
    let id = dlAnchorEl.getAttribute("rowkey");
    let selectedData = dataSources.filter((source) => source.id === id)[0];
    let dl = JSON.stringify(selectedData.content);
    const blob = new Blob([dl], { type: "application/json;charset=utf-8;" });
    const a = document.createElement("a");
    const blobUrl = URL.createObjectURL(blob);
    a.href = blobUrl;
    a.download = `${selectedData.name}_export.json`;
    a.click();
    setDlAnchorEl(null);
  };

  const handleDownload = (id) => {
    console.log(id);
    setDlAnchorEl(document.getElementById("dl_button" + id));
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < rows.length
                  }
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Data source</TableCell>
              <TableCell>Number of rows</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.length > 0 ? (
              rows.map((row) => {
                const isItemSelected = isSelected(row.id);
                const isOpen = openRowIds.includes(row.id);
                const allTweets = row.content;
                const headers = row.headers;

                return (
                  <React.Fragment key={row.id}>
                    <TableRow hover role="checkbox" selected={isItemSelected}>
                      <TableCell>
                        <IconButton onClick={() => toggleCollapse(row.id)}>
                          {isOpen ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() => handleClick(row.id)}
                        />
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleSettings(row.id)}
                          aria-label="settings"
                        >
                          <SettingsIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            handleDownload(row.id);
                          }}
                          aria-label="download"
                          id={"dl_button" + row.id}
                          aria-controls={
                            open ? "basic-menu" + row.id : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          rowkey={row.id}
                        >
                          <DownloadIcon />
                        </IconButton>
                        <Menu
                          id={"basic-menu" + row.id}
                          anchorEl={dlAnchorEl}
                          open={open}
                          onClose={() => setDlAnchorEl(null)}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          <MenuItem onClick={() => downloadTweetCSV()}>
                            CSV
                          </MenuItem>
                          <MenuItem onClick={() => downloadTweetsJson()}>
                            JSON
                          </MenuItem>
                        </Menu>
                        <IconButton
                          onClick={() => handleRemove(row.id)}
                          aria-label="delete"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            {EntryDetailTable({
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
                            })}
                          </Box>
                        </Collapse>
                      </TableCell>
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
      <Box p={2}></Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h6" align="left">
          Upload CrowdTangle CSV:
        </Typography>
        <input type="file" hidden ref={inputRef} onChange={handleFileChange} />
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
          onClick={() => inputRef.current.click()}
        >
          {uploadedFile ? uploadedFile.name : "Upload file"}
        </Button>
        <Box p={2}></Box>
      </Stack>
    </>
  );
};

export default CheckboxTable;
