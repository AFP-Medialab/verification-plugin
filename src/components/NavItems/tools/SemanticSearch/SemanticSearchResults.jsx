import React, { useState } from "react";
import { Box, Card, Pagination, Stack, Typography } from "@mui/material";
import SelectSmall from "./components/SelectSmall";
import isEqual from "lodash/isEqual";
import ResultDisplayItem from "./components/ResultDisplayItem";
import { getLanguageName } from "../../../Shared/Utils/languageUtils";
import { i18nLoadNamespace } from "../../../Shared/Languages/i18nLoadNamespace";
import dayjs from "dayjs";
import LocaleData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";

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

  dayjs.extend(LocaleData);
  dayjs.extend(localizedFormat);
  const globalLocaleData = dayjs.localeData();

  const [results, setResults] = useState(searchResults.searchResults);

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

  const scrollToTop = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor",
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const changePage = (event, value) => {
    setCurrentPage(value);
    scrollToTop(event);
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
              <Typography>
                {results.length} {keyword("semantic_search_nb_of_results")}
              </Typography>
              <SelectSmall
                items={sortingModes}
                value={sortingMode}
                setValue={setSortingMode}
                key={sortingMode.key}
                onChange={(value) => {
                  sortResultsBySortingMode(value);
                  setCurrentPage(1);
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
                  date={
                    dayjs(resultItem.date).format(
                      globalLocaleData.longDateFormat("LL"),
                    ) ?? null
                  }
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
