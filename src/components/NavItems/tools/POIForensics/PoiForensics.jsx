import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

import { FaceRetouchingNatural } from "@mui/icons-material";

import StringFileUploadField from "@/components/Shared/StringFileUploadField";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";

const PoiForensics = () => {
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <HeaderTool
          name={keywordAllTools("navbar_poiforensics")}
          description={keywordAllTools("navbar_poiforensics_description")}
          icon={
            <FaceRetouchingNatural
              style={{
                fill: "var(--mui-palette-primary-main)",
                height: "40px",
                width: "auto",
              }}
            />
          }
        />

        <Card variant="outlined">
          <Box
            sx={{
              p: 4,
            }}
          ></Box>
        </Card>
      </Stack>
    </Box>
  );
};
export default PoiForensics;
