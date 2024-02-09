/**
 * Interpolate RGB between an arbitrary range
 * @param value
 * @param low
 * @param high
 * @param rgbLow RGB Value represented as an array e.g. [255, 255, 255] for white
 * @param rgbHigh RGB Value represented as an array e.g. [255, 255, 255] for white
 * @returns {*[]}
 */
export const interpRgb = (value, low, high, rgbLow, rgbHigh) => {
  let interp = value;
  if (value < low) interp = low;
  if (value > high) interp = high;
  interp = (interp - low) / (high - low);

  let output = [];
  for (let i = 0; i < rgbLow.length; i++) {
    let channelLow = rgbLow[i];
    let channelHigh = rgbHigh[i];
    let delta = channelHigh - channelLow;
    output.push(channelLow + delta * interp);
  }

  return output;
};

/**
 * Converts an array-based RGB representation to rgba() format used by CSS
 * @param rgb RGB value represented as an array e.g. [255, 255, 255] for white
 * @returns {string}
 */
export const rgbToString = (rgb) => {
  return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",1)";
};

/**
 * Calculates the luminance of an RGB colour
 * @param rgb RGB value represented as an array e.g. [255, 255, 255] for white
 * @returns {number}
 */
export const rgbToLuminance = (rgb) => {
  let rgbNorm = rgb.map((c) => c / 255);
  let rgbLinear = rgbNorm.map((c) => {
    if (c <= 0.04045) {
      return c / 12.92;
    } else {
      return Math.pow((c + 0.055) / 1.055, 2.4);
    }
  });
  let luminance =
    rgbLinear[0] * 0.2126 + rgbLinear[1] * 0.7152 + rgbLinear[2] * 0.0722;
  return luminance;
};

/**
 * Generate CSS gradient from a list of RGB values
 * @param rgbList List RGB value represented as an array e.g. [[0,0,0], [255, 255, 255]] for a black to white gradient
 * @returns {string}
 */
export const rgbListToGradient = (rgbList) => {
  let gradientStr = "";
  for (let i = 0; i < rgbList.length; i++) {
    let colourStr = rgbToString(rgbList[i]);
    let percentageStr = Math.round((i / (rgbList.length - 1)) * 100).toString();

    if (i > 0) gradientStr += ",";
    gradientStr += colourStr + " " + percentageStr + "%";
  }
  const output = "linear-gradient(90deg, " + gradientStr + ")";
  return output;
};
