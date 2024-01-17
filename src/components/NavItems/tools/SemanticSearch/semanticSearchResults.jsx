import React from "react";
import Box from "@mui/material/Box";
import { Chip, Pagination, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

const SemanticSearchResults = (searchResults) => {
  searchResults = {
    claim:
      "A video clip shows the arrest of an Iranian sniper who killed protesters in the Green Zone in Baghdad during the recent clashes.",
    title:
      "This clip has been circulating since 2011, and it does not show an Iranian sniper who was recently arrested in Iraq.",
    rating: "False",
    date: "Published on 2022-08-31",
    website: "misbar.com",
    language: "Arabic",
    similarityScore: 0.88,
    articleUrl:
      "https://misbar.com/factcheck/2023/11/19/الصورة-قديمة-وليست-لمقتل-قناص-إسرائيلي-عل-يد-المقاومة-في-غزة#a74d408bebaf3eef320fa8bf71817523",
    domainUrl: "http://misbar.com/",
  };

  const result = (
    claim,
    title,
    rating,
    date,
    website,
    language,
    similarityScore,
    articleUrl,
    domainUrl,
  ) => {
    return (
      <Box width="100%">
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
                src="https://sprawdzam.afp.com/sites/default/files/styles/twitter_card/public/medias/factchecking/g2/2022-09/aa2dc4ac30e8a183448986495b465e19.jpeg?itok=GLOsh8mv"
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
                  <Typography>Claim: {claim}</Typography>
                  <Typography variant="caption">
                    Translated from {language} •{" "}
                    <Link sx={{ cursor: "pointer" }}>See Original</Link>
                  </Typography>
                </Stack>
                <Stack direction="column">
                  <Typography>
                    Title: <Link href={articleUrl}>{title}</Link>
                  </Typography>

                  <Typography variant="caption">
                    Translated from {language} •{" "}
                    <Link sx={{ cursor: "pointer" }}>See Original</Link>
                  </Typography>
                </Stack>
                <Typography variant="body2">Rating: {rating}</Typography>
                <Typography variant="subtitle2">{date}</Typography>
              </Stack>
            </Grid>
          </Grid>
          <Grid item xs={2} pl={4}>
            <Stack direction="column" spacing={2}>
              <Link href={domainUrl} variant="body1">
                {website}
              </Link>
              <Chip label={language} sx={{ width: "fit-content" }} />
              <Typography variant="body2">Score: {similarityScore}</Typography>
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

  return (
    <Box>
      <Card>
        <Box>
          <Stack
            direction="column"
            spacing={2}
            p={2}
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            {result(
              searchResults.claim,
              searchResults.title,
              searchResults.rating,
              searchResults.date,
              searchResults.website,
              searchResults.language,
              searchResults.similarityScore,
              searchResults.articleUrl,
              searchResults.domainUrl,
            )}
            {result(
              searchResults.claim,
              searchResults.title,
              searchResults.rating,
              searchResults.date,
              searchResults.website,
              searchResults.language,
              searchResults.similarityScore,
              searchResults.articleUrl,
              searchResults.domainUrl,
            )}
            <Box alignSelf="center" pt={4}>
              <Pagination count={10} color="primary" />
            </Box>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default SemanticSearchResults;
