import { resizeImage } from "@Shared/Utils/imageUtils";

self.onmessage = async function (e) {
  const data = e.data;

  // console.log(e);
  const result = await resizeImage(data);
  // console.log(result);

  // Send the result back to the main thread
  self.postMessage(result);
};
