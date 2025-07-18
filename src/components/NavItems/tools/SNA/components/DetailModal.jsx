import React from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

const style = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: 700,
  width: 1200,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const DetailModal = (props) => {
  let detailContent = props.detailContent;
  let openDetailModal = props.openDetailModal;
  let setOpenDetailModal = props.setOpenDetailModal;
  let searchFilter = props.detailSearchFilter;
  let setSearchFilter = props.setDetailSearchFilter;
  let keyword = props.keyword;

  const handleClose = () => {
    setOpenDetailModal(false);
    setSearchFilter("");
  };

  const columns =
    detailContent && detailContent.length > 0
      ? Object.keys(detailContent[0]).map((x) => {
          let dateCheck = dayjs(detailContent[0][x]).isValid();
          if (dateCheck) {
            return {
              field: x,
              headerName: x,
              width: 90,
              sortComparator: (a, b) => dayjs(a).unix() - dayjs(b).unix(),
            };
          }
          return {
            field: x,
            headerName: x,
            width: 90,
          };
        })
      : [];
  detailContent.forEach((x, idx) => (x.id = idx));
  const rows =
    searchFilter.length > 0
      ? detailContent.filter((x) =>
          Object.values(x).flat().toString().includes(searchFilter),
        )
      : detailContent;

  return (
    <>
      <Modal open={openDetailModal} onClose={handleClose}>
        <Box sx={style}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ padding: 1 }}>
              {" "}
              {keyword("detailModal_search")}
            </Typography>
            <TextField
              variant="outlined"
              sx={{ width: "400px" }}
              value={searchFilter}
              onChange={(e) => {
                let searchTerm = e.target.value;
                setSearchFilter(searchTerm);
              }}
            />
          </Stack>
          <Box p={2}></Box>
          <Box sx={{ height: 500 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              getRowHeight={() => "auto"}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DetailModal;
