import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import Grid2 from "@mui/material/Grid2";
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

import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SettingsIcon from "@mui/icons-material/Settings";

import EntryDetailTable from "./EntryDetailTable";

// adjust import path as needed

const CheckboxTable = ({
  openRowIds,
  setOpenRowIds,
  rows,
  setRows,
  selected,
  setSelected,
  dataProps,
}) => {
  const toggleCollapse = (id) => {
    setOpenRowIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

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

    setSelected(newSelected);
  };

  const handleRemove = (id) => {
    setRows(rows.filter((row) => row.id !== id));
    setSelected(selected.filter((item) => item !== id));
  };

  const handleSettings = (id) => {
    // Placeholder
  };

  const handleDownload = (id) => {
    // Placeholder
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
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
          {rows.map((row) => {
            const isItemSelected = isSelected(row.id);
            const isOpen = openRowIds.includes(row.id);

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
                      onClick={() => handleDownload(row.id)}
                      aria-label="download"
                    >
                      <DownloadIcon />
                    </IconButton>
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
                        <EntryDetailTable
                          dataProps // adjust headers as needed
                        />
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CheckboxTable;
