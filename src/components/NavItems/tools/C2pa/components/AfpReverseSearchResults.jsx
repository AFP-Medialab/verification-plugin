import React from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import MetadataList from "@Shared/MetadataList";

const AfpReverseSearchResults = ({
  thumbnailImage,
  thumbnailImageCaption,
  imageMetadata,
}) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/C2pa");

  return (
    <Stack direction="row" spacing={4}>
      <Box width="100%">
        <Grid container direction="row" spacing={2} p={4} width="100%">
          <Grid
            container
            direction="column"
            size={{ md: 12, lg: 6 }}
            spacing={2}
          >
            <Grid>
              <img
                src={thumbnailImage}
                style={{
                  width: 345,
                  borderRadius: "10px",
                }}
              />
            </Grid>

            {thumbnailImageCaption &&
            typeof thumbnailImageCaption === "string" ? (
              <Grid mt={2}>
                <Stack direction="column" spacing={1}>
                  <Typography>{keyword("image_caption_title")}</Typography>

                  <Typography variant={"caption"}>
                    {thumbnailImageCaption}
                  </Typography>
                </Stack>
              </Grid>
            ) : (
              <Alert severity="info" sx={{ width: "fit-content" }}>
                {keyword("no_caption_available_alert")}
              </Alert>
            )}
          </Grid>
          <Grid
            container
            direction="column"
            size={{ md: 12, lg: 6 }}
            spacing={2}
          >
            <Alert severity="info" sx={{ width: "fit-content" }}>
              {keyword("afp_produced_image_info")}
            </Alert>

            {imageMetadata && <MetadataList metadata={imageMetadata} />}
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default AfpReverseSearchResults;
