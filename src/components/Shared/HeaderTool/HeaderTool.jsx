import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AdvancedTools from "../../NavItems/tools/Alltools/AdvancedTools/AdvancedTools";

const HeaderTool = (props) => {
  const name = props.name;
  const description = props.description;
  const icon = props.icon;
  const showAdvanced = props.advanced;

  return (
    <Grid container direction="column" alignItems="start" mb={3}>
      <Grid item xs>
        <Grid
          container
          item
          direction="row"
          justifyContent="flex-start"
          alignItems="start"
        >
          {icon}
          <Typography variant="h4" color={"primary"}>
            {name}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs textAlign="start">
        <Typography>{description}</Typography>
      </Grid>

      {showAdvanced && (
        <Grid item>
          <AdvancedTools />
        </Grid>
      )}
    </Grid>
  );
};
export default HeaderTool;
