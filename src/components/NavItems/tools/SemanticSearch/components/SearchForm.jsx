import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import AdvancedSettingsContainer from "@Shared/AdvancedSettingsContainer";
import DateAndTimePicker from "@Shared/DateTimePicker/DateAndTimePicker";
import dayjs from "dayjs";

import CheckboxesTags from "./CheckboxesTags";
import SearchEngineModal from "./SearchEngineModal";
import SelectSmall from "./SelectSmall";

/**
 * SearchForm component for semantic search input and advanced settings
 */
const SearchForm = ({
  searchString,
  setSearchString,
  searchEngineMode,
  setSearchEngineMode,
  searchEngineModes,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  languageFilter,
  setLanguageFilter,
  languagesList,
  showAdvancedSettings,
  setShowAdvancedSettings,
  showResetAdvancedSettings,
  resetSearchSettings,
  handleSubmit,
  isPending,
  keyword,
}) => {
  return (
    <Card variant="outlined">
      <Box sx={{ p: 4 }}>
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
                label={keyword("semantic_search_form_textfield_placeholder")}
                placeholder={keyword(
                  "semantic_search_form_textfield_placeholder",
                )}
                multiline
                minRows={2}
                variant="outlined"
                disabled={isPending}
                onChange={(e) => {
                  setSearchString(e.target.value);
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isPending || !searchString}
                loading={isPending}
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
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="column" spacing={1}>
                    <SelectSmall
                      label={keyword(
                        "semantic_search_form_search_engine_placeholder",
                      )}
                      items={searchEngineModes}
                      value={searchEngineMode}
                      key={searchEngineMode}
                      setValue={setSearchEngineMode}
                      disabled={isPending}
                      // minWidth={275}
                    />
                    <SearchEngineModal
                      searchEngineModes={searchEngineModes}
                      keyword={keyword}
                    />
                  </Stack>
                </Grid>
                <Grid size="auto">
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1}
                    sx={{ width: "100%" }}
                  >
                    <DateAndTimePicker
                      time={false}
                      disabled={isPending}
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
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
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
                    disabled={isPending}
                  />
                </Grid>
              </Grid>
            </AdvancedSettingsContainer>
          </Stack>
        </form>
      </Box>
    </Card>
  );
};

export default SearchForm;
