import { useRef, useEffect } from "react";
import { applyThresholdAndGradient } from "../../utils";

/**
 * hook to perform the image processing in the canvas
 * @param imgSrc {string} image url
 * @returns {React.MutableRefObject<null>}
 */
const useImageCanvas = (imgSrc) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imgSrc) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.clearRect(0, 0, canvas.width, canvas.height);

    resizeCanvas(canvas);

    let image = new Image();
    image.src = imgSrc;
    image.crossOrigin = "Anonymous";

    image.onload = function () {
      context.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        context.canvas.clientWidth,
        context.canvas.clientHeight,
      );
      let imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      applyThresholdAndGradient(imageData, 127);
      context.putImageData(imageData, 0, 0);
    };
  }, [imgSrc]);

  /**
   * Resizes the canvas dynamically to its CSS size.
   * Returns true if the canvas was resized.
   * @param canvas {HTMLCanvasElement}
   * @returns {boolean}
   */
  function resizeCanvas(canvas) {
    const { width, height } = canvas.getBoundingClientRect();

    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio: ratio = 1 } = window;
      const context = canvas.getContext("2d");
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.scale(ratio, ratio);
      return true;
    }

    return false;
  }

  return canvasRef;
};

export default useImageCanvas;
