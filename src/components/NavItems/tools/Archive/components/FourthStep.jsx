import React from "react";
import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CloseIcon from "@mui/icons-material/Close";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const FourthStep = ({ fileInput, setFileInput }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  return (
    <Stack direction="column" spacing={4}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h6">{keyword("step4_title")}</Typography>
      </Stack>
      <Box>
        <ButtonGroup variant="outlined">
          <Button startIcon={<FolderOpenIcon />} sx={{ textTransform: "none" }}>
            <label htmlFor="file">
              {fileInput ? fileInput.name : keyword("archive_wacz_accordion")}
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept={".wacz"}
              hidden={true}
              onChange={(e) => {
                e.preventDefault();
                setFileInput(e.target.files[0]);
                e.target.value = null;
              }}
            />
          </Button>
          {fileInput instanceof Blob && (
            <Button
              size="small"
              aria-label="remove selected file"
              onClick={(e) => {
                e.preventDefault();
                setFileInput(null);
              }}
            >
              <CloseIcon fontSize="small" />
            </Button>
          )}
        </ButtonGroup>
      </Box>
    </Stack>
  );
};

export default FourthStep;
