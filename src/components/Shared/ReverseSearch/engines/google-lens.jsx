import { openNewTabWithUrl } from "../utils/openTabUtils";
import { IMAGE_FORMATS } from "../utils/searchUtils";

// Timing constants — increase if Google Lens upload fails on slow connections
const LENS_PAGE_READY_DELAY_MS = 300; // wait after tab "complete" event before injecting
const LENS_CONSENT_DISMISS_DELAY_MS = 500; // wait after dismissing cookie popup
const LENS_TRIGGER_CLICK_DELAY_MS = 300; // wait for file input after clicking upload button (waitForElement handles the rest)
const LENS_UPLOAD_SETTLE_DELAY_MS = 300; // wait after setting file before resolving

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
 * Search with local image by uploading directly to lens.google.com
 * @param {Blob} imgBlob - The image blob to upload
 * @param {boolean} isRequestFromContextMenu - Whether request is from context menu
 */
export const reverseImageSearchGoogleLensLocal = async (
  imgBlob,
  isRequestFromContextMenu = true,
) => {
  try {
    const dataUrl = await blobToDataUrl(imgBlob);

    // Open Google Lens directly — more stable than the Google homepage approach
    const tab = await browser.tabs.create({
      url: "https://lens.google.com/",
      active: !isRequestFromContextMenu,
    });

    await new Promise((resolve) => {
      const listener = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === "complete") {
          browser.tabs.onUpdated.removeListener(listener);
          setTimeout(resolve, LENS_PAGE_READY_DELAY_MS);
        }
      };
      browser.tabs.onUpdated.addListener(listener);
    });

    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: uploadToGoogleLens,
      args: [
        dataUrl,
        "image.jpg",
        LENS_CONSENT_DISMISS_DELAY_MS,
        LENS_TRIGGER_CLICK_DELAY_MS,
        LENS_UPLOAD_SETTLE_DELAY_MS,
      ],
    });
  } catch (error) {
    console.error("Error in reverseImageSearchGoogleLensLocal:", error);
    alert(
      `Failed to upload image to Google Lens: ${error.message}\nCheck browser console for details.`,
    );
  }
};

/**
 * Content script injected into lens.google.com to trigger file upload.
 * Handles consent popup, finds the upload trigger, and sets the image file.
 */
async function uploadToGoogleLens(
  imageDataUrl,
  filename,
  consentDismissDelay = 800,
  triggerClickDelay = 1000,
  uploadSettleDelay = 500,
) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

        const waitForElement = (selector, timeout = 10000) =>
          new Promise((res, rej) => {
            const start = Date.now();
            const check = () => {
              const el = document.querySelector(selector);
              if (el) return res(el);
              if (Date.now() - start > timeout)
                return rej(new Error(`Element not found: ${selector}`));
              setTimeout(check, 100);
            };
            check();
          });

        const waitForElementXPath = (xpath, timeout = 5000) =>
          new Promise((res) => {
            const start = Date.now();
            const check = () => {
              const result = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null,
              );
              const el = result.singleNodeValue;
              if (el) return res(el);
              if (Date.now() - start > timeout) return res(null);
              setTimeout(check, 100);
            };
            check();
          });

        // Dismiss consent/cookie popup if present
        const consentPopup = await waitForElementXPath(
          `//div[@role="dialog"
            and contains(., "g.co/privacytools")
            and .//a[starts-with(@href, "https://policies.google.com/technologies/cookies")]
          ]`,
        );
        if (consentPopup) {
          const buttons = consentPopup.querySelectorAll("button");
          if (buttons.length >= 3) buttons[2].click();
          else if (buttons.length > 0) buttons[buttons.length - 1].click();
          await sleep(consentDismissDelay);
        }

        // Check if a file input is already present (some Lens page variants expose it directly)
        let fileInput = document.querySelector('input[type="file"]');

        if (!fileInput) {
          // Try to find and click the upload trigger button on lens.google.com.
          // Google updates their DOM frequently, so we try multiple selectors.
          const uploadTriggerSelectors = [
            // Current Lens homepage "Upload an image" area
            '[aria-label*="Upload" i]',
            '[aria-label*="Importer" i]',
            '[aria-label*="Caméra" i]',
            '[aria-label*="Search by image" i]',
            '[aria-label*="Recherche par image" i]',
            // Data attributes used in various Google Lens versions
            "[data-base-lens-url]",
            "[data-uploadbtn]",
            // jsaction-based selectors
            '[jsaction*="upload"]',
            '[jsaction*="lens"]',
            // Generic upload area / button fallbacks
            'div[role="button"][jscontroller]',
          ];

          for (const selector of uploadTriggerSelectors) {
            const el = document.querySelector(selector);
            if (el) {
              el.click();
              await sleep(triggerClickDelay);
              fileInput = document.querySelector('input[type="file"]');
              if (fileInput) break;
            }
          }

          // Last resort: wait for a file input to appear after any click
          if (!fileInput) {
            fileInput = await waitForElement('input[type="file"]');
          }
        }

        // Convert data URL to File and assign it to the input
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        const file = new File([blob], filename, {
          type: blob.type || "image/jpeg",
        });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event("change", { bubbles: true }));

        await sleep(uploadSettleDelay);
        resolve({ success: true });
      } catch (error) {
        console.error("[Google Lens Upload] Error:", error);
        reject({ success: false, error: error.message });
      }
    })();
  });
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
