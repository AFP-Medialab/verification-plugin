import { useRef, useEffect } from "react";
import { applyThresholdAndGradient, preloadImage } from "../../utils";

/**
 * hook to perform the image processing in the canvas
 * @param imgSrc {string} image url
 * @param isGrayscaleColorInverted {boolean} set to true if working with an inverted grayscale
 * @param applyColorScale {boolean} set to true if working with a color scale
 * @param threshold {number} the threshold value between 0 and 255. The detection starts from 50%
 * @returns {React.MutableRefObject<null>}
 */
const useImageCanvas = (
  imgSrc,
  isGrayscaleColorInverted,
  applyColorScale,
  threshold,
  filterDataURL,
  imageNaturalWidth,
  imageNaturalHeight,
) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imgSrc) return;
    async function loadAndProcessImage(imgSrc) {
      const image = await preloadImage(imgSrc);

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.clearRect(0, 0, canvas.width, canvas.height);

      resizeCanvas(canvas);

      // Invert the grayscale for the inverted filters
      if (isGrayscaleColorInverted) context.filter = "invert(1)";

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

      if (applyColorScale) applyThresholdAndGradient(imageData, threshold);

      context.putImageData(imageData, 0, 0);

      if (filterDataURL) filterDataURL(canvas.toDataURL());

      if (imageNaturalWidth) imageNaturalWidth(image.naturalWidth);
      if (imageNaturalHeight) imageNaturalHeight(image.naturalHeight);
    }

    loadAndProcessImage(imgSrc);
  }, [imgSrc, threshold, isGrayscaleColorInverted, applyColorScale]);

  /**
   * Resizes the canvas dynamically to its CSS size.
   * Returns true if the canvas was resized.
   * @param canvas {HTMLCanvasElement}
   * @returns {boolean}
   */
  function resizeCanvas(canvas) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

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
