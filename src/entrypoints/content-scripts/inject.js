(function (xhr) {
  let pluginId = document.currentScript.dataset.params;

  //TIKTOK Capture
  let originalFetch = window.fetch;
  window.fetch = async (...args) => {
    let ogResponse = await originalFetch(...args);
    if (
      ogResponse &&
      ogResponse.url &&
      (ogResponse.url.includes("api/recommend") ||
        ogResponse.url.includes("api/post") ||
        ogResponse.url.includes("api/repost") ||
        ogResponse.url.includes("api/search/general/full") ||
        ogResponse.url.includes("api/explore/item_list"))
    ) {
      let clone = ogResponse.clone();

      let json = await clone.json();
      chrome.runtime.sendMessage(pluginId, {
        prompt: "tiktokCapture",
        content: json,
      });
    }
    return ogResponse;
  };

  //TWITTER Capture

  let XHR = XMLHttpRequest.prototype;
  let open = XHR.open;
  let send = XHR.send;
  let setRequestHeader = XHR.setRequestHeader;

  XHR.open = function (method, url) {
    this._method = method;
    this._url = url;
    this._requestHeaders = {};
    this._startTime = new Date().toISOString();

    return open.apply(this, arguments);
  };

  XHR.setRequestHeader = function (header, value) {
    this._requestHeaders[header] = value;
    return setRequestHeader.apply(this, arguments);
  };

  XHR.send = function () {
    this.addEventListener("load", function () {
      if (
        this._url.includes("graphql") &&
        this.response.slice(0, 10).includes("data")
      ) {
        chrome.runtime.sendMessage(pluginId, JSON.parse(this.responseText));
      }
    });
    return send.apply(this, arguments);
  };
})(XMLHttpRequest);
