# SNA Recording HOW TO

This guide will help you debug why SNA recording is not working on X.com (Twitter) or TikTok.

## Step 1: Build the Extension

```bash
npm run build
```

Or for specific browsers:
```bash
npm run build:firefox:development
npm run build:chrome:development
```

## Step 2: Load Extension and Open DevTools

1. Load the extension in your browser
2. Open the extension popup
3. **Open THREE DevTools windows:**
   - **Background Script DevTools** (Service Worker)
     - Chrome: chrome://extensions → Click "service worker" link
     - Firefox: about:debugging → This Firefox → Inspect
   - **Web Page DevTools** (the Twitter/TikTok page)
     - Press F12 on the Twitter/TikTok page
   - **Extension Popup DevTools** (optional, for UI debugging)
     - Right-click popup → Inspect

## Step 3: Start Recording

1. In the extension popup, go to Settings (Parameters panel)
2. Configure SNA recording:
   - Select platform (Twitter and/or TikTok)
   - Select or create a collection
   - Click "Start Recording"

### Expected Console Output (Background):

```
[Background] Received message: {prompt: "startRecording", currentCollectionName: "...", platforms: [...]}
[Background] Handling as SNA message
```

## Step 4: Navigate to Platform

### For Twitter (X.com):
1. Go to https://x.com
2. Scroll through your timeline

### For TikTok:
1. Go to https://www.tiktok.com
2. Scroll through videos

### Expected Console Output Sequence:

#### In Background DevTools:
```
[SNA Handler] Injecting scripts for tab: <tab_id>
[SNA Handler] Bridge script injected
[SNA Handler] Page script injected
```

#### In Web Page DevTools:
```
[SNA Bridge] Content Script Bridge initialized
[SNA Inject] Page Context Script initialized
```

When you scroll and data is captured:

#### In Web Page DevTools:
```
[SNA Inject] TikTok data intercepted: {...}
[SNA Inject] Sending message via postMessage: {...}
[SNA Bridge] Received message from page context: {...}
[SNA Bridge] Forwarding to background script: {...}
```

#### In Background DevTools:
```
[Background] Received message: {prompt: "tiktokCapture", content: {...}}
[Background] Detected recording message, handling...
[SNA Handler] handleRecordedMessage called with: {...}
[SNA Handler] Current recording session: [{id: "main", state: "Collection Name", platforms: "TikTok"}]
[SNA Handler] Active session: Collection Name
[SNA Handler] Processing TikTok capture
```

## Common Issues & Solutions

### Issue 1: Scripts Not Injecting
**Symptom:** No `[SNA Bridge]` or `[SNA Inject]` messages in Web Page DevTools

**Solutions:**
- Check that recording is actually started (look for "Stop Recording" button)
- Navigate to a new page or refresh after starting recording
- Check `web_accessible_resources` in manifest includes both scripts
- Verify files exist in build folder: `build/*/content-scripts/`

### Issue 2: Bridge Not Receiving Messages
**Symptom:** `[SNA Inject]` messages appear but no `[SNA Bridge]` messages

**Solutions:**
- Check Content Security Policy on the page (some sites block postMessage)
- Verify bridge is injected before page script
- Check for any errors in Web Page DevTools

### Issue 3: Background Not Receiving Messages
**Symptom:** `[SNA Bridge]` shows "Forwarding to background" but Background shows no message

**Solutions:**
- Check if background service worker is still active (not suspended)
- Look for permission errors in Background DevTools
- Verify `browser.runtime.sendMessage` is working (try a test message)

### Issue 4: Recording State is False
**Symptom:** `[SNA Handler] Recording is not active, skipping`

**Solutions:**
- Check recording session in IndexedDB:
  - Open Application/Storage tab in Background DevTools
  - IndexedDB → snaData → recording
  - Verify `state` is not `false`
- Try stopping and starting recording again
- Check for errors when starting recording

### Issue 5: No Data Being Intercepted
**Symptom:** Scripts load but no `[SNA Inject] ... intercepted` messages

**Solutions:**
- For TikTok: Make sure you're scrolling through videos (triggers API calls)
- For Twitter: Scroll through timeline or search results
- Check if API endpoints changed (Twitter frequently changes GraphQL endpoints)
- Verify URL patterns match in inject.js:
  - TikTok: `api/recommend`, `api/post`, `api/repost`, etc.
  - Twitter: `graphql` with `data` in response

## Manual Testing Commands

### Check Recording State
In Background DevTools Console:
```javascript
// Check IndexedDB directly
const request = indexedDB.open('snaData', 1);
request.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction('recording', 'readonly');
  const store = tx.objectStore('recording');
  const req = store.getAll();
  req.onsuccess = () => console.log('Recording state:', req.result);
};
```

### Test Message Passing
In Web Page DevTools Console:
```javascript
// Test postMessage
window.postMessage({
  source: 'sna-recorder',
  type: 'SEND_TO_EXTENSION',
  payload: { prompt: 'test', data: 'hello' }
}, '*');
```

You should see the message flow through bridge to background.

## Expected Data Flow

```
User Action (Scroll)
    ↓
Platform API Call (fetch/XHR)
    ↓
inject.js Intercepts
    ↓
window.postMessage
    ↓
sna-bridge.js Receives
    ↓
browser.runtime.sendMessage
    ↓
Background Script
    ↓
handleRecordedMessage
    ↓
IndexedDB Storage
```

## Success Indicators

✅ All console logs appear in correct sequence
✅ No errors in any DevTools console
✅ Data appears in IndexedDB (check in Background DevTools → Application → IndexedDB → snaData → tweets/tiktoks)
✅ Collection count increases in SNA UI
✅ Can export/view collected data

## Still Not Working?

If you've followed all steps and it's still not working, collect the following info:

1. Browser version and type (Firefox/Chrome)
2. Platform (Twitter/TikTok)
3. All console outputs from all three DevTools
4. Any errors shown
5. Screenshot of recording state in Settings panel
6. IndexedDB screenshot showing recording state

Share this information for further debugging.
