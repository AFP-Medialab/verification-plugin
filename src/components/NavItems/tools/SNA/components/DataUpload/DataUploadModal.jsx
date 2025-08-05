import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { v4 as uuidv4 } from "uuid";

import {
  dataUploadModalStyle,
  required_fields,
  uploadTemplates,
} from "./DataUploadConstants";
import { cleanDataUpload, getAccountNameMap } from "./DataUploadFunctions";

/**
 * Map from COOR required field name
 * (entry id, user id, share time, object* id
 * to header name in uploaded dataset
 *
 *  *Objects: items potentially shared in coordination (e.g. link url, hashtag...)
 */
const requiredFieldsLabels = new Map();

/**
 *
 * @param {string} socialMediaId
 * @param {img|SvgIcon} socialMediaIcon
 * @param {string useState} socialMediaSelected
 * @param {string useState} setSocialMediaSelected
 * @returns
 */
export const socialMediaIconBox = (
  socialMediaId,
  socialMediaIcon,
  socialMediaSelected,
  setSocialMediaSelected,
  tooltipText,
) => {
  const toggleSocialMediaSelection = () => {
    socialMediaSelected === socialMediaId
      ? setSocialMediaSelected("")
      : setSocialMediaSelected(socialMediaId);
  };

  return (
    <Tooltip key={socialMediaId + "_toolTip"} title={tooltipText}>
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
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        {socialMediaIcon}
      </Box>
    </Tooltip>
  );
};

const customUploadField = (k, uploadedData) => {
  const keys = Object.keys(uploadedData[0]);
  return (
    <FormControl key={k + "uploadField"} fullWidth>
      <InputLabel>{k}</InputLabel>
      <Select
        onChange={(e) => {
          requiredFieldsLabels.set(k, e.target.value);
        }}
        value={keys[0]}
      >
        {Object.keys(uploadedData[0]).map((x) => (
          <MenuItem key={x} value={x}>
            {x}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const customUploadSection = ({
  setCustomExpanded,
  customExpanded,
  keyword,
  uploadedData,
  setSocialMediaSelected,
}) => {
  const handleCustomToggle = () => {
    setCustomExpanded((prev) => !prev);
    setSocialMediaSelected("customUpload");
  };

  return (
    <>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">
            {keyword("uploadModal_customTitle")}
          </Typography>
          <IconButton
            onClick={handleCustomToggle}
            size="small"
            sx={{ padding: 1.5 }}
          >
            {customExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={customExpanded}>
        <Box
          key="customUploadSection"
          display="flex"
          flexDirection="column"
          gap={2}
          mt={2}
        >
          {uploadedData.length > 0 ? (
            required_fields.map((k) => customUploadField(k, uploadedData))
          ) : (
            <></>
          )}
        </Box>
      </Collapse>
    </>
  );
};

const DataUploadModal = ({
  dataSources,
  showUploadModal,
  setUploadedData,
  setShowUploadModal,
  keyword,
  socialMediaSelected,
  setSocialMediaSelected,
  setCustomExpanded,
  customExpanded,
  uploadedData,
  uploadedFileName,
  setUploadedFileName,
  uploadModalError,
  setUploadModalError,
}) => {
  let customUploadSectionProps = {
    setCustomExpanded,
    customExpanded,
    uploadedData,
    keyword,
    setSocialMediaSelected,
  };

  const handleModalClose = () => {
    setUploadModalError(false);
    setSocialMediaSelected("");
    setUploadedData([]);
    setUploadedFileName("");
    setShowUploadModal(false);
  };

  const addUploadToDataSources = (
    dataSources,
    socialMediaSelected,
    uploadedData,
    uploadFilename,
  ) => {
    let fieldLabelsMap =
      socialMediaSelected.length > 0 && socialMediaSelected != "customUpload"
        ? uploadTemplates[socialMediaSelected].defaultFieldsMap
        : requiredFieldsLabels;

    let reformatedUploadEntries = uploadedData.map(
      ({
        [fieldLabelsMap.get("Object")]: objects,
        [fieldLabelsMap.get("Share Time")]: date,
        [fieldLabelsMap.get("Entry ID")]: id,
        [fieldLabelsMap.get("User ID")]: uid,
        [fieldLabelsMap.get("Text")]: text,
        ...rest
      }) => ({
        objects: objects,
        [fieldLabelsMap.get("Object")]: objects,
        date: date,
        username: uid,
        text: text,
        id: id,
        ...rest,
      }),
    );

    let entriesCleaned = cleanDataUpload(
      reformatedUploadEntries,
      socialMediaSelected,
    );
    let accountNameMap = getAccountNameMap(
      reformatedUploadEntries,
      socialMediaSelected,
    );

    dataSources.push({
      id: "fileUpload~" + uuidv4(),
      name: uploadFilename,
      length: entriesCleaned.length,
      content: entriesCleaned,
      headers: Object.keys(entriesCleaned[0]),
      accountNameMap: accountNameMap,
      source: "fileUpload",
    });
    handleModalClose();
  };

  return (
    <>
      <Modal open={showUploadModal} onClose={handleModalClose}>
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
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Stack direction={"row"} spacing={2} alignItems="center">
              {Object.values(uploadTemplates).map((template) =>
                socialMediaIconBox(
                  template.id,
                  template.icon,
                  socialMediaSelected,
                  setSocialMediaSelected,
                  keyword(template.tooltipText),
                ),
              )}
            </Stack>
            {customUploadSection(customUploadSectionProps)}
            <Button
              variant="outlined"
              onClick={() => {
                setUploadModalError(false);
                try {
                  addUploadToDataSources(
                    dataSources,
                    socialMediaSelected,
                    uploadedData,
                    uploadedFileName,
                  );
                } catch {
                  setUploadModalError(true);
                }
              }}
            >
              {keyword("uploadModal_ConfirmButton")}
            </Button>

            {uploadModalError ? (
              <Typography align="left" color="error">
                {keyword("dataupload_error")}
              </Typography>
            ) : (
              <></>
            )}
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default DataUploadModal;
