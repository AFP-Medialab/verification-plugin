import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import MakoScale from "../../NavBar/images/SVG/MakoScale.png";

export const DetectionProgressBar = (props) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Forensic");
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
    <Box mr={"43px"}>
      <CardMedia image={MakoScale} style={style} />
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid>
          <Typography variant="body1">
            {keyword("forensic_text_nodetection")}
          </Typography>
        </Grid>

        <Grid>
          <Typography variant="body1">
            {keyword("forensic_text_detection")}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
