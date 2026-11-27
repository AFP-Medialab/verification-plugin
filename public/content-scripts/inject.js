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
  const NOTE_DATA_KEYS = [
    'birdwatch_note_by_rest_id',
    'birdwatch_profile_by_alias',
    'community_boost_pivot_by_rest_id',
    'authenticated_birdwatch_match',
  ];

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
        // Check if response has content
        if (!this.responseText || this.responseText.trim() === '') {
          return;
        }

        try {
          // Parse response
          const twitterData = JSON.parse(this.responseText);

          // Check if response contains data (Twitter GraphQL responses always have a 'data' field)
          if (twitterData && twitterData.data) {
            const dataKeys = Object.keys(twitterData.data);
            const raw = this.responseText;

            // GraphQL operation name only (the query string may contain "birdwatch" in feature flags)
            let operationPath = '';
            try {
              operationPath = new URL(String(this._url), window.location.href).pathname;
            } catch {
              operationPath = '';
            }

            // Responses carrying Community Notes: BirdwatchFetchNotes
            // (tweet_result_by_rest_id.result.misleading_birdwatch_notes), single note, listings
            const isCommunityNotePayload =
              NOTE_DATA_KEYS.some((key) => dataKeys.includes(key)) ||
              operationPath.includes('Birdwatch') ||
              raw.includes('"misleading_birdwatch_notes"');

            // Single tweet response (TweetResultByRestId)
            const isSingleTweet =
              !isCommunityNotePayload &&
              (dataKeys.includes('tweetResult') || dataKeys.includes('tweet_result_by_rest_id'));

            // Any feed or conversation made of timeline items holding tweets
            // (home, search, profile, lists, bookmarks, tweet page...)
            const isTimeline =
              !isCommunityNotePayload &&
              !isSingleTweet &&
              raw.includes('"tweet_results"');

            if (isCommunityNotePayload) {
              sendToExtension({ data: twitterData.data, _snaRecorderType: 'communityNote' });
            } else if (isSingleTweet) {
              sendToExtension({ data: twitterData.data, _snaRecorderType: 'singleTweet' });
            } else if (isTimeline) {
              sendToExtension({ data: twitterData.data, _snaRecorderType: 'timeline' });
            }
          }
        } catch (error) {
          console.error('SNA Recorder: Error parsing Twitter response:', error);
        }
      }
    });
    return send.apply(this, arguments);
  };

})();
