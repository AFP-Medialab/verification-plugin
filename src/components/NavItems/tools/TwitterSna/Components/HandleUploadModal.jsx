import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const HandleUploadModal = ({
  showUploadModal,
  setShowUploadModal,
  setLoading,
  required_fields,
  required_fields_labels,
  uploadedData,
  processUploadedFile,
}) => {
  return (
    <Modal
      open={showUploadModal}
      onClose={() => {
        setShowUploadModal(false);
        setLoading(false);
      }}
    >
      <Box display="flex" flexDirection="column" gap={2} sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Set required fields for COOR Analysis
        </Typography>
        {Object.keys(required_fields).map((k) => (
          <FormControl key={k} fullWidth>
            <InputLabel>{k}</InputLabel>
            <Select
              onChange={(e) => {
                required_fields_labels.set(k, e.target.value);
              }}
            >
              {Object.keys(uploadedData[0]).map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
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
          onClick={processUploadedFile}
        >
          Upload
        </Button>
      </Box>
    </Modal>
  );
};

export default HandleUploadModal;
