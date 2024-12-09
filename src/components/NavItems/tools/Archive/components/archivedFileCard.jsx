import React from "react";
import { Alert, Box, Card, Fade, Stack } from "@mui/material";
import ArchiveTable from "./archiveTable";
import { i18nLoadNamespace } from "../../../../Shared/Languages/i18nLoadNamespace";

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
