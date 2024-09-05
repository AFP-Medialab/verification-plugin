import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import { Grid2 } from "@mui/material";
import Typography from "@mui/material/Typography";
import MakoScale from "../../NavBar/images/SVG/MakoScale.png";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

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
      <Grid2
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid2>
          <Typography variant="body1">
            {keyword("forensic_text_nodetection")}
          </Typography>
        </Grid2>

        <Grid2>
          <Typography variant="body1">
            {keyword("forensic_text_detection")}
          </Typography>
        </Grid2>
      </Grid2>
    </Box>
  );
};
