import React from "react";

import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const KeyframesLoadingState = () => (
  <Card variant="outlined">
    <Stack direction="column" spacing={4} sx={{ p: 2 }}>
      <Skeleton variant="rounded" height={40} />
      <Stack direction={{ md: "row", xs: "column" }} spacing={4}>
        <Skeleton variant="rounded" width={80} height={80} />
        <Skeleton variant="rounded" width={80} height={80} />
        <Skeleton variant="rounded" width={80} height={80} />
        <Skeleton variant="rounded" width={80} height={80} />
      </Stack>
    </Stack>
  </Card>
);

export default KeyframesLoadingState;
