import React from "react";
import { useImageCanvas } from "./useImageCanvas";

const ImageCanvas = (props) => {
  const {
    imgSrc,
    isGrayscaleInverted,
    applyColorScale,
    threshold: threshold,
    filterDataURL,
    imageNaturalWidth,
    imageNaturalHeight,
    ...args
  } = props;
  const canvasRef = useImageCanvas(
    imgSrc,
    isGrayscaleInverted,
    applyColorScale,
    threshold,
    filterDataURL,
    imageNaturalWidth,
    imageNaturalHeight,
  );

  return <canvas ref={canvasRef} {...args} />;
};

export default ImageCanvas;
