import React from "react";

import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

/**
 *
 */
const HeaderTool = ({ name, description, icon }) => {
  return (
    <Grid2 container direction="column" alignItems="start" spacing={1} mb={4}>
      <Box>
        <Grid2
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
        </Grid2>
      </Box>
      <Grid2 textAlign="start">
        <Typography>{description}</Typography>
      </Grid2>
    </Grid2>
  );
};
export default HeaderTool;
