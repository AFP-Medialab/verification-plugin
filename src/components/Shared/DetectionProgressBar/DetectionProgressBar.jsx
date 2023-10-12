import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MakoScale from "../../NavBar/images/SVG/MakoScale.png";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Forensic.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";

export const DetectionProgressBar = (props) => {
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Forensic.tsv",
    tsv,
  );
  const [style, setStyle] = useState({
    height: "20px",
    transform: "scale(-1)",
    backgroundSize: "contain",
  });
  useEffect(() => {
    if (props.style) {
      if (!props.style.transform) props.style.transform = "scale(-1)";
      setStyle(props.style);
    }
  }, []);

  return (
    <div>
      <Box m={2} />

      <CardMedia image={MakoScale} style={style} />
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="body1">
            {keyword("forensic_text_nodetection")}
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="body1">
            {keyword("forensic_text_detection")}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};
