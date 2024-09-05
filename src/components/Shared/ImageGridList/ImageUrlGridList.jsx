import React from "react";
//import ImageList from '@mui/material//ImageList';
//import ImageListItem from '@mui/material//ImageListItem';
import { Grid2 } from "@mui/material/";
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
      <Grid2 container spacing={1}>
        {props.list.map((tile, index) => {
          return (
            <Grid2 key={index} xs={12 / props.cols}>
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
            </Grid2>
          );
        })}
      </Grid2>
    </div>
  );
};
export default ImageUrlGridList;
