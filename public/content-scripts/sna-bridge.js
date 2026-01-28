/**
 * SNA Content Script Bridge
 * This script runs in the content script context and acts as a bridge between
 * the page context (inject.js) and the extension background script.
 *
 * Architecture:
 * Page Context (inject.js) → window.postMessage → Content Script (this file) → browser.runtime.sendMessage → Background Script
 */

(function() {
  'use strict';

  // Browser API compatibility
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

  // Listen for messages from the page context (inject.js)
  window.addEventListener('message', function(event) {
    // Only accept messages from the same window
    if (event.source !== window) {
      return;
    }

    // Check if this is an SNA recorder message
    if (event.data && event.data.source === 'sna-recorder') {
      const { type, payload } = event.data;

      if (type === 'SEND_TO_EXTENSION') {
        // Forward the message to the background script
        browserAPI.runtime.sendMessage(payload).catch(error => {
          console.error('SNA Bridge: Error sending message to background:', error);
        });
      }
    }
  }, false);

  console.log('SNA Content Script Bridge initialized');
})();
