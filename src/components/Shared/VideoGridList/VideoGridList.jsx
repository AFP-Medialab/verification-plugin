import React from "react";

import Grid from "@mui/material/Grid";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import useClasses from "../MaterialUiStyles/useClasses";

const styles = (theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    overflow: "hidden",
  },
});

const VideoImageList = (props) => {
  const classes = useClasses(styles);

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        {props.list.map((tile, index) => {
          return (
            <Grid
              key={index}
              size={{ xs: 12 / props.cols }}
              sx={{ position: "relative" }}
            >
              <PlayArrowIcon
                sx={{
                  background: "rgba(0, 0, 0, 0.8)",
                  display: "block",
                  margin: "auto",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                }}
              />
              <video
                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                onClick={() => props.handleClick(props.list[index])}
                data-testid={"assistant-media-grid-image-" + index}
                src={tile}
              ></video>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default VideoImageList;
