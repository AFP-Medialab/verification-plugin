import React from "react";

import Grid from "@mui/material/Grid";

import useClasses from "../MaterialUiStyles/useClasses";

const styles = () => ({
  root: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
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

const ImageGridList = (props) => {
  const classes = useClasses(styles);

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        {props.list.map((tile, index) => {
          return (
            <Grid
              key={index}
              size={{ xs: 12 / props.cols }}
              className={classes.checkeredBG}
            >
              {index === props.list.length - 1 && props.setLoading !== null ? (
                <img
                  src={tile}
                  alt={tile}
                  onClick={() => props.handleClick(props.list[index])}
                  onLoad={props.setLoading}
                  style={{
                    width: "auto",
                    height: "120px",
                    cursor: "pointer",
                    margin: "0 auto",
                  }}
                  data-testid={"assistant-media-grid-image-" + index}
                />
              ) : (
                <img
                  src={tile}
                  alt={tile}
                  onClick={() => props.handleClick(props.list[index])}
                  style={{
                    width: "auto",
                    height: "120px",
                    cursor: "pointer",
                    margin: "0 auto",
                  }}
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
export default ImageGridList;
