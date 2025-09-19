import React from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { AudioFile } from "@mui/icons-material";

import HeaderTool from "@Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const HiyaHeader = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Hiya");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  return (
    <Box>
      <HeaderTool
        name={keywordAllTools("navbar_hiya")}
        description={keywordAllTools("navbar_hiya_description")}
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
        <Alert severity="warning">{keywordWarning("warning_beta_hoya")}</Alert>
        <Alert severity="info">{keyword("hiya_tip")}</Alert>
      </Stack>
    </Box>
  );
};

export default HiyaHeader;
