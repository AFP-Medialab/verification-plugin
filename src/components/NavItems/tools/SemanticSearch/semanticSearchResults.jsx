import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Chip, Pagination, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import SelectSmall from "./components/SelectSmall";
import isEqual from "lodash/isEqual";
import { getLanguageName } from "../../../Shared/Utils/languageUtils";

const SemanticSearchResults = (searchResults) => {
  const sortingModes = [
    {
      name: "Most relevant",
      key: "relevant",
    },
    {
      name: "Most Recent",
      key: "desc",
    },
  ];

  const [results, setResults] = useState(searchResults.searchResults);
  console.log(results);
  const [sortingMode, setSortingMode] = useState(sortingModes[0]);

  const sortResultsBySortingMode = (sortingMode) => {
    //relevance
    if (isEqual(JSON.parse(sortingMode), sortingModes[0])) {
      setResults(results.sort((a, b) => b.similarityScore - a.similarityScore));
    }
    //date desc
    if (isEqual(JSON.parse(sortingMode), sortingModes[1])) {
      setResults(results.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  };

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

  const RESULTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalNumberOfPages = Math.ceil(results.length / RESULTS_PER_PAGE);

  const getResultsForCurrentPage = () => {
    const start = (currentPage - 1) * 10;
    const end = Math.min(start + RESULTS_PER_PAGE, results.length);
    console.log(start);
    console.log(end);
    console.log(results.slice(start, end));
    return results.slice(start, end);
  };

  const changePage = (event, value) => {
    console.log(`Page is ${value}`);
    setCurrentPage(value);
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
                items={sortingModes}
                value={sortingMode}
                setValue={setSortingMode}
                onChange={(value) => {
                  sortResultsBySortingMode(value);
                }}
                minWidth={120}
              />
            </Stack>

            {getResultsForCurrentPage().map((searchResult) => {
              console.log(searchResult);
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
              <Pagination
                count={totalNumberOfPages}
                color="primary"
                onChange={changePage}
                page={currentPage}
              />
            </Box>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default SemanticSearchResults;
