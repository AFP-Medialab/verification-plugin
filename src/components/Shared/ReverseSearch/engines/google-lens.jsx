import { openNewTabWithUrl } from "../utils/openTabUtils";
import { IMAGE_FORMATS } from "../utils/searchUtils";

export const googleLensReversearch = (
  imageObject,
  isRequestFromContextMenu,
) => {
  switch (imageObject.imageFormat) {
    case IMAGE_FORMATS.URI:
      reverseRemoteGoogleLens(imageObject.obj, isRequestFromContextMenu);
      break;
    case IMAGE_FORMATS.BLOB:
      reverseImageSearchGoogleLensLocal(
        imageObject.obj,
        isRequestFromContextMenu,
      );
      break;
    default:
      throw new Error(
        `[reverseImageSearchGoogleLens] Error: invalid image format  ${imageObject.imageFormat}`,
      );
  }
};

export const reverseRemoteGoogleLens = (
  url,
  isRequestFromContextMenu = true,
) => {
  // Use Google Images searchbyimage which routes to Lens results and is more stable
  const tabUrl = `https://www.google.com/searchbyimage?image_url=${encodeURIComponent(url)}&sbisrc=cr_1`;
  const urlObject = { url: tabUrl };
  openNewTabWithUrl(urlObject, isRequestFromContextMenu);
};

/**
 * Search with a local image by injecting a POST into a google.com tab.
 *
 * A direct fetch from the extension context gets a 403 because Google rejects
 * requests with Origin: chrome-extension://... The workaround is to open
 * google.com in the background (active: false keeps the popup alive), then
 * inject a script running in MAIN world so the POST is treated as same-origin.
 *
 * @param {Blob} imgBlob - The image blob to upload
 * @param {boolean} isRequestFromContextMenu - Whether request is from context menu
 */
export const reverseImageSearchGoogleLensLocal = async (
  imgBlob,
  isRequestFromContextMenu = true,
) => {
  try {
    const dataUrl = await blobToDataUrl(imgBlob);

    // Open google.com in the background so the popup stays alive while we
    // wait for the page to load and inject the upload script.
    const tab = await browser.tabs.create({
      url: "https://www.google.com/",
      active: false,
    });

    // onDOMContentLoaded fires as soon as the DOM is parsed — much earlier than
    // tabs.onUpdated "complete" (which waits for all resources). MAIN world
    // execution only needs the page context to be established, which is ready
    // at DOMContentLoaded.
    await new Promise((resolve) => {
      const listener = (details) => {
        if (details.tabId === tab.id && details.frameId === 0) {
          browser.webNavigation.onDOMContentLoaded.removeListener(listener);
          resolve();
        }
      };
      browser.webNavigation.onDOMContentLoaded.addListener(listener);
    });

    // MAIN world: the script runs with the page's origin (google.com), so the
    // POST to /searchbyimage/upload is same-origin and Google accepts it.
    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      world: "MAIN",
      func: uploadAndNavigate,
      args: [dataUrl],
    });

    // Make the tab visible now that the upload and navigation are underway.
    if (!isRequestFromContextMenu) {
      await browser.tabs.update(tab.id, { active: true });
    }
  } catch (error) {
    console.error("Error in reverseImageSearchGoogleLensLocal:", error);
    alert(
      `Failed to upload image to Google: ${error.message}\nCheck browser console for details.`,
    );
  }
};

/**
 * Injected into google.com (MAIN world). Posts the image to the reverse image
 * search endpoint and navigates the tab to the results page.
 */
async function uploadAndNavigate(imageDataUrl) {
  const imgResponse = await fetch(imageDataUrl);
  const blob = await imgResponse.blob();

  const formData = new FormData();
  formData.append("encoded_image", blob, "image.jpg");
  formData.append("sbisrc", "cr_1");

  const uploadResponse = await fetch("/searchbyimage/upload", {
    method: "POST",
    body: formData,
    redirect: "follow",
  });

  window.location.href = uploadResponse.url.includes("/search")
    ? uploadResponse.url
    : "https://lens.google.com/";
}

/**
 * Convert a Blob to a data URL
 * @param {Blob} blob - The blob to convert
 * @returns {Promise<string>} The data URL
 */
const blobToDataUrl = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
