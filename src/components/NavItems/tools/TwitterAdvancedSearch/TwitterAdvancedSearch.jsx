import { Box } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useInput } from "../../../../Hooks/useInput";
import { createUrl } from "./createUrl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import DateTime from "../../../Shared/DateTimePicker/DateTime";
import useMyStyles, {
  myCardStyles,
} from "../../../Shared/MaterialUiStyles/useMyStyles";
import {
  //trackEvent,
  getclientId,
} from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import TwitterAdvancedSearchIcon from "../../../NavBar/images/SVG/Search/Twitter_search.svg";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const TwitterAdvancedSearch = () => {
  const classes = useMyStyles();
  const cardClasses = myCardStyles();
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/TwitterAdvancedSearch",
  );
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
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
  const [fromDateError, setSelectedFromDateError] = useState(false);
  ``;
  const [toDate, setSelectedToDate] = useState(null);
  const [toDateError, setSelectedToDateError] = useState(false);

  const handleFromDateChange = (date) => {
    setSelectedFromDateError(date === null);
    if (toDate && date > toDate) setSelectedFromDateError(true);
    setSelectedFromDate(date);
  };

  const handleToDateChange = (date) => {
    setSelectedToDateError(date === null);
    if (fromDate && date < fromDate) setSelectedToDateError(true);
    setSelectedToDate(date);
  };

  const pastDate = (currentDate) => {
    const itemDate = currentDate.toDate();
    if (fromDate) return fromDate > itemDate;
    return false;
  };

  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.email : null;
  const client_id = getclientId();
  const [eventUrl, setEventUrl] = useState(undefined);

  useTrackEvent(
    "submission",
    "twitter_advance_search",
    "search twitter request",
    eventUrl,
    client_id,
    eventUrl,
    uid,
  );
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
      localTime,
    );
    if (toDateError === false && fromDateError === false) {
      setEventUrl(url);
      window.open(url);
      /*trackEvent(
      "submission",
      "twitter_advance_search",
      "search twitter request",
      url,
      client_id,
      uid
    );*/
    }
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_twitter")}
        description={keywordAllTools("navbar_twitter_description")}
        icon={
          <TwitterAdvancedSearchIcon
            style={{ fill: "#00926c" }}
            width="40px"
            height="40px"
          />
        }
      />
      <Alert severity="warning">{keyword("warning_x_search")}</Alert>
      <Box mt={3} />
      <Card className={cardClasses.root}>
        <CardHeader
          title={keyword("cardheader_parameters")}
          className={classes.headerUploadedImage}
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
              label={keyword("twitter_from_date")}
              dateFormat={"YYYY-MM-DD"}
              timeFormat={"HH:mm:ss"}
              handleChange={handleFromDateChange}
              error={fromDateError}
              value={fromDate}
            />
          </div>
          <div>
            <DateTime
              input={true}
              label={keyword("twitter_to_date")}
              dateFormat={"YYYY-MM-DD"}
              timeFormat={"HH:mm:ss"}
              handleChange={handleToDateChange}
              error={toDateError}
              value={toDate}
              shouldDisableDate={pastDate}
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
