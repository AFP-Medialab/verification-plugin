import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";

import DateAndTimePicker from "@Shared/DateTimePicker/DateAndTimePicker";

import CheckboxesTags from "../../SemanticSearch/components/CheckboxesTags";
import { FILTER_KEYS } from "../api/fetchFilters";
import { toFilterValueKey } from "../utils/cimpleUtils";

const initialSelected = () =>
  Object.fromEntries(FILTER_KEYS.map((k) => [k, []]));

const CimpleSearchForm = ({
  filterOptions,
  filtersLoading,
  isPending,
  handleSubmit,
  keyword,
}) => {
  const [text, setText] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selected, setSelected] = useState(initialSelected);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = Object.values(selected).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );
  const clearFilters = () => setSelected(initialSelected());
  const setFilter = (key) => (value) =>
    setSelected((prev) => ({ ...prev, [key]: value }));

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ text, fromDate, toDate, selectedFilters: selected });
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={2}>
        <TextField
          label={keyword("cimple_text_search")}
          fullWidth
          value={text}
          disabled={isPending}
          onChange={(e) => setText(e.target.value)}
        />
        <DateAndTimePicker
          time={false}
          disabled={isPending}
          keywordFromDate={keyword("cimple_from_date")}
          keywordUntilDate={keyword("cimple_to_date")}
          fromValue={fromDate}
          untilValue={toDate}
          handleSinceChange={setFromDate}
          handleUntilChange={setToDate}
        />
        <Accordion
          expanded={filtersOpen}
          onChange={(_, expanded) => setFiltersOpen(expanded)}
          disableGutters
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "4px !important",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ flex: 1, mr: 1 }}
            >
              <TuneIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {keyword("cimple_advanced_filters")}
              </Typography>
              {activeFilterCount > 0 && (
                <Chip
                  label={activeFilterCount}
                  size="small"
                  color="primary"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {FILTER_KEYS.map((key) => (
                <CheckboxesTags
                  key={key}
                  value={selected[key]}
                  setValue={setFilter(key)}
                  options={(filterOptions[key] ?? []).map((opt) => ({
                    ...opt,
                    title: keyword(
                      `cimple_${key}_${toFilterValueKey(opt.code)}`,
                      {
                        defaultValue: opt.title,
                      },
                    ),
                  }))}
                  label={keyword(`cimple_filter_${key}`)}
                  disabled={filtersLoading || isPending}
                />
              ))}
              {activeFilterCount > 0 && (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button size="small" color="inherit" onClick={clearFilters}>
                    {keyword("cimple_clear_filters")}
                  </Button>
                </Box>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Box>
          <Button
            variant="contained"
            color="primary"
            loading={isPending}
            disabled={isPending}
            type="submit"
          >
            {keyword("button_submit")}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default CimpleSearchForm;
