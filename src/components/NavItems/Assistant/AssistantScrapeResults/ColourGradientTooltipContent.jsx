import React from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { rgbListToGradient } from "./assistantUtils";

// TODO
// if all primary colours, this function won't be necessary anymore
// remove whole file?

export function ColourGradientScale({ textLow, textHigh, rgbList }) {
  return (
    <>
      <Grid container>
        <Grid size={{ xs: 6 }}>
          <Typography
            align="left"
            sx={{
              fontSize: "small",
              fontWeight: "bold",
            }}
          >
            {textLow}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography
            align="right"
            sx={{
              fontSize: "small",
              fontWeight: "bold",
            }}
          >
            {textHigh}
          </Typography>
        </Grid>
      </Grid>
      <div
        style={{
          width: "100%",
          height: "1em",
          background: rgbListToGradient(rgbList),
        }}
      />
    </>
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
