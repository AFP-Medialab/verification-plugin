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
  checkeredBG: {
    background:
      "repeating-conic-gradient(#eee 0% 25%, #fafafa 0% 50%) 50% / 20px 20px",
  },
});

const ImageImageList = (props) => {
  const classes = useClasses(styles);

  return (
    <div className={classes.root}>
      <Grid2 container spacing={1}>
        {props.list.map((tile, index) => {
          return (
            <Grid2 key={index} size={{ xs: 12 / props.cols }}>
              {index === props.list.length - 1 && props.setLoading !== null ? (
                <img
                  src={tile}
                  alt={tile}
                  className={classes.checkeredBG}
                  onClick={() => props.handleClick(props.list[index])}
                  onLoad={props.setLoading}
                  style={{ width: "100%", height: "auto" }}
                  data-testid={"assistant-media-grid-image-" + index}
                />
              ) : (
                <img
                  src={tile}
                  alt={tile}
                  className={classes.checkeredBG}
                  onClick={() => props.handleClick(props.list[index])}
                  style={{ width: "100%", height: "auto" }}
                  data-testid={"assistant-media-grid-image-" + index}
                />
              )}
            </Grid2>
          );
        })}
      </Grid2>
    </div>
  );
};
export default ImageImageList;
