/**
 * From a given grayscale ImageData in a canvas, return a colored scale image with a threshold
 * The grayscale values under the threshold will be returned with an alpha channel of 0.
 * @param imageData {ImageData} the ImageData element to process.
 * @param threshold {number} the threshold for applying the colored scale with a number in the [0, 255] range.
 */
export function applyThresholdAndGradient(imageData, threshold) {
  let data = imageData.data;

  const mako0 = [10, 2, 3];
  const mako12 = [37, 23, 51];
  const mako30 = [50, 47, 113];
  const mako50 = [42, 99, 145];
  const mako70 = [46, 146, 155];
  const mako88 = [105, 208, 158];
  const mako100 = [215, 244, 223];

  const colorScale = [mako0, mako12, mako30, mako50, mako70, mako88, mako100];

  for (let i = 0; i < data.length; i += 4) {
    const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;

    let closestColorIndex = 0;

    for (let j = 0; j < colorScale.length - 1; j++) {
      if (
        grayscale >= (j * 255) / (colorScale.length - 1) &&
        grayscale <= ((j + 1) * 255) / (colorScale.length - 1)
      ) {
        closestColorIndex = j;
        break;
      }
    }

    // determine the values for each color channel based on linear interpolation
    let color1 = colorScale[closestColorIndex];
    let color2 = colorScale[closestColorIndex + 1];

    let factor =
      (grayscale - (closestColorIndex * 255) / (colorScale.length - 1)) /
      (255 / (colorScale.length - 1));

    imageData.data[i] = color1[0] + (color2[0] - color1[0]) * factor;
    imageData.data[i + 1] = color1[1] + (color2[1] - color1[1]) * factor;
    imageData.data[i + 2] = color1[2] + (color2[2] - color1[2]) * factor;

    // Set the alpha channel based on the threshold value
    imageData.data[i + 3] = grayscale >= threshold ? 255 : 0;
  }

  return data;
}

/**
 * Load an image to canvas asynchronously
 * @param url {string} The image url
 * @returns {Promise<HTMLImageElement>} A promise that resolves with the image element
 */
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.src = url;
    image.crossOrigin = "Anonymous";

    image.onload = () => resolve(image);
    image.onerror = () => reject(`Image failed to load: ${url}`);
  });
}
