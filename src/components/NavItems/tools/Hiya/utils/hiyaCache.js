const DB_NAME = "hiya-audio-cache";
const STORE_NAME = "results";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function hashFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return "file:" + hex;
}

export function urlCacheKey(url) {
  return "url:" + url;
}

export async function getCachedResult(key) {
  let db;
  try {
    db = await openDB();
  } catch {
    return null;
  }

  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => {
      const entry = request.result;
      if (!entry) return resolve(null);
      if (Date.now() - entry.timestamp > TTL_MS) {
        deleteEntry(key);
        return resolve(null);
      }
      resolve(entry);
    };
    request.onerror = () => resolve(null);
  });
}

export async function setCachedResult(key, type, data) {
  let db;
  try {
    db = await openDB();
  } catch {
    return;
  }

  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put({ type, data, timestamp: Date.now() }, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

async function deleteEntry(key) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(key);
  } catch {}
}
