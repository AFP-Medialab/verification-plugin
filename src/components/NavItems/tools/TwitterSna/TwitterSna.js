import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../../../redux/actions/errorActions";

import dateFormat from "dateformat";
import _ from "lodash";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Box from "@material-ui/core/Box";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import SearchIcon from '@material-ui/icons/Search';

import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import DateTimePicker from "../../../Shared/DateTimePicker/DateTimePicker";
import convertToGMT from "../../../Shared/DateTimePicker/convertToGMT";
import useTwitterSnaRequest from "./Hooks/useTwitterSnaRequest";
import TwitterSnaResult from "./Results/TwitterSnaResult";
import { replaceAll } from "../TwitterAdvancedSearch/createUrl";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/TwitterSna.tsv";
import { submissionEvent } from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import AuthenticationCard from "../../../Shared/Authentication/AuthenticationCard";


const TwitterSna = () => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage("components/NavItems/tools/TwitterSna.tsv", tsv);

  const request = useSelector(state => state.twitterSna.request);
  // console.log("Redux request: ", request);
  const reduxResult = useSelector(state => state.twitterSna.result);

  const isLoading = useSelector(state => state.twitterSna.loading);
  const loadingMessage = useSelector(state => state.twitterSna.loadingMessage);

  // Authentication Redux state
  const userAuthenticated = useSelector(state => state.userSession && state.userSession.userAuthenticated);

  const dispatch = useDispatch();

  // Component state (default sample values if not authenticated)
  const [keyWords, setKeywords] = useState(
    userAuthenticated ?
      (
        request && request.keywordList ?
          request.keywordList.join(" ") :
          ""
      ) :
      "\"fake news\""
  );
  const [keyWordsError, setKeyWordsError] = useState(false);
  const [bannedWords, setBannedWords] = useState(
    request && request.bannedWords ?
      request.bannedWords.join(" ") :
      ""
  );
  const [usersInput, setUsersInput] = useState(
    userAuthenticated ?
      (
        request && request.userList ?
          request.userList.join(" ") :
          ""
      ) :
      "@realDonaldTrump"
  );
  const [since, setSince] = useState(
    userAuthenticated ?
      (
        request ?
          request.from :
          null
      ) :
      new Date("2016-12-10T00:00:00")
  );
  const [sinceError, setSinceError] = useState(false);
  const [until, setUntil] = useState(
    userAuthenticated ?
      (
        request ?
          request.until :
          null
      ) :
      new Date("2020-01-01T00:00:00")
  );
  const [untilError, setUntilError] = useState(false);
  const [langInput, setLangInput] = useState(
    userAuthenticated ?
      (
        request && request.lang ?
          "lang_" + request.lang :
          "lang_all"
      ) :
      "lang_en"
  );
  const [openLangInput, setLangInputOpen] = React.useState(false);
  const [filters, setFilers] = useState(
    request && request.media ?
      request.media :
      "none"
  );
  const [verifiedUsers, setVerifiedUsers] = useState(
    request && request.verified ?
      request.verified :
      "false"
  );
  const [localTime, setLocalTime] = useState("true");

  // Form disabled?
  const searchFormDisabled = isLoading || !userAuthenticated;

  const handleErrors = (e) => {
    dispatch(setError(e));
  };

  function stringToList(string) {
    let newStr = string.replace(/@/g, " ");
    let res = newStr.split(" ");
    return res.filter(function (el) {
      return el !== "";
    });
  }

  const makeRequestParams = (keywordsP, bannedWordsP, usersInputP, sinceP, untilP, localTimeP, langInputP, filtersP, verifiedUsersP) => {
    //Creating Request Object.
    const removeQuotes = (list) => {
      let res = [];
      !_.isNil(list) &&
        list.map(string => {
          res.push(replaceAll(string, "\"", ""));
        });
      return res;
    };

    let trimedKeywords = !_.isNil(keywordsP) ? removeQuotes(keywordsP.trim().match(/("[^"]+"|[^"\s]+)/g)) : [];

    let trimedBannedWords = null;
    if (!_.isNil(bannedWordsP) && bannedWordsP.trim() !== "")
      trimedBannedWords = removeQuotes(bannedWordsP.trim().match(/("[^"]+"|[^"\s]+)/g));

    const newFrom = (localTimeP === "false") ? convertToGMT(sinceP) : sinceP;
    const newUntil = (localTimeP === "false") ? convertToGMT(untilP) : untilP;

    return {
      "keywordList": trimedKeywords,
      "bannedWords": trimedBannedWords,
      "lang": (langInputP === "lang_all") ? null : langInputP.replace("lang_", ""),
      "userList": stringToList(usersInputP),
      "from": dateFormat(newFrom, "yyyy-mm-dd HH:MM:ss"),
      "until": dateFormat(newUntil, "yyyy-mm-dd HH:MM:ss"),
      "verified": String(verifiedUsersP) === "true",
      "media": (filtersP === "none") ? null : filtersP,
      "retweetsHandling": null
    };
  };

  const makeRequest = () => {
    return makeRequestParams(keyWords, bannedWords, usersInput, since, until, localTime, langInput, filters, verifiedUsers);
  };

  const sinceDateIsValid = (momentDate) => {
    const itemDate = momentDate.toDate();
    const currentDate = new Date();
    if (until)
      return itemDate <= currentDate && itemDate < until;
    return itemDate <= currentDate;
  };

  const handleSinceDateChange = (date) => {
    setSinceError(date === null);
    if (until && date >= until)
      setSinceError(true);
    setSince(date);
  };

  const untilDateIsValid = (momentDate) => {
    const itemDate = momentDate.toDate();
    const currentDate = new Date();
    if (since)
      return itemDate <= currentDate && since < itemDate;
    return itemDate <= currentDate;
  };


  const handleUntilDateChange = (date) => {
    setUntilError(date === null);
    if (since && date < since)
      setUntilError(true);
    setUntil(date);
  };

  const handleFiltersChange = event => {
    setFilers(event.target.value);
  };

  const handleVerifiedUsersChange = event => {
    setVerifiedUsers(event.target.value);
  };

  const onSubmit = () => {
    //Mandatory Fields errors
    if (keyWords.trim() === "") {
      handleErrors(keyword("twitterStatsErrorMessage"));
      setKeyWordsError(true);
      return;
    }
    if (since === null || since === "") {
      handleErrors(keyword("twitterStatsErrorMessage"));
      setSince("");
      return;
    }
    if (until === null || until === "") {
      handleErrors(keyword("twitterStatsErrorMessage"));
      setUntil("");
      return;
    }
    let newRequest = makeRequest();

    // console.log("Submit, newRequest: ", newRequest);
    if (JSON.stringify(newRequest) !== JSON.stringify(request)) {
      submissionEvent(JSON.stringify(newRequest));
      setSubmittedRequest(newRequest);
    }
  };

  // const [submittedRequest, setSubmittedRequest] = useState(null);
  const [submittedRequest, setSubmittedRequest] = useState(
    userAuthenticated ?
      null :
      makeRequest()
  );
  useTwitterSnaRequest(submittedRequest);

  // Reset form & result when user login
  useEffect(() => {
    // console.log("Auth change (authenticated: ", userAuthenticated, "), updating fields");

    setKeywords(userAuthenticated ?
      "" :
      "\"fake news\""
    );
    setBannedWords("");
    setUsersInput(userAuthenticated ?
      "" :
      "@realDonaldTrump"
    );
    setSince(userAuthenticated ?
      null :
      new Date("2016-12-10T00:00:00")
    );
    setUntil(userAuthenticated ?
      null :
      new Date("2020-01-01T00:00:00")
    );
    setLocalTime("true");
    setLangInput(userAuthenticated ?
      "lang_all" :
      "lang_en"
    );
    setFilers("none");
    setVerifiedUsers("false");

    const newSubmittedRequest = makeRequestParams(
      userAuthenticated ?
        "" :
        "\"fake news\"",
      "",
      userAuthenticated ?
        "" :
        "@realDonaldTrump",
      userAuthenticated ?
        null :
        new Date("2016-12-10T00:00:00"),
      userAuthenticated ?
        null :
        new Date("2020-01-01T00:00:00"),
      "true",
      userAuthenticated ?
        "lang_all" :
        "lang_en",
      "none",
      "false"
    );
    // console.log("Updating submittedRequest: ", newSubmittedRequest);
    setSubmittedRequest(newSubmittedRequest);
  }, [userAuthenticated]);

  return (
    <div>
      <Paper className={classes.root}>
        <CustomTile text={keyword("twitter_sna_title")} />

        <AuthenticationCard />

        <Box m={3} />
        <TextField
          disabled={searchFormDisabled}
          error={keyWordsError}
          value={keyWords}
          onChange={e => {
            setKeywords(e.target.value);
            setKeyWordsError(false);
          }}
          id="standard-full-width"
          label={'*  ' + keyword("twitter_sna_search")}
          className={classes.neededField}
          style={{ margin: 8 }}
          placeholder={"#example"}
          fullWidth
        />
        <TextField
          disabled={searchFormDisabled}
          value={bannedWords}
          onChange={e => setBannedWords(e.target.value)}
          id="standard-full-width"
          label={keyword("twitter_sna_not")}
          style={{ margin: 8 }}
          placeholder={"word word2"}
          fullWidth
        />
        <TextField
          disabled={searchFormDisabled}
          value={usersInput}
          onChange={e => setUsersInput(e.target.value)}
          id="standard-full-width"
          label={keyword("twitter_sna_user")}
          style={{ margin: 8 }}
          placeholder={keyword("user_placeholder")}
          fullWidth
        />
        <Grid container justify={"center"} spacing={4} className={classes.grow}>
          <Grid item>
            <DateTimePicker
              disabled={searchFormDisabled}
              input={true}
              isValidDate={sinceDateIsValid}
              label={'*  ' + keyword("twitter_sna_from_date")}
              className={classes.neededField}
              dateFormat={"YYYY-MM-DD"}
              timeFormat={"HH:mm:ss"}
              value={since}
              handleChange={handleSinceDateChange}
              error={sinceError}
            />
          </Grid>
          <Grid item>
            <DateTimePicker
              disabled={searchFormDisabled}
              input={true}
              isValidDate={untilDateIsValid}
              label={'*  ' + keyword("twitter_sna_until_date")}
              className={classes.neededField}
              dateFormat={"YYYY-MM-DD"}
              timeFormat={"HH:mm:ss"}
              value={until}
              handleChange={handleUntilDateChange}
              error={untilError}
            />
          </Grid>
        </Grid>
        <FormControl component="fieldset"
          disabled={searchFormDisabled}
        >
          <RadioGroup aria-label="position" name="position" value={localTime}
            onChange={e => setLocalTime(e.target.value)} row>
            <FormControlLabel
              value={"true"}
              control={<Radio color="primary" />}
              label={keyword("twitter_local_time")}
              labelPlacement="end"
            />
            <FormControlLabel
              value={"false"}
              control={<Radio color="primary" />}
              label={keyword("twitter_sna_gmt")}
              labelPlacement="end"
            />
          </RadioGroup>
        </FormControl>
        <Box m={2} />
        <Box m={2} />
        <Grid container justify={"space-around"} spacing={5}>
          <Grid item>
            <FormControl component="fieldset"
              disabled={searchFormDisabled}
            >
              <FormLabel component="legend">{keyword("twitter_sna_media")}</FormLabel>
              <RadioGroup aria-label="position" name="position" value={filters}
                onChange={handleFiltersChange}
                row>
                <FormControlLabel
                  value={"none"}
                  control={<Radio color="primary" />}
                  label={keyword("twitterStats_media_none")}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value={"image"}
                  control={<Radio color="primary" />}
                  label={keyword("twitterStats_media_images")}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value={"video"}
                  control={<Radio color="primary" />}
                  label={keyword("twitterStats_media_videos")}
                  labelPlacement="end"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl component="fieldset"
              disabled={searchFormDisabled}
            >
              <FormLabel component="legend">{keyword("twitter_sna_verified")}</FormLabel>
              <RadioGroup aria-label="position" name="position" value={verifiedUsers}
                onChange={handleVerifiedUsersChange} row>
                <FormControlLabel
                  value={"false"}
                  control={<Radio color="primary" />}
                  label={keyword("twitterStats_verified_no")}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value={"true"}
                  control={<Radio color="primary" />}
                  label={keyword("twitterStats_verified_yes")}
                  labelPlacement="end"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl className={classes.formControl}
              disabled={searchFormDisabled}
            >
              <InputLabel id="demo-controlled-open-select-label">{keyword("lang_choices")}</InputLabel>
              <Select
                labelid="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={openLangInput}
                onClose={() => setLangInputOpen(false)}
                onOpen={() => setLangInputOpen(true)}
                value={langInput}
                onChange={e => setLangInput(e.target.value)}
              >
                <MenuItem value={"lang_all"}>{keyword("lang_all")}</MenuItem>
                <MenuItem value={"lang_fr"}>{keyword("lang_fr")}</MenuItem>
                <MenuItem value={"lang_en"}>{keyword("lang_en")}</MenuItem>
                <MenuItem value={"lang_es"}>{keyword("lang_es")}</MenuItem>
                <MenuItem value={"lang_ar"}>{keyword("lang_ar")}</MenuItem>
                <MenuItem value={"lang_de"}>{keyword("lang_de")}</MenuItem>
                <MenuItem value={"lang_it"}>{keyword("lang_it")}</MenuItem>
                <MenuItem value={"lang_id"}>{keyword("lang_id")}</MenuItem>
                <MenuItem value={"lang_pt"}>{keyword("lang_pt")}</MenuItem>
                <MenuItem value={"lang_ko"}>{keyword("lang_ko")}</MenuItem>
                <MenuItem value={"lang_tr"}>{keyword("lang_tr")}</MenuItem>
                <MenuItem value={"lang_ru"}>{keyword("lang_ru")}</MenuItem>
                <MenuItem value={"lang_nl"}>{keyword("lang_nl")}</MenuItem>
                <MenuItem value={"lang_hi"}>{keyword("lang_hi")}</MenuItem>
                <MenuItem value={"lang_no"}>{keyword("lang_no")}</MenuItem>
                <MenuItem value={"lang_sv"}>{keyword("lang_sv")}</MenuItem>
                <MenuItem value={"lang_fi"}>{keyword("lang_fi")}</MenuItem>
                <MenuItem value={"lang_da"}>{keyword("lang_da")}</MenuItem>
                <MenuItem value={"lang_pl"}>{keyword("lang_pl")}</MenuItem>
                <MenuItem value={"lang_hu"}>{keyword("lang_hu")}</MenuItem>
                <MenuItem value={"lang_fa"}>{keyword("lang_fa")}</MenuItem>
                <MenuItem value={"lang_he"}>{keyword("lang_he")}</MenuItem>
                <MenuItem value={"lang_ur"}>{keyword("lang_ur")}</MenuItem>
                <MenuItem value={"lang_th"}>{keyword("lang_th")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box m={2} />

        <Button variant="contained" color="primary" startIcon={<SearchIcon />}
          onClick={onSubmit}
          disabled={searchFormDisabled || keyWordsError || sinceError || untilError}
        >
          {keyword("button_submit")}
        </Button>

        <Box m={2} />
        <Typography>{loadingMessage}</Typography>
        <LinearProgress hidden={!isLoading} />
      </Paper>
      {
        reduxResult &&
        <TwitterSnaResult result={reduxResult} request={request} />
      }
    </div>);
};
export default TwitterSna;