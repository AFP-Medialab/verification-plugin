import React from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import MetadataList from "../../../../Shared/MetadataList";

const MetadataImageResult = ({ metadata, imageSrc }) => {
  return (
    <Card variant="outlined">
      <Grid
        container
        direction="row"
        spacing={3}
        sx={{
          p: 4,
        }}
      >
        <Grid
          container
          size={{ md: 12, lg: 6 }}
          sx={{
            justifyContent: "start",
          }}
        >
          <Grid>
            <img
              src={imageSrc}
              alt={imageSrc}
              style={{
                width: "100%",
                maxHeight: "60vh",
                borderRadius: "10px",
              }}
            />
          </Grid>
        </Grid>
        <Grid size={{ md: 12, lg: 6 }}>
          {metadata ? (
            <MetadataList metadata={metadata} />
          ) : (
            <Box>
              <Alert severity="info">
                {"No metadata found for this image"}
              </Alert>
            </Box>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};
export default MetadataImageResult;
