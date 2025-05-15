import React, { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import SNAIcon from "../../../../NavBar/images/SVG/DataAnalysis/Twitter_sna.svg";

// Replace this with the actual path to your Meta logo image
const metaLogoUrl =
  "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png";

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
  addUploadToDataSources,
  customExpanded,
  setCustomExpanded,
  metaSelected,
  setMetaSelected,
  snaSelected,
  setSnaSelected,
}) => {
  const handleMetaClick = () => {
    setMetaSelected((prev) => !prev);
    setSnaSelected(false);
    setCustomExpanded(false);
  };

  const handleSnaClick = () => {
    setSnaSelected((prev) => !prev);
    setMetaSelected(false);
    setCustomExpanded(false);
  };

  const handleCustomToggle = () => {
    setCustomExpanded((prev) => !prev);
  };

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

        <Stack direction={"row"} spacing={2} alignItems="center">
          {/* Meta Logo Box */}
          <Box
            onClick={handleMetaClick}
            sx={{
              width: 50,
              height: 50,
              borderRadius: 2,
              border: metaSelected ? "2px solid blue" : "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <img
              src={metaLogoUrl}
              alt="Meta"
              style={{ width: 38, height: 21 }}
            />
          </Box>

          <Box
            onClick={handleSnaClick}
            sx={{
              width: 50,
              height: 50,
              borderRadius: 2,
              border: snaSelected ? "2px solid blue" : "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <SvgIcon
              component={SNAIcon}
              inheritViewBox
              style={{ width: 38, height: 21 }}
            />
            {/* <img src={snaIconUrl} alt="Sna" style={{ width: 38, height: 21 }} /> */}
          </Box>
        </Stack>

        {/* Expandable Custom Section */}
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle1">Custom</Typography>
            <IconButton onClick={handleCustomToggle} size="small">
              {customExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Collapse in={customExpanded}>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
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
            </Box>
          </Collapse>
        </Box>
        <Button
          variant="outlined"
          sx={{
            color: "green",
            borderColor: "green",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "rgba(0, 128, 0, 0.1)",
              borderColor: "darkgreen",
            },
          }}
          onClick={addUploadToDataSources}
        >
          Upload
        </Button>
      </Box>
    </Modal>
  );
};

export default HandleUploadModal;
