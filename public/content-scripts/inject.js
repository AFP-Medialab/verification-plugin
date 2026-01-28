(function () {
  /**
   * SNA Page Context Script
   * This script runs in the page context to intercept fetch/XHR requests.
   * It uses window.postMessage to communicate with the content script bridge,
   * which then forwards messages to the extension background script.
   */

  /**
   * Send message to extension via content script bridge
   * @param {Object} data - Message data to send
   */
  const sendToExtension = (data) => {
    window.postMessage({
      source: 'sna-recorder',
      type: 'SEND_TO_EXTENSION',
      payload: data
    }, '*');
  };

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

      try {
        let json = await clone.json();
        sendToExtension({
          prompt: "tiktokCapture",
          content: json,
        });
      } catch (error) {
        console.error('SNA Recorder: Error parsing TikTok response:', error);
      }
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
      // Check if this is a Twitter/X GraphQL request
      if (this._url && this._url.includes("graphql")) {
        try {
          // Parse response
          const twitterData = JSON.parse(this.responseText);

          // Check if response contains data (Twitter GraphQL responses always have a 'data' field)
          if (twitterData && twitterData.data) {
            sendToExtension(twitterData);
          }
        } catch (error) {
          console.error('SNA Recorder: Error parsing Twitter response:', error);
        }
      }
    });
    return send.apply(this, arguments);
  };

})();
