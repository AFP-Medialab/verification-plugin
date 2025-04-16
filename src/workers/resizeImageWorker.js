import { resizeImage } from "@Shared/Utils/imageUtils";

// eslint-disable-next-line no-undef
self.onmessage = async function (e) {
  const data = e.data;

  const result = await resizeImage(data);

  // Send the result back to the main thread
  // eslint-disable-next-line no-undef
  self.postMessage(result);
};
