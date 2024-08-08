import React, { useState } from "react";
import {
  Backdrop,
  Box,
  Fade,
  IconButton,
  Link,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { Close, Square } from "@mui/icons-material";

/**
 *
 * @param keyword The translation i18n function
 * @param keywordsArr {Array<string>} The translation keywordsArr for each range of the scale
 * @param keywordLink {string} The translation string for the link that opens the modal
 * @param keywordModalTitle {string} The translation string for the modal title
 * @param colors {Array<string>} Array with hexadecimal colors used in the scale
 * @returns {Element}
 * @constructor
 */
const GaugeChartModalExplanation = ({
  keyword,
  keywordsArr,
  keywordLink,
  keywordModalTitle,
  colors,
}) => {
  const gaugeColorsModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: "400px",
    width: "30vw",
    backgroundColor: "background.paper",
    outline: "unset",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    maxHeight: "60vh",
    overflow: "auto",
  };

  if (keywordsArr.length !== colors.length) {
    throw new Error(
      `[GaugeChartModalExplanation][Error] The keywords array and the colors array do not have the same length`,
    );
  }

  if (keywordsArr.length === 0 || colors.length === 0) {
    throw new Error(
      `[GaugeChartModalExplanation][Error] The keywords array and the colors array should not be empty`,
    );
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <>
      <Link onClick={toggleModal} sx={{ cursor: "pointer" }} variant={"body1"}>
        {keyword(keywordLink)}
      </Link>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isModalOpen}
        onClose={toggleModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isModalOpen}>
          <Box sx={gaugeColorsModalStyle}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Typography
                id="transition-modal-title"
                variant="subtitle2"
                style={{
                  color: "#00926c",
                  fontSize: "24px",
                }}
              >
                {keyword(keywordModalTitle)}
              </Typography>
              <IconButton
                variant="outlined"
                aria-label="close popup"
                onClick={toggleModal}
              >
                <Close />
              </IconButton>
            </Stack>
            <Stack
              id="transition-modal-description"
              direction="column"
              spacing={2}
              mt={2}
            >
              {keywordsArr.map((translation, index) => {
                return (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                  >
                    <Square fontSize="large" sx={{ color: colors[index] }} />
                    <Typography>{keyword(translation)}</Typography>
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

export default GaugeChartModalExplanation;
