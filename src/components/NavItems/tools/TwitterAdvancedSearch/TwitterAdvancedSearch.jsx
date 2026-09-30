import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";

import { useTrackEvent } from "@/Hooks/useAnalytics";
import { useInputWithPersistence } from "@/Hooks/useInput";
import { canUserSeeTool, newSna, searchTwitter } from "@/constants/tools";
import DateAndTimePicker from "@Shared/DateTimePicker/DateAndTimePicker";
import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import HeaderTool from "@Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import useMyStyles, {
  myCardStyles,
} from "@Shared/MaterialUiStyles/useMyStyles";
import dayjs from "dayjs";

import { RecordingWindow, getRecordingInfo } from "../SNA/components/Recording";
import { createUrl } from "./createUrl";

const TwitterAdvancedSearch = () => {
  const classes = useMyStyles();
  const cardClasses = myCardStyles();
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/TwitterAdvancedSearch",
  );
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordNewSna = i18nLoadNamespace("components/NavItems/tools/NewSNA");

  const term = useInputWithPersistence("", "tw_search_term");
  const account = useInputWithPersistence("", "tw_search_account");
  const filter = useInputWithPersistence("", "tw_search_filter");
  const tweetLang = useInputWithPersistence("", "tw_search_lang");
  const geocode = useInputWithPersistence("", "tw_search_geocode");
  const near = useInputWithPersistence("", "tw_search_near");
  const within = useInputWithPersistence("", "tw_search_within");
  const [localTime, setLocalTime] = useState(() => {
    return sessionStorage.getItem("tw_search_localtime") || "true";
  });

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

  const [fromDate, setSelectedFromDate] = useState(() => {
    const saved = sessionStorage.getItem("tw_search_from_date");
    return saved ? dayjs(saved) : null;
  });
  const [fromDateError, setSelectedFromDateError] = useState(false);

  const [toDate, setSelectedToDate] = useState(() => {
    const saved = sessionStorage.getItem("tw_search_to_date");
    return saved ? dayjs(saved) : null;
  });
  const [toDateError, setSelectedToDateError] = useState(false);

  useEffect(() => {
    if (fromDate)
      sessionStorage.setItem("tw_search_from_date", fromDate.toISOString());
    else sessionStorage.removeItem("tw_search_from_date");
  }, [fromDate]);

  useEffect(() => {
    if (toDate)
      sessionStorage.setItem("tw_search_to_date", toDate.toISOString());
    else sessionStorage.removeItem("tw_search_to_date");
  }, [toDate]);

  useEffect(() => {
    sessionStorage.setItem("tw_search_localtime", localTime);
  }, [localTime]);

  const handleFromDateChange = (date) => {
    setSelectedFromDateError(date === null);
    if (toDate && date > toDate) setSelectedFromDateError(true);
    setSelectedFromDate(dayjs(date));
  };

  const handleToDateChange = (date) => {
    setSelectedToDateError(date === null);
    if (fromDate && date < fromDate) setSelectedToDateError(true);
    setSelectedToDate(dayjs(date));
  };

  const handleReset = () => {
    term.setValue("");
    account.setValue("");
    filter.setValue("");
    tweetLang.setValue("");
    geocode.setValue("");
    near.setValue("");
    within.setValue("");
    setSelectedFromDate(null);
    setSelectedToDate(null);
    setLocalTime("true");

    const keys = [
      "tw_search_term",
      "tw_search_account",
      "tw_search_filter",
      "tw_search_lang",
      "tw_search_geocode",
      "tw_search_near",
      "tw_search_within",
      "tw_search_from_date",
      "tw_search_to_date",
      "tw_search_localtime",
    ];
    keys.forEach((key) => localStorage.removeItem(key));
  };

  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;
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
    }
  };

  //SNA Recording props
  const [recording, setRecording] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [collections, setCollections] = useState(["Default Collection"]);
  const [selectedCollection, setSelectedCollection] =
    useState("Default Collection");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedSocialMedia, setSelectedSocialMedia] = useState([]);
  const userRoles = useSelector((state) => state.userSession.user.roles);
  const isUserAuthenticated = useSelector(
    (state) => state.userSession.userAuthenticated,
  );

  useEffect(() => {
    if (!canUserSeeTool(newSna, userRoles, isUserAuthenticated)) {
      return;
    }

    getRecordingInfo(setCollections, setRecording, setSelectedCollection);
  }, []);

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_twitter")}
        description={keywordAllTools("navbar_twitter_description")}
        icon={
          <searchTwitter.icon
            sx={{ fill: "var(--mui-palette-primary-main)", fontSize: "40px" }}
          />
        }
      />
      <Alert severity="warning">{keyword("warning_x_search")}</Alert>
      <Box
        sx={{
          mt: 3,
        }}
      />
      <Card variant="outlined" className={cardClasses.root}>
        <CardHeader
          title={keyword("cardheader_parameters")}
          className={classes.headerUploadedImage}
        />

        <div className={classes.root2}>
          {canUserSeeTool(newSna, userRoles, isUserAuthenticated) && (
            <RecordingWindow
              recording={recording}
              setRecording={setRecording}
              expanded={expanded}
              setExpanded={setExpanded}
              selectedCollection={selectedCollection}
              setSelectedCollection={setSelectedCollection}
              collections={collections}
              setCollections={setCollections}
              newCollectionName={newCollectionName}
              setNewCollectionName={setNewCollectionName}
              selectedSocialMedia={selectedSocialMedia}
              setSelectedSocialMedia={setSelectedSocialMedia}
              keyword={keywordNewSna}
            />
          )}
          {largeInputList.map((value, key) => {
            const { setValue, ...inputProps } = value.props;
            return (
              <TextField
                key={key}
                id="standard-full-width"
                label={keyword(value.label)}
                style={{ margin: 8 }}
                fullWidth
                {...inputProps}
                data-testid={`twitter-search-${key}`}
              />
            );
          })}
          <div>
            <DateAndTimePicker
              time={true}
              disabled={false}
              keywordFromDate={keyword("twitter_from_date")}
              keywordUntilDate={keyword("twitter_to_date")}
              fromValue={fromDate}
              untilValue={toDate}
              handleSinceChange={handleFromDateChange}
              handleUntilChange={handleToDateChange}
              sinceTestId="twitter-since-date"
              untilTestId="twitter-until-date"
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
                data-testid="twitter-radio-local"
              />
              <FormControlLabel
                value={"false"}
                control={<Radio color="primary" />}
                label={keyword("twitter_gmt")}
                labelPlacement="end"
                data-testid="twitter-radio-gmt"
              />
            </RadioGroup>
          </FormControl>
          <Box sx={{ m: 2, display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onSubmit}
              data-testid="twitter-submit"
            >
              {keyword("button_submit")}
            </Button>

            <Button variant="outlined" color="primary" onClick={handleReset}>
              {keyword("button_reset")}
            </Button>
          </Box>
        </div>
      </Card>
    </div>
  );
};
export default TwitterAdvancedSearch;
