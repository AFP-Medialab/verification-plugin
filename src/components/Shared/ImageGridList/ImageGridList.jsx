import React from "react";
//import ImageList from '@mui/material//ImageList';
//import ImageListItem from '@mui/material//ImageListItem';
import { Grid } from "@mui/material/";
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

const ImageImageList = (props) => {
  const classes = useClasses(styles);

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        {props.list.map((tile, index) => {
          return (
            <Grid item key={index} xs={12 / props.cols}>
              {index === props.list.length - 1 && props.setLoading !== null ? (
                <img
                  src={tile}
                  alt={tile}
                  onClick={() => props.handleClick(props.list[index])}
                  onLoad={props.setLoading}
                  style={{ width: "100%", height: "auto" }}
                  data-testid={"assistant-media-grid-image-" + index}
                />
              ) : (
                <img
                  src={tile}
                  alt={tile}
                  onClick={() => props.handleClick(props.list[index])}
                  style={{ width: "100%", height: "auto" }}
                  data-testid={"assistant-media-grid-image-" + index}
                />
              )}
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};
export default ImageImageList;
