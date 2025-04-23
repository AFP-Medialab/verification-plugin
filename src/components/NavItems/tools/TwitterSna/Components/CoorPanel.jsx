import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { GridExpandMoreIcon } from "@mui/x-data-grid";

const CoorPanel = ({
  selected,
  timeWindow,
  setGraph,
  setTimeWindow,
  edgeWeight,
  setEdgeWeight,
  minParticipation,
  setMinParticipation,
  uploadedData,
  setShowUploadModal,
  runCoorAnalysis,
  graphSet,
  showGraph,
  objectChoice,
  setObjectChoice,
}) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<GridExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography component="span"> COOR Analysis </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Box p={2}></Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography pl={2}> Time window:</Typography>
            <TextField
              variant="outlined"
              sx={{ width: "100px" }}
              value={timeWindow}
              onChange={(e) => {
                setGraph(false);
                setTimeWindow(e.target.value);
              }}
            />
            <Typography pl={2}> Edge weight:</Typography>
            <TextField
              variant="outlined"
              sx={{ width: "100px" }}
              value={edgeWeight}
              onChange={(e) => {
                setGraph(false);
                setEdgeWeight(e.target.value);
              }}
            />
            <Typography pl={2}> Minimum participation:</Typography>
            <TextField
              variant="outlined"
              sx={{ width: "100px" }}
              value={minParticipation}
              onChange={(e) => {
                setGraph(false);
                setMinParticipation(e.target.value);
              }}
            />
            {selected.length > 0 &&
            selected.every((x) => x.includes("tweets~")) ? (
              <>
                <Typography pl={2}> Object:</Typography>
                <FormControl>
                  <InputLabel id="object-select-label">Object</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={objectChoice}
                    label="Age"
                    onChange={(e) => setObjectChoice(e.target.value)}
                  >
                    <MenuItem value={"links"}>Link</MenuItem>
                    <MenuItem value={"hashtags"}>Hashtags</MenuItem>
                    <MenuItem value={"mentions"}>Mentions</MenuItem>
                    <MenuItem value={"tweet_text"}>Text</MenuItem>
                  </Select>
                </FormControl>
              </>
            ) : (
              <></>
            )}
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
              onClick={runCoorAnalysis}
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
