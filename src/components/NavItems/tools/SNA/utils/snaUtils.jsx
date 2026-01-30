/**
 * SNA (Social Network Analysis) utility functions
 * Reusable functions for managing collections and recording state
 */

/**
 * Add a new collection to the collections list
 *
 * @param {string} newCollectionName - Name of the new collection to add
 * @param {Function} setCollections - State setter for collections array
 * @param {Function} setSelectedCollection - State setter for selected collection
 * @param {Function} setNewCollectionName - State setter to clear input field
 * @returns {void}
 */
export const handleAddCollection = (
  newCollectionName,
  setCollections,
  setSelectedCollection,
  setNewCollectionName,
) => {
  if (newCollectionName.trim()) {
    // Use functional state update to avoid depending on collections array
    setCollections((prevCollections) => {
      if (!prevCollections.includes(newCollectionName)) {
        browser.runtime.sendMessage({
          prompt: "addCollection",
          newCollectionName: newCollectionName,
        });
        setSelectedCollection(newCollectionName);
        setNewCollectionName("");
        return [...prevCollections, newCollectionName];
      }
      return prevCollections;
    });
  }
};

/**
 * Upload data to a collection
 * Sends data to the background script and optionally triggers a refresh callback
 *
 * @param {Array} data - Array of data items to upload
 * @param {string} platform - Platform name (e.g., "twitter", "tiktok", "fb")
 * @param {string} collectionId - ID of the collection to add data to
 * @param {Function} [onUploadComplete] - Optional callback to execute after successful upload
 * @returns {Promise<void>}
 * @throws {Error} If the upload fails
 */
export const uploadToCollection = async (
  data,
  platform,
  collectionId,
  onUploadComplete = null,
) => {
  await browser.runtime.sendMessage({
    prompt: "addToCollection",
    data: data,
    platform: platform,
    collectionId: collectionId,
  });

  // Trigger refresh to show the newly uploaded collection
  if (onUploadComplete) {
    await onUploadComplete();
  }
};

/**
 * Get recording information from chrome runtime
 * Fetches collections and recording state
 *
 * @param {Function} setCollections - State setter for collections array
 * @param {Function} [setRecording] - Optional state setter for recording status
 * @param {Function} [setSelectedCollection] - Optional state setter for selected collection
 * @param {Function} [setSelectedSocialMedia] - Optional state setter for selected social media platforms
 * @returns {Promise<void>}
 */
export const getRecordingInfo = async (
  setCollections,
  setRecording = null,
  setSelectedCollection = null,
  setSelectedSocialMedia = null,
) => {
  try {
    let recInfo = await browser.runtime.sendMessage({
      prompt: "getRecordingInfo",
    });

    if (recInfo && recInfo.collections && recInfo.recording) {
      // Use stable comparison to avoid unnecessary updates
      const newCollections = recInfo.collections.map((x) => x.id);
      setCollections((prevCollections) => {
        // Only update if the arrays are actually different
        if (
          JSON.stringify(prevCollections) !== JSON.stringify(newCollections)
        ) {
          return newCollections;
        }
        return prevCollections;
      });

      const isRecording = recInfo.recording[0]?.state !== false;
      if (setRecording) {
        setRecording((prevRecording) => {
          if (prevRecording !== isRecording) {
            return isRecording;
          }
          return prevRecording;
        });
      }

      if (isRecording && setSelectedCollection) {
        setSelectedCollection((prevSelected) => {
          const newSelected = recInfo.recording[0].state;
          if (prevSelected !== newSelected) {
            return newSelected;
          }
          return prevSelected;
        });
      }

      if (
        isRecording &&
        setSelectedSocialMedia &&
        recInfo.recording[0]?.platforms
      ) {
        const platforms = recInfo.recording[0].platforms
          .split(",")
          .filter((p) => p);
        setSelectedSocialMedia((prevPlatforms) => {
          if (JSON.stringify(prevPlatforms) !== JSON.stringify(platforms)) {
            return platforms;
          }
          return prevPlatforms;
        });
      }
    }
  } catch (error) {
    console.error("Error getting recording info:", error);
  }
};

/**
 *
 * @param {*} inputString
 * @returns {Array}
 */
export const universalTokenize = (inputString) => {
  // Regex Breakdown:
  // 1. (http?:\/\/[^\s]+)  -> Capture complete URLs (starting with http/https)
  // 2. | (\w+)              -> OR Capture words (alphanumeric)
  // 3. | ([^\w\s])          -> OR Capture punctuation/symbols (excluding whitespace)

  const regex = /(http?:\/\/[^\s]+)|(\w+)|([^\w\s])/g;

  // match() will return a simple array of all strings that matched ANY of the groups
  const tokens = inputString.match(regex);

  return tokens || [];
};
