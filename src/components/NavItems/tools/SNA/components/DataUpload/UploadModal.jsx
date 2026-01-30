import React, { useCallback, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { handleAddCollection } from "../../utils/snaUtils";
import { CollectionSelect } from "../CollectionSelect";
import { getRecordingInfo } from "../Recording";
import { dataUploadModalStyle } from "./DataUploadConstants";

/**
 * Social media icon box component for template selection
 */
export const SocialMediaIconBox = ({
  socialMediaId,
  socialMediaIcon,
  socialMediaSelected,
  setSocialMediaSelected,
  tooltipText,
  disabled,
}) => {
  const toggleSocialMediaSelection = () => {
    if (disabled) return;
    socialMediaSelected === socialMediaId
      ? setSocialMediaSelected("")
      : setSocialMediaSelected(socialMediaId);
  };

  return (
    <Tooltip key={socialMediaId + "_toolTip"} title={tooltipText || ""}>
      <Box
        key={socialMediaId + "_ModalIconBox"}
        onClick={toggleSocialMediaSelection}
        sx={{
          width: 50,
          height: 50,
          borderRadius: 2,
          border:
            socialMediaId === socialMediaSelected
              ? "2px solid blue"
              : "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.5 : 1,
          "&:hover": !disabled && {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        {socialMediaIcon}
      </Box>
    </Tooltip>
  );
};

/**
 * Unified upload modal component that handles different upload types
 * using a template pattern for easy customization.
 *
 * Template Pattern Implementation:
 * - uploadConfig.templates: Define available upload templates (icons, ids, tooltips)
 * - uploadConfig.uploadHandler: Custom upload logic for each type
 * - uploadConfig.requiresCollection: Whether collection selection is needed
 *
 * @param {Object} props
 * @param {boolean} props.showModal - Controls modal visibility
 * @param {Function} props.setShowModal - Function to set modal visibility
 * @param {Function} props.setUploadedData - Function to set uploaded data
 * @param {Function} props.setUploadedFileName - Function to set uploaded filename
 * @param {Function} props.setSocialMediaSelected - Function to set selected social media
 * @param {Function} props.setUploadModalError - Function to set error state
 * @param {Function} props.keyword - Translation function
 * @param {string} props.socialMediaSelected - Currently selected social media
 * @param {Array} props.uploadedData - The uploaded data
 * @param {string} props.uploadedFileName - The uploaded filename
 * @param {boolean} props.uploadModalError - Error state
 * @param {Object} props.uploadConfig - Configuration object for upload behavior
 * @param {Array} props.uploadConfig.templates - Array of upload templates to display
 * @param {Function} props.uploadConfig.uploadHandler - Function that handles the upload
 * @param {boolean} props.uploadConfig.requiresCollection - Whether collection selection is required
 * @param {Object} props.uploadConfig.additionalProps - Additional props to pass to uploadHandler
 */
const UploadModal = ({
  showModal,
  setShowModal,
  setUploadedData,
  setUploadedFileName,
  setSocialMediaSelected,
  setUploadModalError,
  keyword,
  socialMediaSelected,
  uploadedData,
  uploadedFileName,
  uploadModalError,
  uploadConfig,
}) => {
  const [collections, setCollections] = useState(["Default Collection"]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const {
    templates,
    uploadHandler,
    requiresCollection = false,
    additionalProps = {},
  } = uploadConfig;

  const handleAddCollectionClick = useCallback(() => {
    handleAddCollection(
      newCollectionName,
      setCollections,
      setSelectedCollection,
      setNewCollectionName,
    );
  }, [newCollectionName]);

  const handleModalClose = async () => {
    if (isUploading) return;
    setUploadModalError(false);
    setSocialMediaSelected("");
    setUploadedData([]);
    setUploadedFileName("");
    setSelectedCollection("");
    setIsUploading(false);
    setShowModal(false);
  };

  const handleUpload = async () => {
    setUploadModalError(false);
    setIsUploading(true);

    try {
      await uploadHandler({
        socialMediaSelected,
        uploadedData,
        uploadedFileName,
        selectedCollection,
        setIsUploading,
        setUploadModalError,
        handleModalClose,
        ...additionalProps,
      });
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadModalError(true);
    }
  };

  // Load collections if required
  useEffect(() => {
    if (requiresCollection) {
      getRecordingInfo(setCollections);
    }
  }, [requiresCollection]);

  // Determine if confirm button should be disabled
  const isConfirmDisabled =
    !socialMediaSelected ||
    socialMediaSelected.trim() === "" ||
    (requiresCollection &&
      (!selectedCollection || selectedCollection.trim() === ""));

  return (
    <Modal
      open={showModal}
      onClose={isUploading ? undefined : handleModalClose}
    >
      <Box gap={2} sx={dataUploadModalStyle}>
        <Stack direction={"column"} spacing={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {keyword("uploadModal_modalTitle")}
            </Typography>
            <IconButton
              onClick={handleModalClose}
              size="small"
              sx={{ padding: 1.5 }}
              disabled={isUploading}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Stack direction={"row"} spacing={2} alignItems="center">
            {Object.values(templates).map((template) => (
              <SocialMediaIconBox
                key={template.id + "_upload"}
                socialMediaId={template.id}
                socialMediaIcon={template.icon}
                socialMediaSelected={socialMediaSelected}
                setSocialMediaSelected={setSocialMediaSelected}
                tooltipText={keyword(template.tooltipText)}
                disabled={isUploading}
              />
            ))}
          </Stack>

          {requiresCollection && (
            <CollectionSelect
              keyword={keyword}
              selectedCollection={selectedCollection}
              setSelectedCollection={setSelectedCollection}
              collections={collections}
              newCollectionName={newCollectionName}
              setNewCollectionName={setNewCollectionName}
              onAddCollection={handleAddCollectionClick}
              disabled={isUploading}
            />
          )}

          {isUploading ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={2}
              py={2}
            >
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary">
                {keyword("uploadModal_uploading") || "Uploading data..."}
              </Typography>
            </Box>
          ) : (
            <Button
              variant="outlined"
              onClick={handleUpload}
              disabled={isConfirmDisabled}
            >
              {keyword("uploadModal_ConfirmButton")}
            </Button>
          )}

          {uploadModalError && (
            <Typography align="left" color="error">
              {keyword("dataupload_error")}
            </Typography>
          )}
        </Stack>
      </Box>
    </Modal>
  );
};

export default UploadModal;
