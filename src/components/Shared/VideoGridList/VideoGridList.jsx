import React from "react";
import ImageList from "@mui/material//ImageList";
import ImageListItem from "@mui/material//ImageListItem";
import Link from "@mui/material/Link";
import LinkIcon from "@mui/icons-material/Link";
import useClasses from "../MaterialUiStyles/useClasses";

const styles = (theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    width: "100%",
    maxHeight: "500px",
  },
  icon: {
    color: theme.palette.secondary.main,
    position: "relative",
    top: theme.spacing(1),
    width: theme.typography.h5.fontSize,
    height: theme.typography.h5.fontSize,
    marginRight: 3,
  },
});

const VideoImageList = (props) => {
  const classes = useClasses(styles);

  return (
    <div className={classes.root}>
      <ImageList rowHeight={"auto"} className={classes.imageList} cols={1}>
        {props.list.map((tile, index) => (
          <ImageListItem key={index} cols={1}>
            <LinkIcon className={classes.icon} />
            <Link
              variant="body2"
              onClick={() => {
                props.handleClick(tile);
              }}
            >
              {tile}
            </Link>
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};
export default VideoImageList;
