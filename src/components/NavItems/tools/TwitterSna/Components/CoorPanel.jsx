import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { GridExpandMoreIcon } from "@mui/x-data-grid";

const CoorPanel = ({
  timeWindow,
  setGraph,
  setTimeWindow,
  edgeWeight,
  setEdgeWeight,
  uploadedData,
  setShowUploadModal,
  runTweetCoor,
  graphSet,
  showGraph,
}) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<GridExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography component="span"> COOR Graph </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Box p={2}></Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography pl={2}> Time window:</Typography>
            <TextField
              variant="outlined"
              sx={{ width: "200px" }}
              value={timeWindow}
              onChange={(e) => {
                setGraph(false);
                setTimeWindow(e.target.value);
              }}
            />
            <Typography pl={2}> Edge weight:</Typography>
            <TextField
              variant="outlined"
              sx={{ width: "200px" }}
              value={edgeWeight}
              onChange={(e) => {
                setGraph(false);
                setEdgeWeight(e.target.value);
              }}
            />
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
              onClick={uploadedData ? setShowUploadModal : runTweetCoor}
            >
              Run COOR Detection
            </Button>
          </Stack>
        </Box>
        <Box p={2}></Box>
        {graphSet ? showGraph() : <></>}
      </AccordionDetails>
    </Accordion>
  );
};

export default CoorPanel;
