/**
 * Wrapper function to open a new tab from the context menus or from the app
 * @param url The url object
 * @param {boolean} isRequestFromContextMenu
 */
export const openNewTabWithUrl = async (url, isRequestFromContextMenu) => {
  if (isRequestFromContextMenu) openTabsSearch(url);
  else await chrome.tabs.create(url);
};

export const openTabs = (url) => {
  chrome.tabs.create(url, (createdTab) => {
    chrome.tabs.onUpdated.addListener(async function _(tabId) {
      if (tabId === createdTab.id) {
        chrome.tabs.onUpdated.removeListener(_);
      } else {
        await chrome.tabs.get(tabId, async () => {
          if (!chrome.runtime.lastError) {
            //console.log("tab exist ", tabId)
            await chrome.tabs.remove(tabId, () => {
              if (!chrome.runtime.lastError) {
                //nothing todo
              }
              //chrome.tabs.onUpdated.removeListener(_);
            });
          }
        });
      }
    });
  });
};

const openTabsSearch = (url) => {
  chrome.tabs.create(url, (createdTab) => {
    chrome.tabs.onUpdated.addListener(async function _(tabId, info, tab) {
      let pending_url = ns(createdTab.pendingUrl);
      let tab_url = ns(tab.url);
      if (tabId === createdTab.id && pending_url === tab_url) {
        //console.log("remove .... listerner", tabId);
        chrome.tabs.onUpdated.removeListener(_);
      } else {
        if (pending_url === tab_url) {
          //console.log("remove id ", tabId);
          await chrome.tabs.get(tabId, async () => {
            if (!chrome.runtime.lastError) {
              //console.log("tab exist ", tabId)
              await chrome.tabs.remove(tabId, async () => {
                //nothing todo
                if (!chrome.runtime.lastError) {
                  //nothing todo
                }
              });
            } else {
              //nothing todo
            }
          });
        }
      }
    });
  });
};

function ns(url) {
  if (!url || typeof url !== "string") return;
  return new URL(url).hostname.replace("www.", "");
}
