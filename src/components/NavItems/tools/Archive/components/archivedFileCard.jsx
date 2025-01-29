import React from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Fade from "@mui/material/Fade";
import Stack from "@mui/material/Stack";

import { i18nLoadNamespace } from "../../../../Shared/Languages/i18nLoadNamespace";
import ArchiveTable from "./archiveTable";

const ArchivedFileCard = ({ file, archiveLinks }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  return (
    <Card variant="outlined">
      <Box p={3}>
        <form>
          <Stack spacing={4}>
            <Box>
              <Box mb={4}>
                <Fade in={true} timeout={750}>
                  <Alert severity="success">{keyword("upload_success")}</Alert>
                </Fade>
              </Box>
              <>
                {file && file.name && (
                  <Fade in={true} timeout={1000}>
                    <Box>
                      <ArchiveTable rows={archiveLinks} fileName={file.name} />
                    </Box>
                  </Fade>
                )}
              </>
            </Box>
          </Stack>
        </form>
      </Box>
    </Card>
  );
};

export default ArchivedFileCard;
