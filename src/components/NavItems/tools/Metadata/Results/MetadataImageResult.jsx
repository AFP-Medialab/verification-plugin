import React from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

import MetadataList from "../../../../Shared/MetadataList";

const MetadataImageResult = ({ metadata, imageSrc }) => {
  return (
    <Card variant="outlined">
      <Stack
        direction={{ md: "column", lg: "row" }}
        spacing={4}
        sx={{
          p: 4,
          justifyContent: { md: "flex-start", lg: "center" },
          alignItems: "flex-start",
        }}
      >
        <Box
          style={{
            maxWidth: "640px",
            //    margin: "0 auto"
          }}
        >
          <img
            src={imageSrc}
            alt={imageSrc}
            style={{
              width: "100%",
              maxHeight: "60vh",
              borderRadius: "10px",
            }}
          />
        </Box>
        {metadata ? (
          <MetadataList metadata={metadata} />
        ) : (
          <Box>
            <Alert severity="info">{"No metadata found for this image"}</Alert>
          </Box>
        )}
      </Stack>
    </Card>
  );
};
export default MetadataImageResult;
