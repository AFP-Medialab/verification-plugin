import { Box } from "@mui/material";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useInput } from "../../../../Hooks/useInput";
import { createUrl } from "./createUrl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import DateTime from "../../../Shared/DateTimePicker/DateTime";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/TwitterAdvancedSearch.tsv";
import tsvAllTools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import useMyStyles, {
  myCardStyles,
} from "../../../Shared/MaterialUiStyles/useMyStyles";
import {
  trackEvent,
  getclientId,
} from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import TwitterAdvancedSearchIcon from "../../../NavBar/images/SVG/Search/Twitter_search.svg";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
//import { StylesProvider } from "@mui/material/styles";

const TwitterAdvancedSearch = () => {
  const classes = useMyStyles();
  const cardClasses = myCardStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/TwitterAdvancedSearch.tsv",
    tsv
  );
  const keywordAllTools = useLoadLanguage(
    "components/NavItems/tools/Alltools.tsv",
    tsvAllTools
  );

  const term = useInput("");
  const account = useInput("");
  const filter = useInput("");
  const tweetLang = useInput("");
  const geocode = useInput("");
  const near = useInput("");
  const within = useInput("");
  const [localTime, setLocalTime] = useState("true");

  const largeInputList = [
    {
      label: "twitter_termbox",
      props: term,
    },
    {
      label: "twitter_tw-account",
      props: account,
    },
    {
      label: "twitter_filter",
      props: filter,
    },
    {
      label: "twitter_lang",
      props: tweetLang,
    },
    {
      label: "twitter_geocode",
      props: geocode,
    },
    {
      label: "twitter_near",
      props: near,
    },
    {
      label: "twitter_within",
      props: within,
    },
  ];

  const [fromDate, setSelectedFromDate] = useState(null);
  const [fromDatError, setSelectedFromDateError] = useState(false);

  const handleFromDateChange = (date) => {
    setSelectedFromDateError(date === null);
    if (toDate && date >= toDate) setSelectedFromDateError(true);
    setSelectedFromDate(date);
  };

  const fromDateIsValid = (momentDate) => {
    const itemDate = momentDate.toDate();
    const currentDate = new Date();
    if (toDate) return itemDate <= currentDate && itemDate < toDate;
    return itemDate <= currentDate;
  };
  const [toDate, setSelectedToDate] = useState(null);
  const [toDateError, setSelectedToDateError] = useState(null);

  const handleToDateChange = (date) => {
    setSelectedToDateError(date === null);
    if (fromDate && date <= fromDate) setSelectedToDateError(true);
    setSelectedToDate(date);
  };

  const toDateIsValid = (momentDate) => {
    const itemDate = momentDate.toDate();
    const currentDate = new Date();
    if (fromDate) return itemDate <= currentDate && fromDate < itemDate;
    return itemDate <= currentDate;
  };
  const client_id = getclientId();

  const onSubmit = () => {
    let url = createUrl(
      term.value,
      account.value,
      filter.value,
      tweetLang.value,
      geocode.value,
      near.value,
      within.value,
      fromDate,
      toDate,
      localTime
    );
    trackEvent(
      "submission",
      "twitter_advance_search",
      "search twitter request",
      url,
      client_id
    );
    window.open(url);
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_twitter")}
        description={keywordAllTools("navbar_twitter_description")}
        icon={
          <TwitterAdvancedSearchIcon
            style={{ fill: "#51A5B2" }}
            width="40px"
            height="40px"
          />
        }
      />

      <Card className={cardClasses.root}>
        <CardHeader
          title={keyword("cardheader_parameters")}
          className={classes.headerUpladedImage}
        />
        <div className={classes.root2}>
          {largeInputList.map((value, key) => {
            return (
              <TextField
                key={key}
                id="standard-full-width"
                label={keyword(value.label)}
                style={{ margin: 8 }}
                placeholder={"ex : (need tsv changes)"}
                fullWidth
                {...value.props}
              />
            );
          })}
          <div>
            <DateTime
              input={true}
              isValidDate={fromDateIsValid}
              label={keyword("twitter_from_date")}
              dateFormat={"YYYY-MM-DD"}
              timeFormat={"HH:mm:ss"}
              handleChange={handleFromDateChange}
              error={fromDatError}
              value={fromDate}
            />
          </div>
          <div>
            <DateTime
              input={true}
              isValidDate={toDateIsValid}
              label={keyword("twitter_to_date")}
              dateFormat={"YYYY-MM-DD"}
              timeFormat={"HH:mm:ss"}
              handleChange={handleToDateChange}
              error={toDateError}
              value={toDate}
            />
          </div>

          <FormControl component="fieldset">
            <RadioGroup
              aria-label="position"
              name="position"
              value={localTime}
              onChange={(e) => setLocalTime(e.target.value)}
              row
            >
              <FormControlLabel
                value={"true"}
                control={<Radio color="primary" />}
                label={keyword("twitter_local_time")}
                labelPlacement="end"
              />
              <FormControlLabel
                value={"false"}
                control={<Radio color="primary" />}
                label={keyword("twitter_gmt")}
                labelPlacement="end"
              />
            </RadioGroup>
          </FormControl>
          <Box m={2} />
          <Button variant="contained" color="primary" onClick={onSubmit}>
            {keyword("button_submit")}
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default TwitterAdvancedSearch;