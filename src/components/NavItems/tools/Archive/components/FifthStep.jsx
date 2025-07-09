import React from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import { prettifyLargeString } from "../utils";
import ArchivedFileCard from "./archivedFileCard";

const FifthStep = ({
  archiveFileToWbm,
  fileToUpload,
  errorMessage,
  archiveLinks,
}) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  return (
    <Stack direction="column" spacing={4}>
      {fileToUpload &&
        typeof fileToUpload.name === "string" &&
        fileToUpload.name.length > 0 && (
          <List dense={true}>
            <ListItem>
              <ListItemText
                primary={keyword("step5_file_name")}
                secondary={prettifyLargeString(fileToUpload.name)}
              />
            </ListItem>
          </List>
        )}

      {archiveFileToWbm.isError && (
        <Box>
          <Fade in={true} timeout={750}>
            <Alert severity="error">
              {keyword(archiveFileToWbm.error.message)}
            </Alert>
          </Fade>
        </Box>
      )}

      {errorMessage && (
        <Box>
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
    </Stack>
  );
};

export default FifthStep;
