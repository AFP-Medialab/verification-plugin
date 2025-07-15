import React from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Papa from "papaparse";

import { SNAButton } from "../../utils/SNAButton";

const DataUpload = (DataUploadProps) => {
  let keyword = DataUploadProps.keyword;
  let dataUploadInputRef = DataUploadProps.dataUploadInputRef;
  let setUploadedData = DataUploadProps.setUploadedData;
  let setShowUploadModal = DataUploadProps.setShowUploadModal;
  let setUploadedFileName = DataUploadProps.setUploadedFileName;
  let setShowZeeschuimerUploadModal =
    DataUploadProps.setShowZeeschuimerUploadModal;

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
