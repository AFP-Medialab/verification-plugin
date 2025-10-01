import React, { memo, useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Fade from "@mui/material/Fade";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import { ManageSearch } from "@mui/icons-material";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { getLanguageName } from "@Shared/Utils/languageUtils";
import isEqual from "lodash/isEqual";

import languageDictionary from "../../../../LocalDictionary/iso-639-1-languages";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import SemanticSearchResults from "./SemanticSearchResults";
import { useRetrieveFactChecks } from "./api";
import SearchForm from "./components/SearchForm";

// Constants
const DEFAULT_SEARCH_ENGINE_MODE = "auto";
const DEFAULT_DATE_FROM = null;
const DEFAULT_DATE_TO = null;
const DEFAULT_LANGUAGE_FILTER = [];

const SEARCH_ENGINE_MODES = [
  {
    nameKey: "semantic_search_search_engine_1_name",
    descriptionKey: "semantic_search_search_engine_1_description",
    key: "auto",
  },
  {
    nameKey: "semantic_search_search_engine_2_name",
    descriptionKey: "semantic_search_search_engine_2_description",
    key: "english",
  },
  {
    nameKey: "semantic_search_search_engine_3_name",
    descriptionKey: "semantic_search_search_engine_3_description",
    key: "multilingual",
  },
  {
    nameKey: "semantic_search_search_engine_4_name",
    descriptionKey: "semantic_search_search_engine_4_description",
    key: "keyword_search",
  },
];

// Utility functions
const mapErrorToKey = (error) => {
  if (error?.code === "ECONNABORTED" || error?.response?.status === 504) {
    return "semantic_search_error_timeout";
  }
  if (error?.response?.status === 500) {
    return "semantic_search_error_unavailable";
  }
  return "semantic_search_error_default";
};

/**
 * Helper function to return a list of language keys supported if the localized language is in duplicate keys
 * @param {string} localizedLanguageName - the localized language to search keys for
 * @param {string} locale - the language used
 * @param {Object} languageDictionary - the dictionary of language keys - localized language names
 * @returns {string[]} the array of duplicate language keys
 */
const getAllLanguageKeysForLocalizedLanguage = (
  localizedLanguageName,
  locale,
  languageDictionary,
) => {
  return Object.keys(languageDictionary).filter(
    (key) => languageDictionary[key][locale] === localizedLanguageName,
  );
};

const computeLanguageList = (supportedLanguages, currentLang) => {
  let uniqueLanguages = new Set();
  let uniqueTitles = new Set();
  for (const lg of supportedLanguages) {
    const localizedLanguageName = getLanguageName(lg, currentLang);

    //skip duplicate localized language name entries
    if (uniqueTitles.has(localizedLanguageName)) {
      continue;
    }
    uniqueTitles.add(localizedLanguageName);
    uniqueLanguages.add({ title: localizedLanguageName, code: lg });
  }

  // order the list from A to Z
  return [...uniqueLanguages].sort((a, b) => a.title.localeCompare(b.title));
};

// Custom hooks
const useSemanticSearchState = () => {
  return useSelector(
    (state) => ({
      currentLang: state.language,
      assistantText: state.assistant.urlText,
    }),
    shallowEqual,
  );
};

// Main component
const SemanticSearch = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/SemanticSearch");
  const { url } = useParams();

  const { currentLang, assistantText } = useSemanticSearchState();

  const supportedLanguages = Object.keys(languageDictionary);
  const languagesList = computeLanguageList(supportedLanguages, currentLang);

  const searchEngineModes = SEARCH_ENGINE_MODES.map((mode) => ({
    name: keyword(mode.nameKey),
    description: keyword(mode.descriptionKey),
    key: mode.key,
  }));

  const [searchString, setSearchString] = useState("");

  const [hasUserSubmittedForm, setHasUserSubmittedForm] = useState(false);

  const [searchEngineMode, setSearchEngineMode] = useState(
    DEFAULT_SEARCH_ENGINE_MODE,
  );
  const [searchResults, setSearchResults] = useState([]);

  const [dateFrom, setDateFrom] = useState(DEFAULT_DATE_FROM);
  const [dateTo, setDateTo] = useState(DEFAULT_DATE_TO);
  const [languageFilter, setLanguageFilter] = useState(DEFAULT_LANGUAGE_FILTER);

  const [errorMessage, setErrorMessage] = useState("");

  const retrieveFactChecksMutation = useRetrieveFactChecks();

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showResetAdvancedSettings, setShowResetAdvancedSettings] =
    useState(false);

  useEffect(() => {
    const haveSettingsChanged =
      !isEqual(searchEngineMode, DEFAULT_SEARCH_ENGINE_MODE) ||
      dateFrom !== DEFAULT_DATE_FROM ||
      dateTo !== DEFAULT_DATE_TO ||
      languageFilter.length !== DEFAULT_LANGUAGE_FILTER.length;

    if (haveSettingsChanged) setShowResetAdvancedSettings(true);
  }, [searchEngineMode, dateFrom, dateTo, languageFilter]);

  useEffect(() => {
    //load languagues list when user change language
    let loadLanguages = languageFilter.map((lang) => {
      return {
        title: getLanguageName(lang.code, currentLang),
        code: lang.code,
      };
    });
    setLanguageFilter(loadLanguages);
  }, [currentLang]);

  useEffect(() => {
    //takes in text parameter from url
    if (url) {
      const uri = decodeURIComponent(url);
      if (uri === "assistantText" && assistantText) {
        const cleanedText = assistantText.replaceAll("\n", " ");
        setSearchString(cleanedText);
        handleSubmit(cleanedText);
      }
    }
  }, [url, assistantText]);

  const handleSubmit = async (text) => {
    setHasUserSubmittedForm(true);
    setErrorMessage("");

    const urlText = searchString ? searchString : text;

    try {
      const searchResults = await retrieveFactChecksMutation.mutateAsync({
        searchString: urlText,
        searchMethod: searchEngineMode,
        options: {
          languageFilter,
          dateFrom,
          dateTo,
          currentLang,
          languageDictionary,
          getAllLanguageKeysForLocalizedLanguage,
        },
      });
      setSearchResults(searchResults);
    } catch (e) {
      setErrorMessage(keyword(mapErrorToKey(e)));
    }
  };

  const resetSearchSettings = () => {
    setSearchEngineMode(DEFAULT_SEARCH_ENGINE_MODE);
    setDateFrom(DEFAULT_DATE_FROM);
    setDateTo(DEFAULT_DATE_TO);
    setLanguageFilter(DEFAULT_LANGUAGE_FILTER);
    setShowResetAdvancedSettings(false);
  };

  const displaySearchResults = () => {
    if (retrieveFactChecksMutation.isPending)
      return (
        <Card variant="outlined">
          <Stack
            direction="column"
            spacing={4}
            sx={{
              p: 4,
            }}
          >
            <Skeleton variant="rounded" height={40} />
            <Skeleton variant="rounded" width={400} height={40} />
          </Stack>
        </Card>
      );
    else if (errorMessage || retrieveFactChecksMutation.error)
      return (
        <Alert severity="error">
          {errorMessage ||
            keyword(mapErrorToKey(retrieveFactChecksMutation.error))}
        </Alert>
      );
    else if (
      hasUserSubmittedForm &&
      (!searchResults || searchResults.length === 0)
    )
      return (
        <Alert severity="info">
          {"This search returned no result. Try with different keywords."}
        </Alert>
      );
    else if (searchResults.length > 0)
      return <SemanticSearchResults searchResults={searchResults} />;
    else return <></>;
  };

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <HeaderTool
          name={keyword("semantic_search_title")}
          description={keyword("semantic_search_description")}
          icon={
            <ManageSearch
              sx={{
                fill: "var(--mui-palette-primary-main)",
                width: 40,
                height: 40,
              }}
            />
          }
        />
        <Alert severity="info">{keyword("semantic_search_tip")}</Alert>

        <SearchForm
          searchString={searchString}
          setSearchString={setSearchString}
          searchEngineMode={searchEngineMode}
          setSearchEngineMode={setSearchEngineMode}
          searchEngineModes={searchEngineModes}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          languageFilter={languageFilter}
          setLanguageFilter={setLanguageFilter}
          languagesList={languagesList}
          showAdvancedSettings={showAdvancedSettings}
          setShowAdvancedSettings={setShowAdvancedSettings}
          showResetAdvancedSettings={showResetAdvancedSettings}
          resetSearchSettings={resetSearchSettings}
          handleSubmit={handleSubmit}
          isPending={retrieveFactChecksMutation.isPending}
          keyword={keyword}
        />

        {(errorMessage || retrieveFactChecksMutation.error) && (
          <Box>
            <Fade
              in={!!(errorMessage || retrieveFactChecksMutation.error)}
              timeout={750}
            >
              <Alert severity="error">
                {errorMessage ||
                  keyword(mapErrorToKey(retrieveFactChecksMutation.error))}
              </Alert>
            </Fade>
          </Box>
        )}
        {displaySearchResults()}
      </Stack>
    </Box>
  );
};

export default memo(SemanticSearch);
