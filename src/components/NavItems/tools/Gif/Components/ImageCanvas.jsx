import React, { useRef, useEffect } from "react";
import { preloadImage } from "../../Forensic/utils";

const ImageTextCanvas = (props) => {
  const { image, text, ...args } = props;
  const canvasRef = useRef(null);
  var newImage;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    async function loadAndPreloadImage(image) {
      const img = await preloadImage(image);

      const imageRatio = img.naturalWidth / img.naturalHeight;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetWidth / imageRatio;

      context.drawImage(
        img,
        0,
        0,
        img.naturalWidth,
        img.naturalHeight,
        0,
        0,
        context.canvas.width,
        context.canvas.height,
      );

      if (text) {
        context.font = "50px Arial";
        context.fillStyle = "red";
        context.fillText(text, 10, 80);
      }
    }

    loadAndPreloadImage(image);
  }, [image, text]);

  return <canvas ref={canvasRef} {...args} />;
};

export default ImageTextCanvas;
