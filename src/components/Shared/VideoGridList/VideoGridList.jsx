import React from "react";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import useClasses from "../MaterialUiStyles/useClasses";

const styles = () => ({
  checkeredBG: {
    background:
      "repeating-conic-gradient(#eee 0% 25%, #fafafa 0% 50%) 50% / 20px 20px",
  },
});

const VideoImageList = (props) => {
  const classes = useClasses(styles);

  return (
    <ImageList
      cols={props.cols}
      style={{ rowGap: "16px", columnGap: "8px" }}
      sx={{ width: "100%", m: 0 }}
    >
      {props.list.map((tile, index) => (
        <ImageListItem key={index} sx={{ position: "relative" }}>
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
            className={classes.checkeredBG}
            style={{
              width: "100%",
              height: "120px",
              cursor: "pointer",
              display: "block",
            }}
            onClick={() => props.handleClick(props.list[index])}
            data-testid={"assistant-media-grid-image-" + index}
            src={tile}
          ></video>
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default VideoImageList;
