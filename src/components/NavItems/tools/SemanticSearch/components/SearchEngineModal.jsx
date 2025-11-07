import React, { useState } from "react";

import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Close } from "@mui/icons-material";

const SEARCH_ENGINE_MODAL_STYLE = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "400px",
  width: "50vw",
  backgroundColor: "background.paper",
  outline: "unset",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  maxHeight: "60vh",
  overflow: "auto",
};

/**
 * Modal component that displays information about different search engine modes
 */
const SearchEngineModal = ({ searchEngineModes, keyword }) => {
  const [openSearchEngineModal, setOpenSearchEngineModal] = useState(false);

  const handleOpenSearchEngineModal = () => {
    setOpenSearchEngineModal(true);
  };

  const handleCloseSearchEngineModal = () => setOpenSearchEngineModal(false);

  return (
    <>
      <Link onClick={handleOpenSearchEngineModal} sx={{ cursor: "pointer" }}>
        {keyword("semantic_search_search_engine_tip_link_placeholder")}
      </Link>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openSearchEngineModal}
        onClose={handleCloseSearchEngineModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openSearchEngineModal}>
          <Box sx={SEARCH_ENGINE_MODAL_STYLE}>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                id="transition-modal-title"
                variant="subtitle2"
                sx={{
                  color: "var(--mui-palette-primary-main)",
                  fontSize: "24px",
                }}
              >
                {keyword("semantic_search_search_engine_tip_title")}
              </Typography>
              <IconButton
                variant="outlined"
                aria-label="close popup"
                onClick={handleCloseSearchEngineModal}
                sx={{ p: 1 }}
              >
                <Close />
              </IconButton>
            </Stack>
            <Stack
              id="transition-modal-description"
              direction="column"
              spacing={2}
              sx={{
                mt: 2,
              }}
            >
              {searchEngineModes.map((searchEngine, index) => {
                return (
                  <Stack direction="column" key={index}>
                    <Typography variant="subtitle1">
                      {searchEngine.name}
                    </Typography>
                    <Alert severity="info" icon={false}>
                      {searchEngine.description}
                    </Alert>
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default SearchEngineModal;
