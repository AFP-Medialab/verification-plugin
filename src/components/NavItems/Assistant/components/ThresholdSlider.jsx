import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Slider from "@mui/material/Slider";

/** Scales slider value from 0–99 range to 0–1 */
const scaleValue = (value) => value / 100;

/**
 * Slider component utilised by news framing, news genre, persuasion techniques and subjectivity
 * @param { importantSentenceThreshold, handleSliderChange, keyword }
 * @returns slider component
 */
export function ThresholdSlider({
  importantSentenceThreshold,
  handleSliderChange,
  keyword,
}) {
  const marks = [
    {
      value: 0,
      label: keyword("threshold_slider_low"),
    },
    {
      value: 99,
      label: keyword("threshold_slider_high"),
    },
  ];

  return (
    <List>
      <ListItem>
        <Slider
          aria-label="important sentence threshold slider"
          marks={marks}
          step={1}
          min={0}
          max={99}
          scale={scaleValue}
          value={importantSentenceThreshold}
          onChange={handleSliderChange}
          sx={{
            "& .MuiSlider-markLabel": {
              fontSize: "small",
            },
          }}
        />
      </ListItem>
    </List>
  );
}
