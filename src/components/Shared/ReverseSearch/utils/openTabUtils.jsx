/**
 * Wrapper function to open a new tab from the context menus or from the app
 * @param url The url object
 * @param {boolean} isRequestFromContextMenu
 */
export const openNewTabWithUrl = async (url, isRequestFromContextMenu) => {
  if (isRequestFromContextMenu) openTabsSearch(url);
  else await browser.tabs.create(url);
};

export const openTabs = (url) => {
  browser.tabs.create(url, (createdTab) => {
    browser.tabs.onUpdated.addListener(async function _(tabId) {
      if (tabId === createdTab.id) {
        browser.tabs.onUpdated.removeListener(_);
      } else {
        await browser.tabs.get(tabId, async () => {
          if (!browser.runtime.lastError) {
            //console.log("tab exist ", tabId)
            await browser.tabs.remove(tabId, () => {
              if (!browser.runtime.lastError) {
                //nothing todo
              }
              //browser.tabs.onUpdated.removeListener(_);
            });
          }
        });
      }
    });
  });
};

const openTabsSearch = (url) => {
  browser.tabs.create(url, (createdTab) => {
    browser.tabs.onUpdated.addListener(async function _(tabId, info, tab) {
      let pending_url = ns(createdTab.pendingUrl);
      let tab_url = ns(tab.url);
      if (tabId === createdTab.id && pending_url === tab_url) {
        //console.log("remove .... listerner", tabId);
        browser.tabs.onUpdated.removeListener(_);
      } else {
        if (pending_url === tab_url) {
          //console.log("remove id ", tabId);
          await browser.tabs.get(tabId, async () => {
            if (!browser.runtime.lastError) {
              //console.log("tab exist ", tabId)
              await browser.tabs.remove(tabId, async () => {
                //nothing todo
                if (!browser.runtime.lastError) {
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
