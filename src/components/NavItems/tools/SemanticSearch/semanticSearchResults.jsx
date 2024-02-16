import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Chip, Pagination, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LanguageDictionary from "../../../../LocalDictionary/iso-639-1-languages.jsx";
import SelectSmall from "./components/SelectSmall";

const SemanticSearchResults = (searchResults) => {
  const sortingModes = [
    {
      name: "Most Recent",
      key: "desc",
    },
    {
      name: "Most relevant",
      key: "relevant",
    },
  ];

  const [sortingMode, setSortingMode] = useState(sortingModes[0]);

  const result = (
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
  ) => {
    const [showOriginalClaim, setShowOriginalClaim] = useState(false);
    const [showOriginalTitle, setShowOriginalTitle] = useState(false);

    console.log(searchResults);

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
              {/*<Typography variant="body2">Score: {similarityScore}</Typography>*/}
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

  console.log(searchResults.searchResults);

  const getLanguageName = (language) => {
    if (
      !language ||
      typeof language !== "string" ||
      !LanguageDictionary[language] ||
      typeof LanguageDictionary[language].name !== "string"
    ) {
      //TODO: Error handling
      return language;
    }
    return LanguageDictionary[language].name.split(";")[0];
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
            <Stack
              direction="row-reverse"
              spacing={2}
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <SelectSmall
                // label="Sorting"
                items={sortingModes}
                initialValue={sortingMode.name}
                onChange={(e) => setSortingMode(e.target.value)}
                minWidth={120}
              />
            </Stack>

            {searchResults.searchResults.map((searchResult) => {
              return result(
                searchResult.id,
                searchResult.claimTranslated,
                searchResult.titleTranslated,
                searchResult.claimOriginalLanguage,
                searchResult.titleOriginalLanguage,
                searchResult.rating,
                new Date(searchResult.date).toDateString(),
                searchResult.website,
                getLanguageName(searchResult.language),
                searchResult.similarityScore,
                searchResult.articleUrl,
                searchResult.domainUrl,
                searchResult.imageUrl,
              );
            })}

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
