import { v4 as uuidv4 } from "uuid";

import { uploadToCollection } from "../../utils/snaUtils";
import { uploadTemplates } from "./DataUploadConstants";
import {
  cleanDataUpload,
  handleZeeschuimerUpload,
} from "./DataUploadFunctions";

/**
 * Upload handler for CSV data that saves to IndexDB with collections
 * This is used for formats like CrowdTangle, Twitter CSV, TikTok CSV, etc.
 *
 * @param {Object} params
 * @param {string} params.socialMediaSelected - Selected social media type
 * @param {Array} params.uploadedData - Raw uploaded data
 * @param {string} params.uploadedFileName - Name of uploaded file
 * @param {string} params.selectedCollection - Selected collection name
 * @param {Function} params.setIsUploading - Function to set uploading state
 * @param {Function} params.setUploadModalError - Function to set error state
 * @param {Function} params.handleModalClose - Function to close modal
 * @param {Function} params.onUploadComplete - Callback after successful upload
 */
export const handleCSVUpload = async ({
  socialMediaSelected,
  uploadedData,
  uploadedFileName,
  selectedCollection,
  setIsUploading,
  setUploadModalError,
  handleModalClose,
  onUploadComplete,
}) => {
  try {
    // Get field mappings from templates
    let fieldLabelsMap =
      socialMediaSelected.length > 0 && socialMediaSelected !== "customUpload"
        ? uploadTemplates[socialMediaSelected].defaultFieldsMap
        : new Map();

    // Reformat entries based on field mappings
    let reformatedUploadEntries = uploadedData.map(
      ({
        [fieldLabelsMap.get("Share Time")]: date,
        [fieldLabelsMap.get("Entry ID")]: id,
        [fieldLabelsMap.get("User ID")]: uid,
        [fieldLabelsMap.get("Text")]: text,
        ...rest
      }) => ({
        date: date,
        username: uid,
        text: text,
        id: id,
        ...rest,
      }),
    );

    // Clean and validate data
    let entriesCleaned = cleanDataUpload(
      reformatedUploadEntries,
      socialMediaSelected,
      selectedCollection,
    );

    // Upload to IndexDB collection
    await uploadToCollection(
      entriesCleaned,
      socialMediaSelected,
      selectedCollection,
      onUploadComplete,
    );

    // Close modal on success
    handleModalClose();
  } catch (error) {
    console.error("Error uploading to collection:", error);
    setIsUploading(false);
    setUploadModalError(true);
  }
};

/**
 * Upload handler for NDJSON (Zeeschuimer) data that updates dataSources directly
 * This is used for Zeeschuimer Twitter and TikTok formats
 *
 * @param {Object} params
 * @param {string} params.socialMediaSelected - Selected social media type
 * @param {Array} params.uploadedData - Raw uploaded data
 * @param {string} params.uploadedFileName - Name of uploaded file
 * @param {Function} params.setIsUploading - Function to set uploading state
 * @param {Function} params.setUploadModalError - Function to set error state
 * @param {Function} params.handleModalClose - Function to close modal
 * @param {Array} params.dataSources - Current data sources
 * @param {Function} params.updateDataSources - Function to update data sources
 */
export const handleNDJSONUpload = async ({
  socialMediaSelected,
  uploadedData,
  uploadedFileName,
  setIsUploading,
  setUploadModalError,
  handleModalClose,
  dataSources,
  updateDataSources,
}) => {
  try {
    // Transform NDJSON data based on social media type
    const reformatedData = handleZeeschuimerUpload(
      uploadedData,
      uploadedFileName,
      socialMediaSelected,
    );

    // Create new data source entry
    const newDataSource = {
      id: "fileUpload~" + uuidv4(),
      name: uploadedFileName,
      length: reformatedData.length,
      content: reformatedData,
      headers: Object.keys(reformatedData[0]),
      accountNameMap: new Map(),
      source: "fileUpload",
    };

    // Update data sources
    const updatedDataSources = [...dataSources, newDataSource];
    updateDataSources(updatedDataSources);

    // Close modal on success
    handleModalClose();
  } catch (error) {
    console.error("Error uploading NDJSON data:", error);
    setIsUploading(false);
    setUploadModalError(true);
  }
};

/**
 * Factory function to create upload configurations for different formats
 * This demonstrates the template pattern - different configurations
 * can be easily created for new upload types
 */
export const createUploadConfig = {
  /**
   * Configuration for CSV uploads (CrowdTangle, Twitter, TikTok CSVs)
   */
  csv: (templates, onUploadComplete) => ({
    templates,
    uploadHandler: handleCSVUpload,
    requiresCollection: true,
    additionalProps: {
      onUploadComplete,
    },
  }),

  /**
   * Configuration for NDJSON uploads (Zeeschuimer)
   */
  ndjson: (templates, dataSources, updateDataSources) => ({
    templates,
    uploadHandler: handleNDJSONUpload,
    requiresCollection: false,
    additionalProps: {
      dataSources,
      updateDataSources,
    },
  }),
};
