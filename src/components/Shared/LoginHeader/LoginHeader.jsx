import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AdvancedTools from "../../NavItems/tools/Alltools/AdvancedTools/AdvancedTools";

const LoginHeader = (props) => {
  const name = props.name;
  const icon = props.icon;

  return (
    <Grid
      container
      direction="row"
      alignItems="flex-end"
      justifyContent="space-between"
      mb={3}
    >
      <Grid
        container
        item
        xs={12}
        md={6}
        direction="row"
        justifyContent="flex-start"
      >
        <Grid item>{icon}</Grid>
        <Grid item>
          <Typography variant="h4" color={"primary"}>
            {name}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        item
        xs={12}
        md={6}
        justifyContent="end"
        alignItems="flex-end"
      >
        <AdvancedTools />
      </Grid>
    </Grid>
  );
};
export default LoginHeader;
