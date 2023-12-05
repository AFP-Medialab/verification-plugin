import React, { useEffect } from "react";
import useImageCanvas from "./useImageCanvas";

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

  useEffect(() => {
    console.log(canvasRef.current.toDataURL());
  }, [canvasRef]);

  return <canvas ref={canvasRef} {...args} />;
};

export default ImageCanvas;
