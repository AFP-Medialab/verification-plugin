import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import { Gradient } from "@mui/icons-material";

import SyntheticImageDetectionForm from "@/components/NavItems/tools/SyntheticImageDetection/SyntheticImageDetectionForm";
import { useSyntheticImageDetection } from "@/components/NavItems/tools/SyntheticImageDetection/useSyntheticImageDetection";
import { resetSyntheticImageDetectionImage } from "@/redux/actions/tools/syntheticImageDetectionActions";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import SyntheticImageDetectionResults from "./syntheticImageDetectionResults";

const SyntheticImageDetection = () => {
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const result = useSelector((state) => state.syntheticImageDetection.result);
  const nd = useSelector((state) => state.syntheticImageDetection.duplicates);
  const url = useSelector((state) => state.syntheticImageDetection.url);

  const dispatch = useDispatch();

  const [input, setInput] = useState(url ? url : "");
  const [imageFile, setImageFile] = useState(undefined);

  const resetState = () => {
    setInput("");
    setImageFile(undefined);
    dispatch(resetSyntheticImageDetectionImage());
  };

  const { startDetection, c2paData, imageType } = useSyntheticImageDetection({
    dispatch,
  });

  return (
    <Stack direction="column" spacing={4}>
      <HeaderTool
        name={keywordAllTools("navbar_synthetic_image_detection")}
        description={keywordAllTools(
          "navbar_synthetic_image_detection_description",
        )}
        icon={
          <Gradient
            style={{
              fill: "var(--mui-palette-primary-main)",
              height: "40px",
              width: "auto",
            }}
          />
        }
      />

      <Alert severity="warning">
        {keywordWarning("warning_beta_synthetic_image_detection")}
      </Alert>

      <SyntheticImageDetectionForm
        resetState={resetState}
        input={input}
        setInput={setInput}
        imageFile={imageFile}
        setImageFile={setImageFile}
        startDetection={startDetection}
      />

      {result && (
        <SyntheticImageDetectionResults
          results={result}
          url={url}
          handleClose={resetState}
          nd={nd}
          imageType={imageType}
          c2paData={c2paData}
        />
      )}
    </Stack>
  );
};

export default SyntheticImageDetection;
