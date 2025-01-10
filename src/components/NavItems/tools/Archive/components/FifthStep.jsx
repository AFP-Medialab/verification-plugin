import React from "react";
import { Alert, Box, Fade, Skeleton, Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ArchivedFileCard from "./archivedFileCard";
import { i18nLoadNamespace } from "../../../../Shared/Languages/i18nLoadNamespace";

const FifthStep = ({
  archiveFileToWbm,
  fileToUpload,
  errorMessage,
  archiveLinks,
}) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  return (
    <>
      {archiveFileToWbm.isError && (
        <Box mb={4}>
          <Fade in={true} timeout={750}>
            <Alert severity="error">
              {keyword(archiveFileToWbm.error.message)}
            </Alert>
          </Fade>
        </Box>
      )}

      {errorMessage && (
        <Box mb={4}>
          <Fade in={true} timeout={750}>
            <Alert severity="error">{keyword(errorMessage)}</Alert>
          </Fade>
        </Box>
      )}

      {archiveFileToWbm.isPending && (
        <Fade in={true} timeout={750}>
          <Stack direction="column" spacing={2}>
            <Alert icon={<CircularProgress size={20} />} severity="info">
              {keyword("upload_loading")}
            </Alert>
            <Skeleton variant="text" height={200} />
          </Stack>
        </Fade>
      )}

      {archiveFileToWbm.isSuccess && (
        <ArchivedFileCard file={fileToUpload} archiveLinks={archiveLinks} />
      )}
    </>
  );
};

export default FifthStep;
