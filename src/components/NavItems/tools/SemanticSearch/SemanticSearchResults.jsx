import React, { useState } from "react";
import { Box, Card, Pagination, Stack, Typography } from "@mui/material";
import SelectSmall from "./components/SelectSmall";
import isEqual from "lodash/isEqual";
import ResultDisplayItem from "./components/ResultDisplayItem";
import { getLanguageName } from "../../../Shared/Utils/languageUtils";
import { i18nLoadNamespace } from "../../../Shared/Languages/i18nLoadNamespace";

const SemanticSearchResults = (searchResults) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/SemanticSearch");

  const sortingModes = [
    {
      name: keyword("semantic_search_sort_relevant"),
      key: "relevant",
    },
    {
      name: keyword("semantic_search_sort_desc"),
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

  const RESULTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalNumberOfPages = Math.ceil(results.length / RESULTS_PER_PAGE);

  const getResultsForCurrentPage = (results) => {
    if (!Array.isArray(results)) {
      //TODO: handle error
      return;
    }

    const start = (currentPage - 1) * 10;
    const end = Math.min(start + RESULTS_PER_PAGE, results.length);

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
              justifyContent="flex-start"
              alignItems="center"
            >
              <Typography>{results.length} results</Typography>
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

            {getResultsForCurrentPage(results).map((resultItem) => {
              return (
                <ResultDisplayItem
                  key={resultItem.id}
                  id={resultItem.id}
                  claim={resultItem.claimTranslated}
                  title={resultItem.titleTranslated}
                  claimOriginalLanguage={resultItem.claimOriginalLanguage}
                  titleOriginalLanguage={resultItem.titleOriginalLanguage}
                  rating={resultItem.rating}
                  date={new Date(resultItem.date).toDateString() ?? null}
                  website={resultItem.website}
                  language={getLanguageName(resultItem.language)}
                  similarityScore={resultItem.similarityScore}
                  articleUrl={resultItem.articleUrl}
                  domainUrl={resultItem.domainUrl}
                  imageUrl={resultItem.imageUrl}
                />
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
