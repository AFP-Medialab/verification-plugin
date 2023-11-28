/**
 * From a given grayscale ImageData in a canvas, return a colored scale image with a threshold
 * The grayscale values under the threshold will be returned with an alpha channel of 0.
 * @param imageData {ImageData} the ImageData element to process.
 * @param threshold {number} the threshold for applying the colored scale with a number in the [0, 255] range.
 */
export function applyThresholdAndGradient(imageData, threshold) {
  let data = imageData.data;
  const imgWidth = imageData.width;
  const imgHeight = imageData.height;

  // Define Mako gradient colors
  const makoDeepBlue = [42, 99, 145];
  const makoTeal = [76, 196, 157];
  const makoLightGreen = [210, 241, 218];

  for (let y = 0; y < imgHeight; y++) {
    for (let x = 0; x < imgWidth; x++) {
      const dstOff = (y * imgWidth + x) * 4;

      // Calculate grayscale value using a simple average of RGB values
      const grayscale =
        (data[dstOff] + data[dstOff + 1] + data[dstOff + 2]) / 3;

      // Apply the threshold
      if (grayscale > threshold) {
        // Calculate the interpolation factor based on the grayscale value
        const factor = (grayscale - threshold) / (255 - threshold);

        // Interpolate between deep blue, teal and light green
        for (let i = 0; i < 3; i++) {
          data[dstOff + i] = Math.round(
            // makoDeepBlue[i] + factor * (makoLightGreen[i] - makoDeepBlue[i])
            makoDeepBlue[i] +
              factor *
                (makoTeal[i] -
                  makoDeepBlue[i] +
                  factor * (makoLightGreen[i] - makoTeal[i])),
          );
        }
      } else {
        // Set the alpha channel to 0 for pixels below the threshold
        data[dstOff + 3] = 0;
      }
    }
  }
  return data;
}
