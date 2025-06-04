import React from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { rgbListToGradient } from "./assistantUtils";

export function ColourGradientScale({
  colourScaleText,
  textLow,
  textHigh,
  rgbList,
}) {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <div style={{ textAlign: "start" }}>{colourScaleText}</div>
        <div
          style={{
            width: "100%",
            height: "1em",
            background: rgbListToGradient(rgbList),
          }}
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <Typography align="left" fontSize="small">
          {textLow}
        </Typography>
      </Grid>
      <Grid size={{ xs: 6 }}>
        <Typography align="right" fontSize="small">
          {textHigh}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default function ColourGradientTooltipContent({
  description = "",
  colourScaleText,
  textLow = "Low",
  textHigh = "High",
  rgbLow = [0, 0, 0],
  rgbHigh = [255, 255, 255],
}) {
  return (
    <div className={"content"}>
      {description}
      <p>{colourScaleText}</p>
      <ColourGradientScale
        textLow={textLow}
        textHigh={textHigh}
        rgbList={[rgbLow, rgbHigh]}
      />
    </div>
  );
}
