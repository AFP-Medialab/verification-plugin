import React from "react";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import VisibilityIcon from "@mui/icons-material/Visibility";

const EmptyTablePlaceholder = (keyword) => {
  return (
    <TableRow key="emptyRowPlaceholder">
      <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
        <Box sx={{ margin: 2 }}>
          <Typography>{keyword("collections_table_placeholder")}</Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

const CollectionTableHeader = (collectionTableHeaderProps) => {
  let selected = collectionTableHeaderProps.selected;
  let setSelected = collectionTableHeaderProps.setSelected;
  let rows = collectionTableHeaderProps.dataSources;
  let keyword = collectionTableHeaderProps.keyword;

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={selected.length > 0 && selected.length < rows.length}
            checked={rows.length > 0 && selected.length === rows.length}
            onChange={handleSelectAllClick}
          />
        </TableCell>
        <TableCell>{keyword("collections_table_data_source")}</TableCell>
        <TableCell>{keyword("collections_table_metrics")}</TableCell>
        <TableCell align="right">
          {keyword("collections_table_actions")}
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

const CollectionActionsCell = (row, collectionActionsCellProps) => {
  let fileInputRef = collectionActionsCellProps.fileInputRef;
  let dataSources = collectionActionsCellProps.dataSources;
  let dlAnchorEl = collectionActionsCellProps.dlAnchorEl;
  let setDlAnchorEl = collectionActionsCellProps.setDlAnchorEl;
  let setSelected = collectionActionsCellProps.setSelected;
  let selected = collectionActionsCellProps.selected;
  let setDataSources = collectionActionsCellProps.setDataSources;

  const rawUploadIconButton = (row, fileInputRef) => {
    const handleRawFileChange = (event, rowID) => {
      let dataSource = dataSources.filter((ds) => ds.id === rowID)[0];
      let rowName = dataSource.name;
      const file = event.target.files[0];
      if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const parsed = JSON.parse(e.target.result);
            await handleRawUpload(parsed, rowName);
          } catch (error) {
            console.error("Invalid JSON file:", error);
          }
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a valid JSON file.");
      }
    };

    const handleRawUpload = async (parsed, rowName) => {
      await chrome.runtime.sendMessage({
        prompt: "addToCollection",
        data: parsed,
        platform: row.source,
        collectionId: rowName.split("~")[0],
      });
    };

    return (
      <IconButton
        onClick={() => {
          document.getElementById("rawUpload_" + row.id).click();
        }}
        rowkey={row.id}
        id={"uploadButton" + row.id}
      >
        <UploadIcon />
        <input
          type="file"
          id={"rawUpload_" + row.id}
          ref={fileInputRef}
          onChange={(event) => handleRawFileChange(event, row.id)}
          style={{ display: "none" }}
        />
      </IconButton>
    );
  };

  const downloadIconButton = (row, dataSources, dlAnchorEl, setDlAnchorEl) => {
    const open = Boolean(dlAnchorEl);

    const handleDownload = (rowId) => {
      setDlAnchorEl(document.getElementById("dl_button" + rowId));
    };

    const downloadTweetCSV = () => {
      let id = dlAnchorEl.getAttribute("rowkey");
      let selectedData = dataSources.filter((source) => source.id === id)[0];
      let headers = selectedData.headers.join(",");
      let csvData = selectedData.content
        .map((obj) =>
          selectedData.headers.map((k) =>
            obj[k]
              ? `"${obj[k].toString().replaceAll('"', '""').replaceAll("\n", " ")}"`
              : "missing",
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

    const donwloadTweetsRaw = async () => {
      let id = dlAnchorEl.getAttribute("rowkey");

      let selectedData = dataSources.filter((source) => source.id === id)[0];

      let content = await chrome.runtime.sendMessage({
        prompt: "getRawCollection",
        platform: selectedData.source,
        collectionId: selectedData.name.split("~")[0],
      });

      let dl = JSON.stringify(content.data);
      const blob = new Blob([dl], { type: "application/json;charset=utf-8;" });
      const a = document.createElement("a");
      const blobUrl = URL.createObjectURL(blob);
      a.href = blobUrl;
      a.download = `${selectedData.name}_export_raw.json`;
      a.click();
      setDlAnchorEl(null);
    };

    return (
      <>
        <IconButton
          onClick={() => {
            handleDownload(row.id);
          }}
          aria-label="download"
          id={"dl_button" + row.id}
          aria-controls={open ? "basic-menu" + row.id : undefined}
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
          <MenuItem onClick={() => downloadTweetCSV()}>CSV</MenuItem>
          <MenuItem onClick={() => downloadTweetsJson()}>JSON</MenuItem>
          <MenuItem onClick={() => donwloadTweetsRaw()}>Raw JSON</MenuItem>
        </Menu>
      </>
    );
  };

  const deleteIconButton = (row, setSelected, selected, dataSources) => {
    const handleRemove = async (id) => {
      setSelected(selected.filter((item) => item !== id));
      let dataSource = dataSources.filter((x) => x.id == id)[0];
      let removeIndex = dataSources.indexOf(dataSource);
      dataSources.splice(removeIndex, 1);

      if (dataSource.source != "fileUpload") {
        await chrome.runtime.sendMessage({
          prompt: "deleteCollection",
          source: dataSource.source,
          collectionId: dataSource.name.split("~")[0],
        });
      }
    };

    return (
      <IconButton
        onClick={async () => await handleRemove(row.id)}
        aria-label="delete"
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    );
  };

  return (
    <TableCell align="right">
      {rawUploadIconButton(row, fileInputRef)}
      {downloadIconButton(row, dataSources, dlAnchorEl, setDlAnchorEl)}
      {deleteIconButton(
        row,
        setSelected,
        selected,
        dataSources,
        setDataSources,
      )}
    </TableCell>
  );
};

const CollectionsTableRow = (
  row,
  collectionRowProps,
  collectionActionsCellProps,
  keyword,
) => {
  let selected = collectionRowProps.selected;
  let setSelected = collectionRowProps.setSelected;
  let setDetailContent = collectionRowProps.setDetailContent;
  let setOpenDetailModal = collectionRowProps.setOpenDetailModal;

  const handleSelectRow = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    setSelected(newSelected);
  };

  return (
    <TableRow
      key={"row_" + row.id}
      hover
      role="checkbox"
      selected={selected.indexOf(row.id) !== -1}
    >
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
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected.indexOf(row.id) !== -1}
          onChange={() => handleSelectRow(row.id)}
        />
      </TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>
        {row.metrics
          ? row.metrics.map((metric) => (
              <p key={"collectionstable-" + row.name + " " + metric.label}>
                {keyword(metric.label) +
                  ": " +
                  Intl.NumberFormat().format(metric.value)}
              </p>
            ))
          : keyword("collection_nbOfPosts") + ": " + row.content.length}
      </TableCell>
      {CollectionActionsCell(row, collectionActionsCellProps)}
    </TableRow>
  );
};

const CollectionsTableBody = (
  dataSources,
  collectionRowProps,
  collectionActionsCellProps,
  keyword,
) => {
  return (
    <TableBody>
      {dataSources?.length > 0
        ? dataSources.map((row) => {
            return (
              <>
                {CollectionsTableRow(
                  row,
                  collectionRowProps,
                  collectionActionsCellProps,
                  keyword,
                )}
              </>
            );
          })
        : EmptyTablePlaceholder(keyword)}
    </TableBody>
  );
};

const CollectionsTable = (collectionsTableProps) => {
  let keyword = collectionsTableProps.keyword;

  let selected = collectionsTableProps.selected;
  let setSelected = collectionsTableProps.setSelected;
  let setDetailContent = collectionsTableProps.setDetailContent;
  let setOpenDetailModal = collectionsTableProps.setOpenDetailModal;
  let fileInputRef = collectionsTableProps.fileInputRef;
  let dataSources = collectionsTableProps.dataSources;
  let dlAnchorEl = collectionsTableProps.dlAnchorEl;
  let setDlAnchorEl = collectionsTableProps.setDlAnchorEl;
  let setDataSources = collectionsTableProps.setDataSources;

  let collectionTableHeaderProps = {
    selected,
    setSelected,
    dataSources,
    keyword,
  };

  let collectionRowProps = {
    selected,
    setSelected,
    setDetailContent,
    setOpenDetailModal,
  };

  let collectionActionsCellProps = {
    fileInputRef,
    dataSources,
    dlAnchorEl,
    setDlAnchorEl,
    setSelected,
    selected,
    setDataSources,
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        {CollectionTableHeader(collectionTableHeaderProps)}
        {CollectionsTableBody(
          dataSources,
          collectionRowProps,
          collectionActionsCellProps,
          keyword,
        )}
      </Table>
    </TableContainer>
  );
};

export default CollectionsTable;
