import React, { useEffect } from "react";
import { useImageCanvas } from "./useImageCanvas";

const ImageCanvas = (props) => {
  const {
    imgSrc,
    isGrayscaleInverted,
    applyColorScale,
    threshold: threshold,
    filterDataURL,
    ...args
  } = props;
  const canvasRef = useImageCanvas(
    imgSrc,
    isGrayscaleInverted,
    applyColorScale,
    threshold,
    filterDataURL,
  );

  return <canvas ref={canvasRef} {...args} />;
};

export default ImageCanvas;
