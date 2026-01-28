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
  const tabUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(
    url,
  )}`;
  const urlObject = { url: tabUrl };
  openNewTabWithUrl(urlObject, isRequestFromContextMenu);
};

/**
 * Search with local image using content script injection
 * Opens Google homepage and uploads image to Google Lens
 * @param {Blob} imgBlob - The image blob to upload
 * @param {boolean} isRequestFromContextMenu - Whether request is from context menu
 */
export const reverseImageSearchGoogleLensLocal = async (
  imgBlob,
  isRequestFromContextMenu = true,
) => {
  try {
    // Convert blob to data URL
    const dataUrl = await blobToDataUrl(imgBlob);

    // Open Google homepage (this is where Google Lens upload starts)
    const tab = await browser.tabs.create({
      url: "https://www.google.com/webhp?hl=en",
      active: !isRequestFromContextMenu,
    });

    // Wait for the tab to load completely
    await new Promise((resolve) => {
      const listener = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === "complete") {
          browser.tabs.onUpdated.removeListener(listener);
          // Add a small delay to ensure page is fully interactive
          setTimeout(resolve, 1000);
        }
      };
      browser.tabs.onUpdated.addListener(listener);
    });

    // Inject the content script inline and execute upload
    const results = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: uploadToGoogleLens,
      args: [dataUrl, "image.jpg"],
    });

    console.log("Upload script execution result:", results);
  } catch (error) {
    console.error("Error in reverseImageSearchGoogleLensLocal:", error);
    // Show error to user
    alert(
      `Failed to upload image to Google Lens: ${error.message}\nCheck browser console for details.`,
    );
  }
};

/**
 * Content script function that runs in the Google page context
 * This function is injected and executed in the target page
 * Based on search-by-images extension implementation
 */
async function uploadToGoogleLens(imageDataUrl, filename) {
  console.log("[Google Lens Upload] Starting upload process...");

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        // Helper function to wait
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

        // Helper to find DOM elements with retry logic
        const findNode = async (
          selector,
          { selectorType = "css", timeout = 10000 } = {},
        ) => {
          console.log(
            `[Google Lens Upload] Looking for element: ${selector} (type: ${selectorType})`,
          );
          const startTime = Date.now();

          return new Promise((resolve, reject) => {
            const check = () => {
              let element;

              if (selectorType === "xpath") {
                const result = document.evaluate(
                  selector,
                  document,
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null,
                );
                element = result.singleNodeValue;
              } else {
                element = document.querySelector(selector);
              }

              if (element) {
                console.log(
                  `[Google Lens Upload] Found element: ${selector}`,
                  element,
                );
                resolve(element);
              } else if (Date.now() - startTime > timeout) {
                console.error(
                  `[Google Lens Upload] Timeout finding element: ${selector}`,
                );
                // Log available elements for debugging
                console.log(
                  "[Google Lens Upload] Available divs with data attributes:",
                  document.querySelectorAll("div[data-*]"),
                );
                console.log(
                  "[Google Lens Upload] Available buttons:",
                  document.querySelectorAll("button"),
                );
                console.log(
                  "[Google Lens Upload] Available file inputs:",
                  document.querySelectorAll('input[type="file"]'),
                );
                reject(new Error(`Element not found: ${selector}`));
              } else {
                setTimeout(check, 100);
              }
            };
            check();
          });
        };

        // Process node with callback (like search-by-images processNode)
        const processNode = async (selector, callback, options = {}) => {
          try {
            const node = await findNode(selector, options);
            if (node) {
              await callback(node);
            }
          } catch (error) {
            if (options.throwError !== false) {
              throw error;
            }
          }
        };

        // Main upload flow - matches search-by-images approach
        const inputSelector = 'input[type="file"]';

        console.log("[Google Lens Upload] Page loaded, searching for elements");
        console.log("[Google Lens Upload] Current URL:", window.location.href);
        console.log("[Google Lens Upload] Page title:", document.title);

        // DEBUG: Log all potential Lens-related elements
        console.log("[Google Lens Upload] === DIAGNOSTIC INFO ===");
        console.log(
          "[Google Lens Upload] All divs with 'lens' in data attributes:",
        );
        const lensElements = Array.from(
          document.querySelectorAll("div[data-*]"),
        ).filter((el) => {
          return Array.from(el.attributes).some(
            (attr) => attr.name.includes("lens") || attr.value.includes("lens"),
          );
        });
        console.log(lensElements);

        console.log("[Google Lens Upload] All buttons on page:");
        const buttons = Array.from(document.querySelectorAll("button"));
        buttons.forEach((btn, i) => {
          console.log(
            `Button ${i}:`,
            btn.getAttribute("aria-label"),
            btn.textContent,
            btn,
          );
        });

        console.log("[Google Lens Upload] All file inputs:");
        console.log(document.querySelectorAll('input[type="file"]'));

        console.log("[Google Lens Upload] Search bar area:");
        console.log(document.querySelectorAll('form[role="search"]'));
        console.log(document.querySelectorAll("textarea[name]"));

        console.log("[Google Lens Upload] All SVG/icons that might be Lens:");
        const svgs = Array.from(document.querySelectorAll("svg")).filter(
          (svg) =>
            svg.innerHTML.includes("lens") ||
            svg.parentElement?.getAttribute("aria-label")?.includes("lens"),
        );
        console.log(svgs);
        console.log("[Google Lens Upload] === END DIAGNOSTIC ===");

        // Function to click the Lens button
        const clickButton = async () => {
          console.log(
            "[Google Lens Upload] Attempting to click Lens button...",
          );
          await processNode("div[data-base-lens-url]", async function (node) {
            console.log(
              "[Google Lens Upload] Found Lens button, waiting 1s...",
            );
            await sleep(1000);

            if (!document.querySelector(inputSelector)) {
              console.log("[Google Lens Upload] Clicking Lens button...");
              node.click();
            } else {
              console.log(
                "[Google Lens Upload] File input already visible, skipping click",
              );
            }
          });
        };

        // Handle consent popup - exact XPath from search-by-images
        console.log("[Google Lens Upload] Checking for consent popup...");
        processNode(
          `//div[@role="dialog"
            and contains(., "g.co/privacytools")
            and .//a[starts-with(@href, "https://policies.google.com/technologies/cookies")]
            and .//a[starts-with(@href, "https://policies.google.com/privacy")]
            and .//a[starts-with(@href, "https://policies.google.com/terms")]
          ]`,
          function (node) {
            if (node) {
              console.log(
                "[Google Lens Upload] Found consent popup, dismissing",
              );
              node.querySelectorAll("button")[2].click();
              clickButton();
            }
          },
          { throwError: false, selectorType: "xpath" },
        );

        // Click button to reveal file input
        await clickButton();

        console.log("[Google Lens Upload] Waiting for file input...");
        // Wait for file input
        const input = await findNode(inputSelector);

        console.log("[Google Lens Upload] Converting image to file...");
        // Convert data URL to blob
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        console.log("[Google Lens Upload] Blob created:", blob.size, "bytes");

        // Create File object
        const file = new File([blob], filename, {
          type: blob.type || "image/jpeg",
        });
        console.log("[Google Lens Upload] File created:", file.name, file.type);

        // Set file input data using DataTransfer API (setFileInputData approach)
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        console.log("[Google Lens Upload] File assigned to input");

        // Dispatch change event
        input.dispatchEvent(new Event("change", { bubbles: true }));
        console.log("[Google Lens Upload] Change event dispatched");

        // Wait a bit to let Google process the upload
        await sleep(500);

        console.log("[Google Lens Upload] Upload completed successfully!");
        resolve({ success: true });
      } catch (error) {
        console.error("[Google Lens Upload] Error:", error);
        console.error("[Google Lens Upload] Stack:", error.stack);
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
