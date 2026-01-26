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
        chrome.runtime.sendMessage({
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
 * Get recording information from chrome runtime
 * Fetches collections and recording state
 *
 * @param {Function} setCollections - State setter for collections array
 * @param {Function} [setRecording] - Optional state setter for recording status
 * @param {Function} [setSelectedCollection] - Optional state setter for selected collection
 * @returns {Promise<void>}
 */
export const getRecordingInfo = async (
  setCollections,
  setRecording = null,
  setSelectedCollection = null,
) => {
  try {
    let recInfo = await chrome.runtime.sendMessage({
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
    }
  } catch (error) {
    console.error("Error getting recording info:", error);
  }
};
