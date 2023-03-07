import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AdvancedTools from "../../NavItems/tools/Alltools/AdvancedTools/AdvancedTools";

const HeaderTool = (props) => {
  const name = props.name;
  const description = props.description;
  const icon = props.icon;
  const showAdvanced = props.advanced;

  return (
    <div>
      <Grid container direction="row" alignItems="center">
        <Grid item xs>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            {icon}
            <Typography variant="h4" color={"primary"}>
              {name}
            </Typography>
          </Grid>

          <Box ml={1}>
            <Typography variant="body1">{description}</Typography>
          </Box>
        </Grid>

        {showAdvanced && (
          <Grid item>
            <AdvancedTools />
          </Grid>
        )}
      </Grid>

      <Box m={3} />
    </div>
  );
};
export default HeaderTool;
