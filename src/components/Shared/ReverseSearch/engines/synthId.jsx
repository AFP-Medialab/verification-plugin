import { openNewTabWithUrl } from "../utils/openTabUtils";
import { IMAGE_FORMATS } from "../utils/searchUtils";

export const synthId = (imageObject, isRequestFromContextMenu) => {
  switch (imageObject.imageFormat) {
    case IMAGE_FORMATS.URI:
      synthIdRequestUrl(imageObject.obj);
      break;
    case IMAGE_FORMATS.BLOB:
      synthIdRequestLocal(imageObject.obj, isRequestFromContextMenu);
      break;
    default:
      throw new Error(
        `[synthId] Error: invalid image format  ${imageObject.imageFormat}`,
      );
  }
};

const SYNTHID_URL = "https://synthid.com/";
const UPLOAD_WAIT_MS = 15000;
const UPLOAD_SETTLE_MS = 400;

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

// Runs inside the synthid.com page: waits for the file input and fills it.
const injectImageInUpload = (dataUrl, fileName, waitMs, settleMs) =>
  new Promise((resolve) => {
    const fill = (input) => {
      const [header, b64] = dataUrl.split(",");
      const mime = header.match(/data:(.*?);/)?.[1] || "image/png";
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      const file = new File([bytes], fileName, { type: mime });
      const transfer = new DataTransfer();
      transfer.items.add(file);
      if (input) {
        input.files = transfer.files;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        const target = document.body;
        ["dragenter", "dragover", "drop"].forEach((type) =>
          target.dispatchEvent(
            new DragEvent(type, {
              bubbles: true,
              cancelable: true,
              dataTransfer: transfer,
            }),
          ),
        );
      }
      resolve(true);
    };

    // Fill only once the page has stopped changing, so the app has finished
    // loading the user session before it receives the file.
    let settleTimer;
    const trySettle = () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        const input = document.querySelector('input[type="file"]');
        if (input) {
          observer.disconnect();
          clearTimeout(timeout);
          fill(input);
        }
      }, settleMs);
    };
    const observer = new MutationObserver(trySettle);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    const timeout = setTimeout(() => {
      observer.disconnect();
      clearTimeout(settleTimer);
      fill(document.querySelector('input[type="file"]'));
    }, waitMs);
    trySettle();
  });

export const synthIdRequestUrl = async (imgUrl) => {
  const response = await fetch(imgUrl);
  if (!response.ok) {
    throw new Error(`[synthId] Unable to fetch image: ${response.status}`);
  }
  const blob = await response.blob();
  const dataUrl = await blobToDataUrl(blob);
  const extension = (blob.type.split("/")[1] || "png").split("+")[0];

  const tab = await browser.tabs.create({ url: SYNTHID_URL });
  const onUpdated = async (tabId, changeInfo) => {
    if (tabId !== tab.id || changeInfo.status !== "complete") return;
    browser.tabs.onUpdated.removeListener(onUpdated);
    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectImageInUpload,
      args: [dataUrl, `image.${extension}`, UPLOAD_WAIT_MS, UPLOAD_SETTLE_MS],
    });
  };
  browser.tabs.onUpdated.addListener(onUpdated);
};

const synthIdRequestLocal = (blob, isRequestFromContextMenu) => {
  const url = "https://toolbox.google.com/factcheck/explorer/uploads";
  //init upload

  const initHeader = new Headers();
  initHeader.append("X-Goog-Upload-Command", "start");
  initHeader.append("X-Goog-Upload-Protocol", "resumable");
  const initPost = {
    method: "POST",
    headers: initHeader,
  };
  const uploadHeader = new Headers();
  uploadHeader.append("X-Goog-Upload-Command", "upload, finalize");
  uploadHeader.append("X-Goog-Upload-Offset", "0");
  const uploadPost = {
    method: "POST",
    headers: uploadHeader,
    body: blob,
  };
  fetch(url, initPost)
    .then((response) => {
      return response.headers;
    })
    .then((headers) => {
      const uploadURL = headers.get("X-Goog-Upload-URL");
      //console.log("headers ", uploadURL);
      fetch(uploadURL, uploadPost)
        .then((response) => response.text())
        .then((result) => {
          const redirectURL = `https://toolbox.google.com/factcheck/explorer/search/${result};hl=`;
          const urlObject = { url: redirectURL };
          openNewTabWithUrl(urlObject, isRequestFromContextMenu);
        });
    });
};
