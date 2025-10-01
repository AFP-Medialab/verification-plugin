import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Close, ManageSearch } from "@mui/icons-material";

import AdvancedSettingsContainer from "@Shared/AdvancedSettingsContainer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { getLanguageName } from "@Shared/Utils/languageUtils";
import DateAndTimePicker from "components/Shared/DateTimePicker/DateAndTimePicker";
import dayjs from "dayjs";
import isEqual from "lodash/isEqual";

import languageDictionary from "../../../../LocalDictionary/iso-639-1-languages";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import SemanticSearchResults from "./SemanticSearchResults";
import { useRetrieveFactChecks } from "./api";
import CheckboxesTags from "./components/CheckboxesTags";
import SelectSmall from "./components/SelectSmall";

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
      if (uri === "assistantText" && text) {
        text = text.replaceAll("\n", " ");
        setSearchString(text);
        handleSubmit(text);
      }
    }
  }, [url, text]);

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
      //   TODO: Handle Error
      setErrorMessage(e.message);
    }
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
        <Card variant="outlined">
          <Box
            sx={{
              p: 4,
            }}
          >
            <form>
              <Stack spacing={4}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
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
                    disabled={retrieveFactChecksMutation.isPending}
                    onChange={(e) => {
                      setSearchString(e.target.value);
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={
                      retrieveFactChecksMutation.isPending || !searchString
                    }
                    loading={retrieveFactChecksMutation.isPending}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    {keyword("semantic_search_form_submit_button")}
                  </Button>
                </Stack>
                <AdvancedSettingsContainer
                  showAdvancedSettings={showAdvancedSettings}
                  setShowAdvancedSettings={setShowAdvancedSettings}
                  showResetAdvancedSettings={showResetAdvancedSettings}
                  resetSearchSettings={resetSearchSettings}
                  keywordFn={keyword}
                  keywordShow={"semantic_search_show_advanced_settings_button"}
                  keywordHide={"semantic_search_hide_advanced_settings_button"}
                  keywordReset={"semantic_search_reset_search_settings_button"}
                >
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
                        disabled={retrieveFactChecksMutation.isPending}
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
                              spacing={2}
                              sx={{
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                id="transition-modal-title"
                                variant="subtitle2"
                                sx={{
                                  color: "var(--mui-palette-primary-main)",
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
                              sx={{
                                mt: 2,
                              }}
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
                    <DateAndTimePicker
                      time={false}
                      disabled={retrieveFactChecksMutation.isPending}
                      keywordFromDate={keyword(
                        "semantic_search_form_date_from_placeholder",
                      )}
                      keywordUntilDate={keyword(
                        "semantic_search_form_date_to_placeholder",
                      )}
                      fromValue={dateFrom}
                      untilValue={dateTo}
                      handleSinceChange={(newDate) =>
                        setDateFrom(dayjs(newDate))
                      }
                      handleUntilChange={(newDate) => setDateTo(dayjs(newDate))}
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
                      disabled={retrieveFactChecksMutation.isPending}
                    />
                  </Stack>
                </AdvancedSettingsContainer>
              </Stack>
            </form>
          </Box>
        </Card>

        {(errorMessage || retrieveFactChecksMutation.error) && (
          <Box>
            <Fade
              in={!!(errorMessage || retrieveFactChecksMutation.error)}
              timeout={750}
            >
              <Alert severity="error">
                {errorMessage || retrieveFactChecksMutation.error?.message}
              </Alert>
            </Fade>
          </Box>
        )}
        {displaySearchResults()}
      </Stack>
    </Box>
  );
};

export default SemanticSearch;
