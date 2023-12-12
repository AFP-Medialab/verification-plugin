import React from "react";
import { useImageCanvas } from "./useImageCanvas";

const ImageCanvas = (props) => {
  const {
    imgSrc,
    isGrayscaleInverted,
    applyColorScale,
    threshold: threshold,
    filterDataURL,
    containerRef,
    ...args
  } = props;
  const canvasRef = useImageCanvas(
    imgSrc,
    isGrayscaleInverted,
    applyColorScale,
    threshold,
    filterDataURL,
    containerRef,
  );

  return <canvas ref={canvasRef} {...args} />;
};

export default ImageCanvas;
