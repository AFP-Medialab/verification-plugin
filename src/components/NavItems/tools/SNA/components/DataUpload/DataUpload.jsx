import React from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Papa from "papaparse";

import { SNAButton } from "../../utils/SNAButton";

const DataUpload = ({
  keyword,
  dataUploadInputRef,
  setUploadedData,
  setShowUploadModal,
  setUploadedFileName,
  setShowZeeschuimerUploadModal,
}) => {
  const openUploadPrompt = () => dataUploadInputRef.current?.click();

  const parseUploadedCSV = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (res) => {
        setUploadedFileName(file.name);
        setUploadedData(res.data);
        setShowUploadModal(true);
      },
    });
  };

  const parseZeeschuimerUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        let result = reader.result
          .split("\n")
          .filter((line) => line.length > 0)
          .map((line) => {
            try {
              return JSON.parse(line);
            } catch {
              line;
            }
          });
        setUploadedFileName(file.name);
        setUploadedData(result);
        setShowZeeschuimerUploadModal(true);
      },
      false,
    );
    reader.readAsText(file);
  };

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <input
          type="file"
          hidden
          ref={dataUploadInputRef}
          onChange={(event) => {
            let filename = event.target.files[0].name;
            let extension = filename.split(".").pop();
            if (extension === "csv") parseUploadedCSV(event);
            if (extension === "ndjson") parseZeeschuimerUpload(event);
            event.target.value = null;
          }}
        />
        <Typography variant="h6" align="left">
          {keyword("dataupload_title")}
        </Typography>
        {SNAButton(openUploadPrompt, keyword("uploadButton_text"))}
      </Stack>
    </>
  );
};

export default DataUpload;
