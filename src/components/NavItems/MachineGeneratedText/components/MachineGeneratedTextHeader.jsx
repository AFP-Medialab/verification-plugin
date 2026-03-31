import React from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { AudioFile } from "@mui/icons-material";

import HeaderTool from "@Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const MachineGeneratedTextHeader = () => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/MachineGeneratedText",
  );
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  return (
    <Box>
      <HeaderTool
        name={keywordAllTools("navbar_mgt")}
        description={keywordAllTools("navbar_mgt_description")}
        icon={
          <AudioFile
            style={{
              fill: "var(--mui-palette-primary-main)",
              height: "40px",
              width: "auto",
            }}
          />
        }
      />
      <Stack direction={"column"} spacing={2}>
        <Alert severity="info">
          {keyword("machine_generated_text_tooltip")}
        </Alert>
      </Stack>
    </Box>
  );
};

export default MachineGeneratedTextHeader;
