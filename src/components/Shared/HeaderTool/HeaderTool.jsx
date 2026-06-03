import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

/**
 *
 */
const HeaderTool = ({ name, description, icon, action }) => {
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
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {icon}
            <Typography variant="h5" color={"primary"}>
              {name}
            </Typography>
          </Box>

          {action && (
            <Box sx={{ display: "flex", alignItems: "center" }}>{action}</Box>
          )}
        </Box>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography sx={{ textAlign: "start" }}>{description}</Typography>
      </Grid>
    </Grid>
  );
};
export default HeaderTool;
