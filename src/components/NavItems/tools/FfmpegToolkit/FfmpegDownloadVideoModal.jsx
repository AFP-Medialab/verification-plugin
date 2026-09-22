import React, { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

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

const DownloadVideoModal = ({ showModal, setShowModal, onConfirm }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/FfmpegToolkit");

  const [compress, setCompress] = useState(false);
  const [scaleDown, setScaleDown] = useState(false);

  const handleClose = () => {
    setCompress(false);
    setScaleDown(false);
    setShowModal(false);
  };

  const handleConfirm = () => {
    onConfirm?.({ compress, scaleDown });
    handleClose();
  };

  return (
    <Modal open={showModal} onClose={handleClose}>
      <Box sx={modalStyle} data-testid="ffmpegtoolkit-download-modal">
        <Stack direction="column" spacing={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" component="h2">
              {keyword("ffmpeg_toolkit_download_options_title")}
            </Typography>
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{ padding: 1.5 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControlLabel
            data-testid="ffmpegtoolkit-compress-checkbox"
            control={
              <Checkbox
                checked={compress}
                onChange={(e) => setCompress(e.target.checked)}
              />
            }
            label={keyword("ffmpeg_toolkit_download_options_compress")}
          />

          <FormControlLabel
            data-testid="ffmpegtoolkit-scale-checkbox"
            control={
              <Checkbox
                checked={scaleDown}
                onChange={(e) => setScaleDown(e.target.checked)}
              />
            }
            label={keyword("ffmpeg_toolkit_download_options_scale")}
          />

          <Button
            variant="outlined"
            color="primary"
            onClick={handleConfirm}
            data-testid="ffmpegtoolkit-download-modal-confirm"
          >
            {keyword("ffmpeg_toolkit_download_options_confirm")}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default DownloadVideoModal;
