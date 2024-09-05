import React from "react";
import { Grid2, Typography } from "@mui/material";

const HeaderTool = (props) => {
  const name = props.name;
  const description = props.description;
  const icon = props.icon;

  return (
    <Grid2 container direction="column" alignItems="start" mb={3}>
      <Grid2 size="grow">
        <Grid2
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          {icon}
          <Typography variant="h4" color={"primary"}>
            {name}
          </Typography>
        </Grid2>
      </Grid2>
      <Grid2 size="grow" textAlign="start">
        <Typography>{description}</Typography>
      </Grid2>
    </Grid2>
  );
};
export default HeaderTool;
