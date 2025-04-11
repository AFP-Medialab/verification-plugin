import React from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid2 from "@mui/material/Grid2";

// Import Grid2 component
import MetadataList from "@Shared/MetadataList";

const MetadataVideoResult = ({ metadata, videoSrc }) => {
  return (
    <Card variant="outlined">
      <Grid2
        container
        spacing={4}
        direction={{ md: "column", lg: "row" }}
        sx={{
          justifyContent: "start",
          alignItems: "start",
          p: 4,
        }}
      >
        <Grid2 size={{ md: 12, lg: 6 }}>
          <video
            width="100%"
            height="auto"
            controls
            style={{
              width: "100%",
              borderRadius: "10px",
              maxHeight: "80vh",
            }}
          >
            <source src={videoSrc} type="video/mp4" />
            <source src={videoSrc} type="video/webm" />
            <source src={videoSrc} type="video/ogg" />
          </video>
        </Grid2>
        <Grid2 size={{ md: 12, lg: 6 }}>
          {metadata ? (
            <MetadataList metadata={metadata} />
          ) : (
            <Box>
              <Alert severity="info">
                {"No metadata found for this video"}
              </Alert>
            </Box>
          )}
        </Grid2>
      </Grid2>
    </Card>
  );
};

export default MetadataVideoResult;
