import React, { useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
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
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import VisibilityIcon from "@mui/icons-material/Visibility";

import ErrorBoundaryFallback from "@Shared/ErrorBoundaryFallback/ErrorBoundaryFallback";

import { addingUrl, uploadToCollection } from "../utils/snaUtils";

const EmptyTablePlaceholder = ({ keyword }) => {
  return (
    <>
      {keyword && (
        <TableRow key="emptyRowPlaceholder">
          <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
            <Box sx={{ margin: 2 }}>
              <Typography>
                {keyword("collections_table_placeholder")}
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const CollectionTableHeader = ({
  selected,
  setSelected,
  dataSources: rows,
  keyword,
}) => {
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
            id="checkAll_CollectionTableCheckbox"
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

const CollectionActionsCell = ({
  row,
  dataSources,
  setSelected,
  selected,
  setDataSources,
  keyword,
}) => {
  const rowFileInputRef = useRef(null);

  const [dlAnchorEl, setDlAnchorEl] = useState(null);

  const rawUploadIconButton = (row) => {
    const handleRawFileChange = (event, rowID) => {
      let dataSource = dataSources.find((ds) => ds.id === rowID);
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
        console.error("Please upload a valid JSON file.");
        // TODO: Replace with snackbar notification in the future
      }
    };

    const handleRawUpload = async (parsed, rowName) => {
      try {
        await uploadToCollection(parsed, row.source, rowName.split("~")[0]);
      } catch (error) {
        console.error("Error uploading raw collection:", error);
      }
    };

    return (
      <Tooltip title={keyword("rawUploadIcon_hover_label")}>
        <IconButton
          onClick={() => {
            rowFileInputRef.current?.click();
          }}
          rowkey={row.id}
          id={"uploadButton" + row.id}
          sx={{ p: 1 }}
        >
          <UploadIcon />
          <input
            type="file"
            id={"rawUpload_" + row.id}
            ref={rowFileInputRef}
            onChange={(event) => handleRawFileChange(event, row.id)}
            style={{ display: "none" }}
          />
        </IconButton>
      </Tooltip>
    );
  };

  const downloadIconButton = (row, dataSources, dlAnchorEl, setDlAnchorEl) => {
    const open = Boolean(dlAnchorEl);

    const handleDownload = (event, row) => {
      setDlAnchorEl(event.currentTarget);
    };

    const downloadTweetCSV = () => {
      const selectedData = row;
      if (!selectedData) return;
      let headers = selectedData.headers.join(",");
      console.log(headers);
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
      a.href = URL.createObjectURL(blob);
      a.download = `${selectedData.name}_export.csv`;
      a.click();
      setDlAnchorEl(null);
    };

    const downloadTweetsJson = () => {
      const selectedData = row;
      if (!selectedData) return;
      let dl = JSON.stringify(selectedData.content);
      const blob = new Blob([dl], { type: "application/json;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${selectedData.name}_export.json`;
      a.click();
      setDlAnchorEl(null);
    };

    const downloadTweetsRaw = async () => {
      const selectedData = row;
      if (!selectedData) return;

      try {
        let content = await browser.runtime.sendMessage({
          prompt: "getRawCollection",
          platform: selectedData.source,
          collectionId: selectedData.name.split("~")[0],
        });

        let dl = JSON.stringify(content.data);
        const blob = new Blob([dl], {
          type: "application/json;charset=utf-8;",
        });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${selectedData.name}_export_raw.json`;
        a.click();
      } catch (error) {
        console.error("Error downloading raw collection:", error);
      }

      setDlAnchorEl(null);
    };

    return (
      <>
        <Tooltip
          key={"downloadIcon_hover_label_" + row.id}
          title={keyword("downloadIcon_hover_label")}
        >
          <IconButton
            onClick={(event) => {
              handleDownload(event, row);
            }}
            key={"downloadIconButton_hover_label_" + row.id}
            aria-label="download"
            id={"dl_button" + row.id}
            aria-controls={open ? "basic-menu" + row.id : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            rowkey={row.id}
            sx={{ p: 1 }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id={"basic-menu" + row.id}
          anchorEl={dlAnchorEl}
          open={open}
          onClose={() => {
            setDlAnchorEl(null);
          }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => downloadTweetCSV()}
            data-testid={`sna-download-csv-${row.id}`}
          >
            CSV
          </MenuItem>
          <MenuItem
            onClick={() => downloadTweetsJson()}
            data-testid={`sna-download-json-${row.id}`}
          >
            JSON
          </MenuItem>
          <MenuItem
            onClick={() => downloadTweetsRaw()}
            data-testid={`sna-download-raw-json-${row.id}`}
          >
            Raw JSON
          </MenuItem>
        </Menu>
      </>
    );
  };

  const deleteIconButton = (row, setSelected, selected, dataSources) => {
    const handleRemove = async (id) => {
      setSelected(selected.filter((item) => item !== id));
      let dataSource = dataSources.find((x) => x.id === id);
      let removeIndex = dataSources.indexOf(dataSource);
      if (removeIndex !== -1) {
        const newDataSources = dataSources.filter((_, i) => i !== removeIndex);
        setDataSources(newDataSources);
      }

      if (dataSource.source !== "fileUpload") {
        try {
          await browser.runtime.sendMessage({
            prompt: "deleteCollection",
            source: dataSource.source,
            collectionId: dataSource.name.split("~")[0],
          });
        } catch (error) {
          console.error("Error deleting collection:", error);
        }
      }
    };

    return (
      <Tooltip title={keyword("deletedIcon_hover_label")}>
        <IconButton
          onClick={async () => await handleRemove(row.id)}
          aria-label="delete"
          color="error"
          sx={{ p: 1 }}
          data-testid={`sna-delete-button-${row.id}`}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <TableCell>
      <Stack
        direction="row"
        spacing={2}
        justifyContent={"flex-end"}
        sx={{ px: 0 }}
      >
        {rawUploadIconButton(row)}
        {downloadIconButton(row, dataSources, dlAnchorEl, setDlAnchorEl)}
        {deleteIconButton(
          row,
          setSelected,
          selected,
          dataSources,
          setDataSources,
        )}
      </Stack>
    </TableCell>
  );
};

const CollectionsTableRow = ({ row, rowProps, actionsProps, keyword }) => {
  const {
    selected,
    setSelected,
    setDetailContent,
    setDetailSource,
    setOpenDetailModal,
  } = rowProps;
  const {
    fileInputRef,
    dataSources,
    setSelected: setSelectedActions,
    selected: selectedActions,
    setDataSources,
    keyword: keywordActions,
  } = actionsProps;

  const handleSelectRow = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected;

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
      data-testid={`sna-collection-row-${row.name}`}
    >
      <TableCell>
        <IconButton
          onClick={() => {
            setDetailContent(row.content);
            setDetailSource(row.source);
            setOpenDetailModal(true);
          }}
          sx={{ p: 1 }}
          data-testid={`sna-visibility-button-${row.id}`}
        >
          <VisibilityIcon />
        </IconButton>
      </TableCell>
      <TableCell padding="checkbox">
        <Checkbox
          key={row.id + "_collectionTableCheckbox"}
          checked={selected.indexOf(row.id) !== -1}
          onChange={() => handleSelectRow(row.id)}
          data-testid={`sna-collection-checkbox-${row.id}`}
        />
      </TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>
        {row.metrics ? (
          row.metrics.map((metric) => (
            <Typography
              variant="body2"
              component="p"
              key={"collectionstable-" + row.name + " " + metric.label}
            >
              {keyword(metric.label) +
                ": " +
                Intl.NumberFormat().format(metric.value)}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" component="p">
            {keyword("collection_nbOfPosts") + ": " + row.content.length}
          </Typography>
        )}
      </TableCell>
      <CollectionActionsCell
        row={row}
        fileInputRef={fileInputRef}
        dataSources={dataSources}
        setSelected={setSelectedActions}
        selected={selectedActions}
        setDataSources={setDataSources}
        keyword={keywordActions}
      />
    </TableRow>
  );
};

const CollectionsTableBody = ({
  dataSources,
  rowProps,
  actionsProps,
  keyword,
}) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <TableBody>
        {dataSources?.length > 0 ? (
          dataSources.map((row) => {
            // we create a new object based on row, because row is freezed, and add to it a video url column
            const enrichedRow = addingUrl(row);
            return (
              <CollectionsTableRow
                key={"row_" + row.id}
                row={enrichedRow}
                rowProps={rowProps}
                actionsProps={actionsProps}
                keyword={keyword}
              />
            );
          })
        ) : (
          <EmptyTablePlaceholder keyword={keyword} />
        )}
      </TableBody>
    </ErrorBoundary>
  );
};

const CollectionsTable = ({
  keyword,
  selected,
  setSelected,
  setDetailContent,
  setDetailSource,
  setOpenDetailModal,
  fileInputRef,
  dataSources,
  dlAnchorEl,
  setDlAnchorEl,
  setDataSources,
}) => {
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
    setDetailSource,
    setOpenDetailModal,
  };

  let collectionActionsCellProps = {
    fileInputRef,
    dataSources,
    setSelected,
    selected,
    setDataSources,
    keyword,
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "600px",
        overflow: "auto",
      }}
    >
      <Table>
        <CollectionTableHeader {...collectionTableHeaderProps} />
        <CollectionsTableBody
          dataSources={dataSources}
          rowProps={collectionRowProps}
          actionsProps={collectionActionsCellProps}
          keyword={keyword}
        />
      </Table>
    </TableContainer>
  );
};

// Custom comparison function for React.memo
// Only re-render if actual data content changes, not just reference
const arePropsEqual = (prevProps, nextProps) => {
  // IMPORTANT: Check selection state FIRST before checking dataSources
  // Otherwise checkboxes won't update when selection changes
  if (
    prevProps.selected.length !== nextProps.selected.length ||
    !prevProps.selected.every((id) => nextProps.selected.includes(id)) ||
    !nextProps.selected.every((id) => prevProps.selected.includes(id))
  ) {
    return false; // Selection changed, need to re-render
  }

  // Quick reference check for dataSources
  if (prevProps.dataSources === nextProps.dataSources) return true;

  // Check if dataSources content actually changed
  if (prevProps.dataSources.length !== nextProps.dataSources.length) {
    return false;
  }

  // Deep comparison of collection content lengths (lightweight proxy for content change)
  const prevHash = prevProps.dataSources
    .map((ds) => `${ds.id}:${ds.length}`)
    .join("|");
  const nextHash = nextProps.dataSources
    .map((ds) => `${ds.id}:${ds.length}`)
    .join("|");

  // If hash is the same, props are equal (no re-render needed)
  return prevHash === nextHash;
};

export default React.memo(CollectionsTable, arePropsEqual);
