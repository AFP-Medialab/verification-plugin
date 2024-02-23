import React, { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  Collapse,
  Fade,
  IconButton,
  Skeleton,
  Stack,
} from "@mui/material";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  ManageSearch,
} from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import SemanticSearchResults from "./semanticSearchResults";
import CheckboxesTags from "./components/CheckboxesTags";
import { DatePicker } from "@mui/x-date-pickers";
import SelectSmall from "./components/SelectSmall";
import LoadingButton from "@mui/lab/LoadingButton";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import isEqual from "lodash/isEqual";
import dayjs from "dayjs";
import {
  getLanguageCodeFromName,
  getLanguageName,
} from "../../../Shared/Utils/languageUtils";

const SemanticSearch = () => {
  const supportedLanguages = [
    "ar",
    "bg",
    "bn",
    "ca",
    "cs",
    "cz",
    "da",
    "de",
    "el",
    "en",
    "es",
    "fa",
    "fi",
    "fil",
    "fr",
    "hi",
    "hr",
    "hu",
    "id",
    "it",
    "iw",
    "ko",
    "ky",
    "mk",
    "ml",
    "ms",
    "my",
    "ne",
    "nl",
    "no",
    "pl",
    "pt",
    "ro",
    "ru",
    "sk",
    "sq",
    "sr",
    "ta",
    "te",
    "th",
    "tr",
    "uz",
    "zh",
  ];

  const computeLanguageList = () => {
    const languages = [];
    for (const lg of supportedLanguages) {
      languages.push({ title: getLanguageName(lg) });
    }
    return languages;
  };

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
      name: "Automatic selection",
      description:
        "Automatic selection will analyze the provided input and according to its language and length will automatically select the most appropriate search engine.",
      key: "auto",
    },
    {
      name: "English based semantic search",
      description:
        "An English-based semantic search, where you can search any piece of text (a sentence, a paragraph or even a whole FB / Telegram / Twitter post) for any matching previously fact-checked claim. The input needs to be in English in this case (it can be translated by you from other languages using automatic translation such as Google Translate - if this model will perform well and we will use it  in the production app, we will add automatic translation later).",
      key: "english",
    },
    {
      name: "Multilingual semantic Search",
      description:
        "A Multilingual semantic search, which works the same as the one above, but should be able to work with all common languages, including CEDMO ones, i.e.,  Slovak, Czech, and Polish.",
      key: "multilingual",
    },
    {
      name: "English based keyword search",
      description:
        "Finally, a simple English-based keyword-based search (a standard/baseline engine that can provide good results for shorter inputs and can serve for comparison with previous more advanced models).",
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

  const DEFAULT_SEARCH_ENGINE_MODE = searchEngineModes[0];
  const DEFAULT_DATE_FROM = null;
  const DEFAULT_DATE_TO = null;
  const DEFAULT_LANGUAGE_FILTER = [];

  const [searchString, setSearchString] = useState("");
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

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");

    let searchResults;
    try {
      searchResults = await getFactChecks(searchString, searchEngineMode.key);
    } catch (e) {
      //   TODO: Handle Error
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

    const baseUrl =
      "https://demo-medialab.afp.com/vera-integration/vera/public/kinit/search/q";

    const params = new URLSearchParams();

    params.append("text", searchString);
    params.append("search_method", searchMethod);
    params.append("time_decay", true);
    params.append("limit", 100);

    for (const language of languageFilter) {
      params.append("language", getLanguageCodeFromName(language.title));
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

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <HeaderTool
          name={"Fact Check Semantic Search"}
          description={
            "Search for semantically related fact checks by providing a paragraph of text (e.g., a social media post). The search is multilingual - input text can be in (almost) any language."
          }
          icon={
            <ManageSearch sx={{ fill: "#00926c", width: 40, height: 40 }} />
          }
        />
        <Alert severity="info">
          Tip – this is a semantic search. Use one or more sentences for more
          accurate results.
        </Alert>
        <Card>
          <Box p={3}>
            <form>
              <Stack spacing={6}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <TextField
                    fullWidth
                    value={searchString}
                    label={"Search if already fact-checked"}
                    placeholder={"Search if already fact-checked"}
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
                    Submit
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
                        ? "Hide Advanced Settings"
                        : "Show Advanced settings"}
                    </Button>
                    {showResetAdvancedSettings && (
                      <Button variant="text" onClick={resetSearchSettings}>
                        Reset search settings
                      </Button>
                    )}
                  </Stack>
                </Box>
                <Box>
                  <Collapse in={showAdvancedSettings}>
                    <Stack direction="row" spacing={2}>
                      <Stack direction="column" spacing={1}>
                        <SelectSmall
                          label="Search Engine"
                          items={searchEngineModes}
                          value={searchEngineMode}
                          setValue={setSearchEngineMode}
                          disabled={isLoading}
                          minWidth={275}
                        />
                        <Link
                          onClick={handleOpenSearchEngineModal}
                          sx={{ cursor: "pointer" }}
                        >
                          How to choose?
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
                                  How to choose the search engine?
                                </Typography>
                                <IconButton
                                  variant="outlined"
                                  aria-label="close popup"
                                  onClick={handleCloseSearchEngineModal}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Stack>

                              <Stack
                                id="transition-modal-description"
                                direction="column"
                                spacing={2}
                                mt={2}
                              >
                                {searchEngineModes.map(
                                  (searchEngine, index) => {
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
                                  },
                                )}
                              </Stack>
                            </Box>
                          </Fade>
                        </Modal>
                      </Stack>

                      <DatePicker
                        label="From:"
                        value={dateFrom}
                        onChange={(newDate) => setDateFrom(newDate)}
                        disabled={isLoading}
                      />
                      <DatePicker
                        label="To:"
                        value={dateTo}
                        onChange={(newDate) => {
                          setDateTo(newDate);
                        }}
                        disabled={isLoading}
                      />
                      <CheckboxesTags
                        label="Language filter"
                        placeholder="Languages"
                        value={languageFilter}
                        setValue={setLanguageFilter}
                        options={languagesList}
                        disabled={isLoading}
                      />
                    </Stack>
                  </Collapse>
                </Box>
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
        {/*TODO: Add number of results*/}
        {isLoading ? (
          <Card>
            <Stack direction="column" spacing={4} p={4}>
              <Skeleton variant="rounded" height={40} />
              <Skeleton variant="rounded" width={400} height={40} />
            </Stack>
          </Card>
        ) : searchResults.length === 0 ? (
          <></>
        ) : (
          <SemanticSearchResults searchResults={searchResults} />
        )}
      </Stack>
    </Box>
  );
};

export default SemanticSearch;
