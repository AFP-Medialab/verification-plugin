import React from "react";
import useImageCanvas from "./useImageCanvas";

const ImageCanvas = (props) => {
  const { imgSrc, ...args } = props;
  const canvasRef = useImageCanvas(imgSrc);

  return <canvas ref={canvasRef} {...args} />;
};

export default ImageCanvas;
