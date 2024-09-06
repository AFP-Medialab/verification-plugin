import React from "react";
import { Grid2 } from "@mui/material";
import Typography from "@mui/material/Typography";

import { rgbListToGradient } from "./assistantUtils";

export function ColourGradientScale({ textLow, textHigh, rgbList }) {
  return (
    <>
      <Grid2 container>
        <Grid2 size={{ xs: 6 }}>
          <Typography align="left" fontSize="small" fontWeight="bold">
            {textLow}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <Typography align="right" fontSize="small" fontWeight="bold">
            {textHigh}
          </Typography>
        </Grid2>
      </Grid2>
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
