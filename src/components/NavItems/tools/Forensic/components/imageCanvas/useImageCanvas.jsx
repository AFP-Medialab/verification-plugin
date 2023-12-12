import { useRef, useEffect } from "react";
import { applyThresholdAndGradient, preloadImage } from "../../utils";

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
    const context = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);
    console.log("resize ", canvas);
    return true;
  }

  return false;
}
function preserveImageRatio(image, canvas, context) {
  if (image.width <= 0) {
    return;
  }
  const factor =
    (canvas.width / image.naturalWidth) * image.naturalHeight >
    window.innerHeight
      ? canvas.height / image.naturalHeight
      : canvas.width / image.naturalWidth;
  context.drawImage(
    image,
    0,
    0,
    image.naturalWidth * factor,
    image.naturalHeight * factor,
    0,
    0,
    canvas.clientWidth * factor,
    canvas.clientHeight * factor,
  );
}

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
  containerRef,
) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (!imgSrc) return;
    async function loadAndProcessImage(imgSrc) {
      const image = await preloadImage(imgSrc);
      const canvas = canvasRef.current;

      if (!canvas) return;

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      resizeCanvas(canvas);

      if (containerRef && containerRef.current) {
        console.log(containerRef.offsetWidth);
        console.log(containerRef.offsetHeight);
      }

      // if (imageNaturalWidth) canvas.width = imageNaturalWidth;
      // if (imageNaturalHeight) canvas.height = imageNaturalHeight;

      const context = canvas.getContext("2d", {
        willReadFrequently: true,
        desynchronized: true,
      });
      context.clearRect(0, 0, image.naturalWidth, image.naturalHeight);

      // Invert the grayscale for the inverted filters
      if (isGrayscaleColorInverted) context.filter = "invert(1)";
      context.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        context.canvas.clientWidth,
        context.canvas.clientHeight,
      );

      preserveImageRatio(image, canvas, context);

      let imageData = context.getImageData(
        0,
        0,
        context.canvas.width,
        context.canvas.height,
      );

      if (applyColorScale) applyThresholdAndGradient(imageData, threshold);

      context.putImageData(imageData, 0, 0);

      if (filterDataURL) filterDataURL(canvas.toDataURL());
    }
    loadAndProcessImage(imgSrc);
  }, [imgSrc, threshold, isGrayscaleColorInverted, applyColorScale]);

  return canvasRef;
};

export { useImageCanvas, resizeCanvas };
