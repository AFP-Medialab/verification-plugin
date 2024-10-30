import React, { useEffect, useState } from "react";
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
      "repeating-conic-gradient(#808080 0% 25%, #eee 0% 50%) 50% / 20px 20px",
  },
});

const ImageImageList = (props) => {
  const classes = useClasses(styles);

  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    const filteredImages = [];
    const promises = props.list.map((imageUrl) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
          if (image.width > 2 && image.height > 2) {
            filteredImages.push(imageUrl);
          }
          resolve();
        };
      });
    });

    Promise.all(promises).then(() => {
      setFilteredList(filteredImages);
    });
  }, [props.list]);

  return (
    <div className={classes.root}>
      <Grid2 container spacing={1}>
        {filteredList.map((tile, index) => {
          return (
            <Grid2 key={index} size={{ xs: 12 / props.cols }}>
              {index === filteredList.length - 1 &&
              props.setLoading !== null ? (
                <img
                  src={tile}
                  alt={tile}
                  className={classes.checkeredBG}
                  onClick={() => props.handleClick(filteredList[index])}
                  onLoad={props.setLoading}
                  style={{ width: "100%", height: "auto" }}
                  data-testid={"assistant-media-grid-image-" + index}
                />
              ) : (
                <img
                  src={tile}
                  alt={tile}
                  onClick={() => props.handleClick(filteredList[index])}
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
