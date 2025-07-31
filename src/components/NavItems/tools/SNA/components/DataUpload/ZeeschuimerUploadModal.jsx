import React from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { v4 as uuidv4 } from "uuid";

import { SNAButton } from "../../utils/SNAButton";
import {
  dataUploadModalStyle,
  zeeschuimerUploadTemplates,
} from "./DataUploadConstants";
import { handleZeeschuimerUpload } from "./DataUploadFunctions";
import { socialMediaIconBox } from "./DataUploadModal";

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

  return (
    <>
      <Modal
        open={showZeeschuimerUploadModal}
        onClose={() => {
          setUploadedData([]);
          setUploadedFileName("");
          setSocialMediaSelected("");
          setShowZeeschuimerUploadModal(false);
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          sx={dataUploadModalStyle}
        >
          <Typography id="modal-zs-title" variant="h6" component="h2">
            {keyword("uploadModal_modalTitle")}
          </Typography>
          <Stack direction={"row"} spacing={2} alignItems="center">
            {Object.values(zeeschuimerUploadTemplates).map((template) =>
              socialMediaIconBox(
                template.id,
                template.icon,
                socialMediaSelected,
                setSocialMediaSelected,
              ),
            )}
          </Stack>
          {SNAButton(
            () =>
              addUploadToDataSources(
                dataSources,
                socialMediaSelected,
                uploadedData,
                uploadedFileName,
              ),
            keyword("uploadModal_ConfirmButton"),
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ZeeschuimerUploadModal;
