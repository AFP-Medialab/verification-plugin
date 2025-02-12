import React from "react";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

import MetadataList from "../../../../Shared/MetadataList";

const MetadataImageResult = ({ metadata, imageSrc }) => {
  return (
    <Card variant="outlined">
      <Stack spacing={2} direction={{ md: "column", lg: "row" }} p={4}>
        <Box style={{ maxWidth: "640px", margin: "0 auto" }}>
          <img
            src={imageSrc}
            alt={imageSrc}
            style={{
              maxWidth: "100%",
              maxHeight: "60vh",
              borderRadius: "10px",
            }}
          />
        </Box>
        <MetadataList metadata={metadata} />
      </Stack>
    </Card>
  );
};
export default MetadataImageResult;
