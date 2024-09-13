import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  Collapse,
  Fade,
  IconButton,
  Link,
  Modal,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import {
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ManageSearch,
} from "@mui/icons-material";
import SemanticSearchResults from "./SemanticSearchResults";
import CheckboxesTags from "./components/CheckboxesTags";
import { DatePicker } from "@mui/x-date-pickers";
import SelectSmall from "./components/SelectSmall";
import LoadingButton from "@mui/lab/LoadingButton";

import axios from "axios";
import isEqual from "lodash/isEqual";
import dayjs from "dayjs";
import { getLanguageName } from "../../../Shared/Utils/languageUtils";
import { i18nLoadNamespace } from "../../../Shared/Languages/i18nLoadNamespace";
import languageDictionary from "../../../../LocalDictionary/iso-639-1-languages";
import { useSelector } from "react-redux";

const SemanticSearch = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/SemanticSearch");

  const supportedLanguages = Object.keys(languageDictionary);

  const currentLang = useSelector((state) => state.language);

  let text = useSelector((state) => state.assistant.urlText);

  const { url } = useParams();

  /**
   * Helper function to return a list of language keys supported if the localized language is in duplicate keys
   * @param localizedLanguageName {string} the localized language to search keys for
   * @param locale {string} the language used
   * @param languageDictionary the dictionary of language keys - localized language names
   * @returns {string[]} the array of duplicate language keys
   */
  const getAllLanguageKeysForLocalizedLanguage = (
    localizedLanguageName,
    locale,
    languageDictionary,
  ) => {
    console.log(
      Object.keys(languageDictionary).filter(
        (key) => languageDictionary[key][locale] === localizedLanguageName,
      ),
    );

    return Object.keys(languageDictionary).filter(
      (key) => languageDictionary[key][locale] === localizedLanguageName,
    );
  };

  const computeLanguageList = () => {
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
  //TODO: change title to localizedName
  const languagesList = computeLanguageList();

  class SemanticSearchResult {
    id;
    claimTranslated;
    titleTranslated;
    claimOriginalLanguage;
    titleOriginalLanguage;
    rating;
    date;
    website;
    language;
    similarityScore;
    articleUrl;
    domainUrl;
    imageUrl;

    constructor(
      id,
      claimTranslated,
      titleTranslated,
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
    ) {
      this.id = id;
      this.claimTranslated = claimTranslated;
      this.titleTranslated = titleTranslated;
      this.claimOriginalLanguage = claimOriginalLanguage;
      this.titleOriginalLanguage = titleOriginalLanguage;
      this.rating = rating;
      this.date = date;
      this.website = website;
      this.language = language;
      this.similarityScore = similarityScore;
      this.articleUrl = articleUrl;
      this.domainUrl = domainUrl;
      this.imageUrl = imageUrl;
    }
  }

  const searchEngineModes = [
    {
      name: keyword("semantic_search_search_engine_1_name"),
      description: keyword("semantic_search_search_engine_1_description"),
      key: "auto",
    },
    {
      name: keyword("semantic_search_search_engine_2_name"),
      description: keyword("semantic_search_search_engine_2_description"),
      key: "english",
    },
    {
      name: keyword("semantic_search_search_engine_3_name"),
      description: keyword("semantic_search_search_engine_3_description"),
      key: "multilingual",
    },
    {
      name: keyword("semantic_search_search_engine_4_name"),
      description: keyword("semantic_search_search_engine_4_description"),
      key: "keyword_search",
    },
  ];
  const searchEngineModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: "400px",
    width: "50vw",
    backgroundColor: "background.paper",
    outline: "unset",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    maxHeight: "60vh",
    overflow: "auto",
  };

  const DEFAULT_SEARCH_ENGINE_MODE = "auto";
  const DEFAULT_DATE_FROM = null;
  const DEFAULT_DATE_TO = null;
  const DEFAULT_LANGUAGE_FILTER = [];

  const [searchString, setSearchString] = useState("");

  const [hasUserSubmittedForm, setHasUserSubmittedForm] = useState(false);

  const [searchEngineMode, setSearchEngineMode] = useState(
    DEFAULT_SEARCH_ENGINE_MODE,
  );
  const [searchResults, setSearchResults] = useState([]);

  const [dateFrom, setDateFrom] = useState(DEFAULT_DATE_FROM);
  const [dateTo, setDateTo] = useState(DEFAULT_DATE_TO);
  const [languageFilter, setLanguageFilter] = useState(DEFAULT_LANGUAGE_FILTER);

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

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
      const uri = url !== null ? decodeURIComponent(url) : undefined;
      if (uri === "assistantText" && text) {
        text = text.replaceAll("\n", " ");
        setSearchString(text);
        handleSubmit(text);
      }
    }
  }, [url, text]);

  const handleSubmit = async (text) => {
    setIsLoading(true);
    setHasUserSubmittedForm(true);
    setErrorMessage("");

    const urlText = searchString ? searchString : text;

    let searchResults;
    try {
      searchResults = await getFactChecks(urlText, searchEngineMode);
    } catch (e) {
      //   TODO: Handle Error
      setErrorMessage(e.message);
    }

    setSearchResults(searchResults);

    setIsLoading(false);
    // setTimeout(() => {
    //   setIsLoading(false);
    //   setErrorMessage("This is a test error message");
    // }, 5000);
  };

  /**
   * Retrieves the first 1000 fact checks for the chosen query string and parameters
   * @returns {Promise<SemanticSearchResult[] | Error>}
   */
  const getFactChecks = async (searchString, searchMethod) => {
    if (typeof searchString !== "string") {
      throw new Error(
        "[getFactCheck] Error: Invalid type for parameter searchString",
      );
    }

    if (typeof searchMethod !== "string") {
      throw new Error(
        "[getFactCheck] Error: Invalid type for parameter searchMethod",
      );
    }

    const baseUrl = process.env.REACT_APP_SEMANTIC_SEARCH_URL;

    const params = new URLSearchParams();

    params.append("text", searchString);
    params.append("search_method", searchMethod);
    params.append("time_decay", "true");
    params.append("limit", "100");

    for (const language of languageFilter) {
      const duplicateLanguageKeys = getAllLanguageKeysForLocalizedLanguage(
        language.title,
        currentLang,
        languageDictionary,
      );

      for (const key of duplicateLanguageKeys) {
        params.append("language", key);
      }
    }

    dateFrom &&
      dayjs(dateFrom).isValid() &&
      params.append(
        "published_date_from",
        dayjs(dateFrom).format("YYYY-MM-DD"),
      );

    dateTo &&
      dayjs(dateTo).isValid() &&
      params.append("published_date_to", dayjs(dateTo).format("YYYY-MM-DD"));

    const response = await axios.get(baseUrl, { params: params });

    if (!response.data || !response.data.fact_checks) {
      //TODO: Error handling
      return;
    }

    const resArr = [];
    for (const searchResult of response.data.fact_checks) {
      const semanticSearchResult = new SemanticSearchResult(
        searchResult.id,
        searchResult.claim_en,
        searchResult.title_en,
        searchResult.claim,
        searchResult.title,
        searchResult.rating,
        searchResult.published_at,
        searchResult.source_name,
        searchResult.source_language,
        searchResult.score,
        searchResult.url,
        searchResult.source_name,
        searchResult.image_url,
      );
      resArr.push(semanticSearchResult);
    }

    return resArr;
  };

  const resetSearchSettings = () => {
    setSearchEngineMode(DEFAULT_SEARCH_ENGINE_MODE);
    setDateFrom(DEFAULT_DATE_FROM);
    setDateTo(DEFAULT_DATE_TO);
    setLanguageFilter(DEFAULT_LANGUAGE_FILTER);
    setShowResetAdvancedSettings(false);
  };

  const [openSearchEngineModal, setOpenSearchEngineModal] =
    React.useState(false);

  const handleOpenSearchEngineModal = () => {
    setOpenSearchEngineModal(true);
  };

  const handleCloseSearchEngineModal = () => setOpenSearchEngineModal(false);

  const displaySearchResults = () => {
    if (isLoading)
      return (
        <Card>
          <Stack direction="column" spacing={4} p={4}>
            <Skeleton variant="rounded" height={40} />
            <Skeleton variant="rounded" width={400} height={40} />
          </Stack>
        </Card>
      );
    else if (errorMessage)
      return (
        <Alert severity="error">{"An error happened. Please try again."}</Alert>
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
            <ManageSearch sx={{ fill: "#00926c", width: 40, height: 40 }} />
          }
        />
        <Alert severity="info">{keyword("semantic_search_tip")}</Alert>
        <Card>
          <Box p={3}>
            <form>
              <Stack spacing={4}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <TextField
                    fullWidth
                    value={searchString}
                    label={keyword(
                      "semantic_search_form_textfield_placeholder",
                    )}
                    placeholder={keyword(
                      "semantic_search_form_textfield_placeholder",
                    )}
                    multiline
                    minRows={2}
                    variant="outlined"
                    disabled={isLoading}
                    onChange={(e) => {
                      setSearchString(e.target.value);
                    }}
                  />
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    disabled={isLoading || !searchString}
                    loading={isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    {keyword("semantic_search_form_submit_button")}
                  </LoadingButton>
                </Stack>
                <Box>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      endIcon={
                        showAdvancedSettings ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )
                      }
                      onClick={() =>
                        setShowAdvancedSettings((prevState) => !prevState)
                      }
                    >
                      {showAdvancedSettings
                        ? keyword(
                            "semantic_search_hide_advanced_settings_button",
                          )
                        : keyword(
                            "semantic_search_show_advanced_settings_button",
                          )}
                    </Button>
                    {showResetAdvancedSettings && (
                      <Button variant="text" onClick={resetSearchSettings}>
                        {keyword(
                          "semantic_search_reset_search_settings_button",
                        )}
                      </Button>
                    )}
                  </Stack>
                </Box>
                <Collapse in={showAdvancedSettings} mountOnEnter unmountOnExit>
                  <Stack direction="row" spacing={1}>
                    <Stack direction="column" spacing={1}>
                      <SelectSmall
                        label={keyword(
                          "semantic_search_form_search_engine_placeholder",
                        )}
                        items={searchEngineModes}
                        value={searchEngineMode}
                        key={searchEngineMode}
                        setValue={setSearchEngineMode}
                        disabled={isLoading}
                        minWidth={275}
                      />
                      <Link
                        onClick={handleOpenSearchEngineModal}
                        sx={{ cursor: "pointer" }}
                      >
                        {keyword(
                          "semantic_search_search_engine_tip_link_placeholder",
                        )}
                      </Link>
                      <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={openSearchEngineModal}
                        onClose={handleCloseSearchEngineModal}
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                          backdrop: {
                            timeout: 500,
                          },
                        }}
                      >
                        <Fade in={openSearchEngineModal}>
                          <Box sx={searchEngineModalStyle}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography
                                id="transition-modal-title"
                                variant="subtitle2"
                                style={{
                                  color: "#00926c",
                                  fontSize: "24px",
                                }}
                              >
                                {keyword(
                                  "semantic_search_search_engine_tip_title",
                                )}
                              </Typography>
                              <IconButton
                                variant="outlined"
                                aria-label="close popup"
                                onClick={handleCloseSearchEngineModal}
                              >
                                <Close />
                              </IconButton>
                            </Stack>
                            <Stack
                              id="transition-modal-description"
                              direction="column"
                              spacing={2}
                              mt={2}
                            >
                              {searchEngineModes.map((searchEngine, index) => {
                                return (
                                  <Stack direction="column" key={index}>
                                    <Typography variant="subtitle1">
                                      {searchEngine.name}
                                    </Typography>
                                    <Alert severity="info" icon={false}>
                                      {searchEngine.description}
                                    </Alert>
                                  </Stack>
                                );
                              })}
                            </Stack>
                          </Box>
                        </Fade>
                      </Modal>
                    </Stack>

                    <DatePicker
                      label={keyword(
                        "semantic_search_form_date_from_placeholder",
                      )}
                      value={dateFrom}
                      onChange={(newDate) => setDateFrom(dayjs(newDate))}
                      slotProps={{
                        field: { clearable: true },
                      }}
                      disabled={isLoading}
                    />
                    <DatePicker
                      label={keyword(
                        "semantic_search_form_date_to_placeholder",
                      )}
                      value={dateTo}
                      onChange={(newDate) => {
                        setDateTo(newDate);
                      }}
                      slotProps={{
                        field: { clearable: true },
                      }}
                      disabled={isLoading}
                    />
                    <CheckboxesTags
                      label={keyword(
                        "semantic_search_form_language_filter_placeholder",
                      )}
                      placeholder={
                        languageFilter.length > 0
                          ? ""
                          : keyword(
                              "semantic_search_form_language_filter_placeholder",
                            )
                      }
                      value={languageFilter}
                      setValue={setLanguageFilter}
                      options={languagesList}
                      disabled={isLoading}
                    />
                  </Stack>
                </Collapse>
              </Stack>
            </form>
          </Box>
        </Card>

        {errorMessage && (
          <Box>
            <Fade in={!!errorMessage} timeout={750}>
              <Alert severity="error">{errorMessage}</Alert>
            </Fade>
          </Box>
        )}
        {displaySearchResults()}
      </Stack>
    </Box>
  );
};

export default SemanticSearch;
