import React from "react";

import Grid from "@mui/material/Grid";

import useClasses from "../MaterialUiStyles/useClasses";

const styles = (theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    width: "100%",

    paddingBottom: "10px",
  },
});

const ImageUrlGridList = (props) => {
  const classes = useClasses(styles);

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        {props.list.map((tile, index) => {
          return (
            <Grid key={index} size={{ xs: 12 / props.cols }}>
              {index === props.list.length - 1 && props.setLoading !== null ? (
                <img
                  src={tile.url}
                  alt={tile.url}
                  onLoad={props.setLoading}
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <img
                  src={tile.url}
                  alt={tile.url}
                  style={{ width: "100%", height: "auto" }}
                />
              )}
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};
export default ImageUrlGridList;
