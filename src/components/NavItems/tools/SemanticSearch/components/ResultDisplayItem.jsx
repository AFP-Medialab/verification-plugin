import React, { useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";

const ResultDisplayItem = ({
  id,
  claim,
  title,
  claimOriginalLanguage,
  titleOriginalLanguage,
  rating,
  date,
  website,
  language,
  similarityScore,
  articleUrl,
  domainUrl,
  imageUrl,
}) => {
  const [showOriginalClaim, setShowOriginalClaim] = useState(false);
  const [showOriginalTitle, setShowOriginalTitle] = useState(false);

  return (
    <Box width="100%" key={id}>
      <Grid container direction="row" p={2} justifyContent="space-between">
        <Grid
          item
          container
          direction="row"
          xs={10}
          spacing={2}
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item>
            <Avatar
              src={imageUrl}
              variant="rounded"
              sx={{ width: 80, height: 80 }}
            />
          </Grid>
          <Grid item xs>
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={2}
            >
              <Stack direction="column">
                <Typography>
                  Claim: {showOriginalClaim ? claimOriginalLanguage : claim}
                </Typography>
                <Typography variant="caption">
                  {showOriginalClaim ? "" : `Translated from ${language} • `}
                  <Link
                    onClick={() => setShowOriginalClaim((prev) => !prev)}
                    sx={{ cursor: "pointer" }}
                  >
                    {showOriginalClaim
                      ? "Show English Translation"
                      : "See Original"}
                  </Link>
                </Typography>
              </Stack>
              <Stack direction="column">
                <Typography>
                  Title:{" "}
                  <Link href={articleUrl}>
                    {showOriginalTitle ? titleOriginalLanguage : title}
                  </Link>
                </Typography>

                <Typography variant="caption">
                  {showOriginalTitle ? "" : `Translated from ${language} • `}
                  <Link
                    onClick={() => setShowOriginalTitle((prev) => !prev)}
                    sx={{ cursor: "pointer" }}
                  >
                    {showOriginalTitle
                      ? "Show English Translation"
                      : "See Original"}
                  </Link>
                </Typography>
              </Stack>
              <Typography variant="body2">Rating: {rating}</Typography>
              <Typography variant="subtitle2">{date ?? ""}</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid item xs={2} pl={4}>
          <Stack direction="column" spacing={2}>
            <Link href={domainUrl} variant="body1">
              {website}
            </Link>
            <Chip label={language} sx={{ width: "fit-content" }} />
          </Stack>
        </Grid>
      </Grid>
      <Stack
        direction="row"
        spacing={2}
        p={2}
        justifyContent="flex-start"
        alignItems="flex-start"
      ></Stack>
      <Divider orientation="horizontal" flexItem />
    </Box>
  );
};

export default ResultDisplayItem;
