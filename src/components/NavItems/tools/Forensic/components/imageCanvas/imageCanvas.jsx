import React from "react";
import useImageCanvas from "./useImageCanvas";

const ImageCanvas = (props) => {
  const {
    imgSrc,
    isGrayscaleInverted,
    applyColorScale,
    threshold: threshold,
    ...args
  } = props;
  const canvasRef = useImageCanvas(
    imgSrc,
    isGrayscaleInverted,
    applyColorScale,
    threshold,
  );

  return <canvas ref={canvasRef} {...args} />;
};

export default ImageCanvas;
