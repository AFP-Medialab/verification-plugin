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
  checkeredBG: {
    background:
      "repeating-conic-gradient(#eee 0% 25%, #fafafa 0% 50%) 50% / 20px 20px",
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
              className={classes.checkeredBG}
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
                style={{
                  width: "auto",
                  height: "120px",
                  cursor: "pointer",
                  margin: "0 auto",
                }}
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
