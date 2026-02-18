import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

import { detailsFormat } from "./DataUpload/DataUploadConstants";

const style = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
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

  return (
    <>
      <Modal open={openDetailModal} onClose={handleClose}>
        <Box sx={style}>
          <Stack direction="column">
            <Stack direction="column" spacing={2} sx={{ overflow: "auto" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ padding: 1 }}>
                  {" "}
                  {keyword("detailModal_search")}
                </Typography>
                <TextField
                  id="detailModalSearchField"
                  variant="outlined"
                  sx={{ width: "400px" }}
                  value={detailSearchFilter}
                  onChange={(e) => {
                    let searchTerm = e.target.value;
                    setDetailSearchFilter(searchTerm);
                  }}
                />
              </Stack>
              <Box sx={{ overflow: "auto", maxHeight: 500 }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  getRowHeight={() => "auto"}
                  sx={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent={"flex-end"}
            >
              <Button variant={"outlined"} onClick={handleClose}>
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
