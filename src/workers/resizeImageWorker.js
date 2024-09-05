import { resizeImage } from "../components/Shared/Utils/imageUtils";

self.onmessage = async function (e) {
  const data = e.data;

  // console.log(e);
  const result = await resizeImage(data);
  // console.log(result);
  //const result = data;

  // Send the result back to the main thread
  self.postMessage(result);
};
