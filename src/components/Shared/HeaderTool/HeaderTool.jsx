import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

/**
 *
 */
const HeaderTool = ({ name, description, icon }) => {
  return (
    <Grid
      container
      direction="column"
      spacing={1}
      sx={{
        alignItems: "start",
        mb: 4,
      }}
    >
      <Box>
        <Grid
          container
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {icon}
          <Typography variant="h5" color={"primary"}>
            {name}
          </Typography>
        </Grid>
      </Box>
      <Grid
        sx={{
          textAlign: "start",
        }}
      >
        <Typography>{description}</Typography>
      </Grid>
    </Grid>
  );
};
export default HeaderTool;
