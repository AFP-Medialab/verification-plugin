import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

import { detailsFormat } from "./DataUpload/DataUploadConstants";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  maxWidth: "95vw",
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const DetailModal = ({
  detailContent,
  detailSource,
  openDetailModal,
  setOpenDetailModal,
  detailSearchFilter,
  setDetailSearchFilter,
  keyword,
}) => {
  const handleClose = () => {
    setOpenDetailModal(false);
    setDetailSearchFilter("");
  };
  const format = detailsFormat[detailSource];
  const columns =
    detailContent && detailContent.length > 0
      ? Object.keys(detailContent[0]).map((x) => {
          let dateCheck = dayjs(detailContent[0][x]).isValid();
          if (dateCheck) {
            return {
              field: x,
              headerName: x,
              width: 190,
              sortComparator: (a, b) => dayjs(a).unix() - dayjs(b).unix(),
            };
          } else {
            let size = 90;
            // Test if current header is part of format columns and get size
            if (format && format.column) {
              const matchingColumn = format.column.find(
                (column) =>
                  column.headers &&
                  column.headers.includes(x.toLowerCase().replace(/\s/g, "")),
              );
              if (matchingColumn) {
                size = matchingColumn.size;
              }
            }
            return {
              field: x,
              headerName: x,
              width: size,
              renderCell: (params) => {
                const val = params.value;
                if (typeof val === "string" && val.startsWith("http")) {
                  return (
                    <Link
                      href={val}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {val}
                    </Link>
                  );
                }
                return val;
              },
            };
          }
        })
      : [];
  const rows =
    detailSearchFilter.length > 0
      ? detailContent.filter((x) =>
          Object.values(x).flat().toString().includes(detailSearchFilter),
        )
      : detailContent;

  const totalWidth = columns.reduce((sum, col) => sum + (col.width || 90), 0);

  return (
    <>
      <Modal open={openDetailModal} onClose={handleClose}>
        <Box sx={style}>
          <Stack direction="column" sx={{ flex: 1, minHeight: 0, gap: 2 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ flexShrink: 0 }}
            >
              <Typography sx={{ padding: 1 }}>
                {keyword("detailModal_search")}
              </Typography>
              <TextField
                id="detailModalSearchField"
                variant="outlined"
                sx={{ width: "400px" }}
                value={detailSearchFilter}
                onChange={(e) => setDetailSearchFilter(e.target.value)}
              />
            </Stack>
            <Box
              sx={{
                overflow: "auto",
                flex: 1,
                minHeight: 0,
                "&::-webkit-scrollbar": { width: "8px", height: "8px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.3)",
                  borderRadius: "4px",
                },
              }}
            >
              <DataGrid
                autoHeight
                disableColumnVirtualization
                rows={rows}
                columns={columns}
                getRowHeight={() => "auto"}
                sx={{
                  minWidth: `${totalWidth}px`,
                  "& .MuiDataGrid-virtualScroller": { overflowX: "hidden" },
                }}
              />
            </Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="flex-end"
              sx={{ flexShrink: 0 }}
            >
              <Button variant="outlined" onClick={handleClose}>
                {keyword("closeDetailModal_button_text")}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default DetailModal;
