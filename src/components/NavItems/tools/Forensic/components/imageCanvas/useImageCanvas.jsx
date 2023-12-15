import { useRef, useEffect } from "react";
import { applyThresholdAndGradient, preloadImage } from "../../utils";
import { useSelector } from "react-redux";

/**
 * hook to perform the image processing in the canvas
 * @param imgSrc {string} image url
 * @param isGrayscaleColorInverted {boolean} set to true if working with an inverted grayscale
 * @param applyColorScale {boolean} set to true if working with a color scale
 * @param threshold {number} the threshold value between 0 and 255. The detection starts from 50%
 * @param filterDataUrl {function(string)} function to retrieve the DataUrl computed by the component
 * @returns {React.MutableRefObject<null>}
 */
const useImageCanvas = (
  imgSrc,
  isGrayscaleColorInverted,
  applyColorScale,
  threshold,
  filterDataURL,
) => {
  const canvasRef = useRef();

  let imageRatio = useSelector((state) => state.forensic.imageRatio);

  useEffect(() => {
    if (!imgSrc) return;
    async function loadAndProcessImage(imgSrc) {
      const canvas = canvasRef.current;

      if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;

      const context = canvas.getContext("2d", {
        willReadFrequently: true,
        desynchronized: true,
      });

      const image = await preloadImage(imgSrc);

      // Resize image to the forensic image ratio if possible
      if (!imageRatio) {
        imageRatio = image.naturalWidth / image.naturalHeight;
      }
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetWidth / imageRatio;

      context.clearRect(0, 0, canvas.width, canvas.height);

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
        context.canvas.width,
        context.canvas.height,
      );

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

export { useImageCanvas };
