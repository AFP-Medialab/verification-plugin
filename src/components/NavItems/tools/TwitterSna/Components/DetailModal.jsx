import React from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { DataGrid } from "@mui/x-data-grid";

const style = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: 700,
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const DetailModal = (props) => {
  let detailContent = props.detailContent;
  let openDetailModal = props.openDetailModal;
  let setOpenDetailModal = props.setOpenDetailModal;
  let searchFilter = props.detailSearchFilter;
  let setSearchFilter = props.detailSetSearchFilter;
  let setDetailContent = props.setDetailContent;
  const handleClose = () => {
    setOpenDetailModal(false);
    setSearchFilter("");
  };

  const columns =
    detailContent && detailContent.length > 0
      ? Object.keys(detailContent[0]).map((x) => ({
          field: x,
          headerName: x,
          width: 90,
        }))
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
            <Typography pl={1}> Search:</Typography>
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
              getRowHeight={(params) => "auto"}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DetailModal;
