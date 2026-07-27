import React from "react";

import useClasses from "../MaterialUiStyles/useClasses";

const styles = () => ({
  root: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
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
  const imgStyle = {
    width: "auto",
    maxWidth: "100%",
    height: "120px",
    cursor: "pointer",
    display: "block",
  };

  // for Thumbnails tool
  if (props.centered) {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {props.list.map((tile, index) => (
          <img
            key={index}
            src={tile}
            alt={tile}
            className={classes.checkeredBG}
            onClick={() => props.handleClick(props.list[index])}
            style={imgStyle}
            data-testid={"assistant-media-grid-image-" + index}
          />
        ))}
      </div>
    );
  }

  // for Assistant
  return (
    <div className={classes.root}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${props.cols}, 1fr)`,
          gap: "8px",
          width: "100%",
        }}
      >
        {props.list.map((tile, index) => {
          return (
            <div key={index} style={{ position: "relative" }}>
              {index === props.list.length - 1 && props.setLoading !== null ? (
                <img
                  src={tile}
                  alt={tile}
                  className={classes.checkeredBG}
                  onClick={() => props.handleClick(props.list[index])}
                  onLoad={props.setLoading}
                  style={imgStyle}
                  data-testid={"assistant-media-grid-image-" + index}
                />
              ) : (
                <img
                  src={tile}
                  alt={tile}
                  className={classes.checkeredBG}
                  onClick={() => props.handleClick(props.list[index])}
                  style={imgStyle}
                  data-testid={"assistant-media-grid-image-" + index}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ImageGridList;
