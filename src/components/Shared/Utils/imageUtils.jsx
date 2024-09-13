/**
 * Converts an ImageData object to File
 * @param imageData {ImageData}
 * @param fileName {string}
 * @param imageType {string}
 * @returns {Promise<File | Error>}
 */
const imageDataToFile = async (imageData, fileName, imageType) => {
  const offscreenCanvas = new OffscreenCanvas(
    imageData.width,
    imageData.height,
  );

  //1. Create an OffscreenCanvas
  const ctx = offscreenCanvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);

  //2. Convert the OffscreenCanvas to a Blob
  const blob = await offscreenCanvas.convertToBlob({ type: imageType });
  if (!blob) {
    return new Error("OffscreenCanvas to Blob conversion failed");
  }

  //3. Convert the Blob to a File
  return new File([blob], fileName, { type: blob.type }, imageType);
};

/**
 *
 * @param imageData {File | Blob}
 * @returns {Promise<File | Blob | Error>}
 */
export const resizeImage = async (imageData) => {
  const MAX_PIXEL_SIZE = 2073599; //  < 2Mpx

  // Create ImageBitmap from image data
  const imageBitmap = await createImageBitmap(imageData);

  // Check if the image exceeds the max pixel size
  const originalPixelSize = imageBitmap.width * imageBitmap.height;

  if (originalPixelSize <= MAX_PIXEL_SIZE) {
    // If the image is within the max pixel size, return as is
    return imageData;
  }

  // Calculate new dimensions maintaining the aspect ratio
  const aspectRatio = imageBitmap.width / imageBitmap.height;
  let newWidth, newHeight;

  if (aspectRatio > 1) {
    newWidth = Math.sqrt(MAX_PIXEL_SIZE * aspectRatio);
    newHeight = newWidth / aspectRatio;
  } else {
    newHeight = Math.sqrt(MAX_PIXEL_SIZE / aspectRatio);
    newWidth = newHeight * aspectRatio;
  }

  // Resize the image using an OffscreenCanvas
  const resizedImageData = await resizeUsingCanvas(
    imageBitmap,
    newWidth,
    newHeight,
  );

  return imageDataToFile(
    resizedImageData,
    imageData.name ?? "image",
    imageData.type,
  );
};

// Helper function to resize the image using a canvas
const resizeUsingCanvas = async (imageBitmap, newWidth, newHeight) => {
  const offscreenCanvas = new OffscreenCanvas(newWidth, newHeight);
  const context = offscreenCanvas.getContext("2d");
  context.drawImage(imageBitmap, 0, 0, newWidth, newHeight);

  // Get ImageData from the OffscreenCanvas
  return context.getImageData(0, 0, newWidth, newHeight);
};
