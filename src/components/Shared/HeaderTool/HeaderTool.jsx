import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

/**
 *
 */
const HeaderTool = ({ name, description, icon }) => {
  return (
    <Grid container direction="column" alignItems="start" spacing={1} mb={4}>
      <Box>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          {icon}
          <Typography variant="h5" color={"primary"}>
            {name}
          </Typography>
        </Grid>
      </Box>
      <Grid textAlign="start">
        <Typography>{description}</Typography>
      </Grid>
    </Grid>
  );
};
export default HeaderTool;
