import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { v4 as uuidv4 } from "uuid";

import {
  dataUploadModalStyle,
  zeeschuimerUploadTemplates,
} from "./DataUploadConstants";
import { handleZeeschuimerUpload } from "./DataUploadFunctions";
import { SocialMediaIconBox } from "./DataUploadModal";

const ZeeschuimerUploadModal = ({
  showZeeschuimerUploadModal,
  setUploadedData,
  setUploadedFileName,
  setShowZeeschuimerUploadModal,
  keyword,
  socialMediaSelected,
  setSocialMediaSelected,
  dataSources,
  uploadedData,
  uploadedFileName,
  setZeeschuimerUploadModalError,
  zeeschuimerUploadModalError,
}) => {
  const addUploadToDataSources = (
    dataSources,
    socialMediaSelected,
    uploadedData,
    uploadedFileName,
  ) => {
    const reformatedData = handleZeeschuimerUpload(
      uploadedData,
      uploadedFileName,
      socialMediaSelected,
    );

    dataSources.push({
      id: "fileUpload~" + uuidv4(),
      name: uploadedFileName,
      length: reformatedData.length,
      content: reformatedData,
      headers: Object.keys(reformatedData[0]),
      accountNameMap: new Map(),
      source: "fileUpload",
    });
    setShowZeeschuimerUploadModal(false);
  };

  const handleClose = () => {
    setUploadedData([]);
    setUploadedFileName("");
    setSocialMediaSelected("");
    setShowZeeschuimerUploadModal(false);
    setZeeschuimerUploadModalError(false);
  };

  return (
    <>
      <Modal open={showZeeschuimerUploadModal} onClose={handleClose}>
        <Box gap={2} sx={dataUploadModalStyle}>
          <Stack direction={"column"} spacing={2}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography id="modal-zs-title" variant="h6" component="h2">
                {keyword("uploadModal_modalTitle")}
              </Typography>
              <IconButton
                onClick={handleClose}
                size="small"
                sx={{ padding: 1.5 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Stack direction={"row"} spacing={2} alignItems="center">
              {Object.values(zeeschuimerUploadTemplates).map((template) => (
                <SocialMediaIconBox
                  key={template.id + "zeeSchuimerUpload"}
                  socialMediaId={template.id}
                  socialMediaIcon={template.icon}
                  socialMediaSelected={socialMediaSelected}
                  setSocialMediaSelected={setSocialMediaSelected}
                />
              ))}
            </Stack>
            <Button
              variant="outlined"
              onClick={() => {
                setZeeschuimerUploadModalError(false);
                try {
                  addUploadToDataSources(
                    dataSources,
                    socialMediaSelected,
                    uploadedData,
                    uploadedFileName,
                  );
                } catch {
                  setZeeschuimerUploadModalError(true);
                }
              }}
            >
              {keyword("uploadModal_ConfirmButton")}
            </Button>
            {zeeschuimerUploadModalError ? (
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

export default ZeeschuimerUploadModal;
