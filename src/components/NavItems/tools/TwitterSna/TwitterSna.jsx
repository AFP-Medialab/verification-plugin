import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../../../redux/actions/errorActions";
import dateFormat from "dateformat";
import _, { get } from "lodash";
import useMyStyles, { myCardStyles } from "../../../Shared/MaterialUiStyles/useMyStyles";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";

import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import Typography from "@mui/material/Typography";

import OnWarningInfo from "../../../Shared/OnClickInfo/OnWarningInfo";
import SearchIcon from "@mui/icons-material/Search";
import DateTime from "../../../Shared/DateTimePicker/DateTime";
import convertToGMT from "../../../Shared/DateTimePicker/convertToGMT";
import useTwitterSnaRequest from "./Hooks/useTwitterSnaRequest";
import { replaceAll } from "../TwitterAdvancedSearch/createUrl";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/TwitterSna.tsv";
import tsvAllTools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
//import { submissionEvent } from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import { trackEvent, getclientId } from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import TwitterSNAIcon from '../../../NavBar/images/SVG/DataAnalysis/Twitter_sna.svg';
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GlobeIcon from '@mui/icons-material/Public';
import ExcludeIcon from '@mui/icons-material/HighlightOff';
import TranslateIcon from '@mui/icons-material/Translate';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
//import DoneIcon from '@mui/icons-material/Done';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import LaptopIcon from '@mui/icons-material/Laptop';


import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const TwitterSna = () => {
  const theme = createTheme({

    components: {

      MuiCardHeader: {
        styleOverrides:{
          root: {
            backgroundColor: "#05A9B4",
            paddingTop: "11px!important",
            paddingBottom: "11px!important",
          },
          title: {
            color: 'white',
            fontSize: "20px!important",
            fontweight: 500,
          }
        }
      
      },

      MuiTab: {
        styleOverrides:{
          wrapper: {
            fontSize: 12,
  
          },
          root: {
            minWidth: "25%!important",
          }
        }
      },

      MuiAccordion: {
        styleOverrides:{
          root: {
            boxShadow: "none",
            '&:before': {
              width: "0px",
            },
            border: "1px solid #51A5B2",
  
          },
          rounded: {
            borderRadius: "15px",
          }
        }
      }

    },

    palette: {
      primary: {
        light: '#5cdbe6',
        main: '#05a9b4',
        dark: '#007984',
        contrastText: '#fff',
      },
    },

  });

  const classes = useMyStyles();
  const cardClasses = myCardStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/TwitterSna.tsv",
    tsv
  );
  const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsvAllTools);

  const request = useSelector((state) => state.twitterSna.request);
  const reduxResult = useSelector((state) => state.twitterSna.result);
  const isLoading = useSelector((state) => state.twitterSna.loading);

  const windowUrl = window.location.href;
  let urlObj = extractUrlSearch(windowUrl);

  const role = useSelector((state) => state.userSession.user.roles);
  const [cache, setCache] = useState(false);
  const [mediaVideo, setMediaVideo] = useState(false);
  const [mediaImage, setMediaImage] = useState(false);
  const langPage = useSelector((state) => state.language);
  // Authentication Redux state
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated
  );

  const dispatch = useDispatch();

  // Component state (default sample values if not authenticated)
  const [keyWords, setKeywords] = useState(
    userAuthenticated
      ? request && request.keywordList
        ? request.keywordList.join(" ")
        : ""
      : ""
  );

  const [keyWordsAny, setKeywordsAny] = useState(
    request && request.keywordAnyList ? request.keywordAnyList.join(" ") : ""
  );

  const [keyWordsError, setKeyWordsError] = useState(false);
  const [keyWordsAnyError, setKeyWordsAnyError] = useState(false);
  const [bannedWords, setBannedWords] = useState(
    request && request.bannedWords ? request.bannedWords.join(" ") : ""
  );
  const [usersInput, setUsersInput] = useState(
    userAuthenticated
      ? request && request.userList
        ? request.userList.join(" ")
        : ""
      : ""
  );
  const [since, setSince] = useState(
    null
  );

  const [sinceError, setSinceError] = useState(false);
  const [until, setUntil] = useState(
    null
  );
  const [untilError, setUntilError] = useState(false);


  useEffect(() => {
    setSince(null)
  }, []);

  const [langInput, setLangInput] = useState(
    userAuthenticated
      ? request && request.lang
        ? "lang_" + request.lang
        : "lang_all"
      : "lang_all"
  );
  const [openLangInput, setLangInputOpen] = React.useState(false);
  const [filters, setFilers] = useState(
    request && request.media ? request.media : "none"
  );
  const [verifiedUsers, setVerifiedUsers] = useState(
    request && request.verified ? request.verified : false
  );
  const [localTime, setLocalTime] = useState("true");

  // Form disabled?
  const searchFormDisabled =
    isLoading || !userAuthenticated || urlObj.isUrlSearch;

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

  function extractUrlSearch(windowUrl) {
    let part = windowUrl.split("/twitterSna?url=")[1];
    if (part === undefined) {
      return {
        url: null,
        request: null,
        isUrlSearch: false,
      };
    } else {
      let url = part.split("&request=")[0];
      let request = JSON.parse(unescape(part.split("&request=")[1]));
      let isUrlSearch = !url || !request ? false : true;
      return {
        url: url,
        request: request,
        isUrlSearch: isUrlSearch,
      };
    }
  }

  const makeRequestParams = (
    keywordsP,
    bannedWordsP,
    usersInputP,
    sinceP,
    untilP,
    localTimeP,
    langInputP,
    filtersP,
    verifiedUsersP
  ) => {
    //Creating Request Object.
    const removeQuotes = (list) => {
      let res = [];
      !_.isNil(list) &&
        list.forEach((string) => {
          res.push(replaceAll(string, '"', ""));
        });
      return res;
    };

    let trimedKeywords = !_.isNil(keywordsP)
      ? removeQuotes(keywordsP.trim().match(/("[^"]+"|[^"\s]+)/g))
      : [];
    let trimedKeywordsAny = !_.isNil(keyWordsAny)
      ? removeQuotes(keyWordsAny.trim().match(/("[^"]+"|[^"\s]+)/g))
      : [];

    let trimedBannedWords = null;
    if (!_.isNil(bannedWordsP) && bannedWordsP.trim() !== "")
      trimedBannedWords = removeQuotes(
        bannedWordsP.trim().match(/("[^"]+"|[^"\s]+)/g)
      );

    const newFrom = localTimeP === "false" ? convertToGMT(sinceP) : sinceP;
    const newUntil = localTimeP === "false" ? convertToGMT(untilP) : untilP;

    let filter;
    if (mediaImage && mediaVideo) {
      filter = "both";
    } else if (mediaImage) {
      filter = "image";
    } else if (mediaVideo) {
      filter = "video";
    } else {
      filter = null;
    }

    return {
      keywordList: trimedKeywords,
      keywordAnyList: trimedKeywordsAny,
      bannedWords: trimedBannedWords,
      lang: langInputP === "lang_all" ? null : langInputP.replace("lang_", ""),
      userList: stringToList(usersInputP),
      from: dateFormat(newFrom, "yyyy-mm-dd HH:MM:ss"),
      until: dateFormat(newUntil, "yyyy-mm-dd HH:MM:ss"),
      verified: String(verifiedUsersP) === "true",
      media: filter,
      retweetsHandling: null,
      localTime: localTimeP,
      cached: !cache,
      pageLanguage: langPage,
    };
  };

  const makeRequest = () => {
    return makeRequestParams(
      keyWords,
      bannedWords,
      usersInput,
      since,
      until,
      localTime,
      langInput,
      filters,
      verifiedUsers
    );
  };

  const cacheChange = () => {
    setCache(!cache);
  };

  const videoChange = () => {
    setMediaVideo(!mediaVideo);
  };

  const imageChange = () => {
    setMediaImage(!mediaImage);
  };

  const sinceDateIsValid = (momentDate) => {
    const itemDate = momentDate.toDate();
    const currentDate = new Date();
    if (until) return itemDate <= currentDate && itemDate < until;
    return itemDate <= currentDate;
  };

  const handleSinceDateChange = (date) => {
    setSinceError(date === null);
    if (until && date >= until) setSinceError(true);
    setSince(date);
  };

  const untilDateIsValid = (momentDate) => {
    const itemDate = momentDate.toDate();
    const currentDate = new Date();
    if (since) return itemDate <= currentDate && since < itemDate;
    return itemDate <= currentDate;
  };

  const handleUntilDateChange = (date) => {
    setUntilError(date === null);
    if (since && date < since) setUntilError(true);
    setUntil(date);
  };


  /*
  const handleFiltersChange = (event) => {
    setFilers(event.target.value);
  };
  */

  const client_id = getclientId()
  const onSubmit = () => {
    //Mandatory Fields errors
    if ((keyWords.trim() === "") && (keyWordsAny.trim() === "")) {
      if (keyWords.trim() === "") {
        handleErrors(keyword("twitterStatsErrorMessage"));
        setKeyWordsError(true);
        return;
      }
      if (keyWordsAny.trim() === "") {
        handleErrors(keyword("twitterStatsErrorMessage"));
        setKeyWordsAnyError(true);
        return;
      }
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
      let prevResult = reduxResult;
      if (prevResult && prevResult.coHashtagGraph) {
        delete prevResult.coHashtagGraph;
      }
      if (prevResult && prevResult.socioSemanticGraph) {
        delete prevResult.socioSemanticGraph;
      }
      if (prevResult && prevResult.socioSemantic4ModeGraph) {
        delete prevResult.socioSemantic4ModeGraph;
      }
      trackEvent('submission', 'tsna', 'redirect to tsna', JSON.stringify(newRequest), client_id)
      setSubmittedRequest(newRequest);
    }
  };

  // const [submittedRequest, setSubmittedRequest] = useState(null);
  const [submittedRequest, setSubmittedRequest] = useState(
    userAuthenticated ? null : makeRequest()
  );
  useTwitterSnaRequest(submittedRequest);

  // Reset form & result when user login
  useEffect(() => {
    // console.log("Auth change (authenticated: ", userAuthenticated, "), updating fields");
    if (urlObj.isUrlSearch) {
      setKeywords(userAuthenticated ? (urlObj.url ? urlObj.url : "") : "");
      setBannedWords(
        userAuthenticated
          ? urlObj.request.bannedWords
            ? urlObj.request.bannedWords.join(" ")
            : ""
          : ""
      );
      setUsersInput(
        userAuthenticated
          ? urlObj.request.userList
            ? urlObj.request.userList.join(" ")
            : ""
          : ""
      );
      setSince(
        userAuthenticated
          ? urlObj.request.from
            ? urlObj.request.from
            : null
          : null
      );
      setUntil(
        userAuthenticated
          ? urlObj.request.until
            ? urlObj.request.until
            : null
          : null
      );
      setLocalTime(
        userAuthenticated
          ? urlObj.request.localTime
            ? urlObj.request.localTime
            : "true"
          : "true"
      );
      setLangInput(
        userAuthenticated
          ? urlObj.request.lang
            ? "lang_" + urlObj.request.lang
            : "lang_all"
          : "lang_all"
      );
      setFilers(
        userAuthenticated
          ? urlObj.request.media
            ? urlObj.request.media
            : "none"
          : "none"
      );
      setVerifiedUsers(
        userAuthenticated
          ? urlObj.request.verified
            ? urlObj.request.verified
            : "false"
          : "false"
      );

      const newSubmittedRequest = makeRequestParams(
        userAuthenticated ? (urlObj.url ? urlObj.url : "") : "",
        "",
        userAuthenticated
          ? urlObj.request.userList
            ? urlObj.request.userList.join(" ")
            : ""
          : "",
        userAuthenticated
          ? urlObj.request.from
            ? urlObj.request.from
            : null
          : null,
        userAuthenticated
          ? urlObj.request.until
            ? urlObj.request.until
            : null
          : null,
        "true",
        userAuthenticated ? "lang_all" : "lang_all",
        "none",
        "false"
      );

      setSubmittedRequest(newSubmittedRequest);
      window.history.pushState({}, null, "/popup.html#/app/tools/twitterSna");
    } else {
      setKeywords(userAuthenticated ? "" : "");
      setBannedWords("");
      setUsersInput(userAuthenticated ? "" : "");
      setSince(userAuthenticated ? null : null);
      setUntil(userAuthenticated ? null : null);
      setLocalTime("true");
      setLangInput(userAuthenticated ? "lang_all" : "lang_all");
      setFilers("none");
      setVerifiedUsers(false);

      const newSubmittedRequest = makeRequestParams(
        userAuthenticated ? "" : "",
        "",
        userAuthenticated ? "" : "",
        userAuthenticated ? null : null,
        userAuthenticated ? null : null,
        "true",
        userAuthenticated ? "lang_all" : "lang_en",
        "none",
        "false"
      );
      setSubmittedRequest(newSubmittedRequest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuthenticated]);

  function cacheCheck() {
    for (let index in role) {
      if (role[index] === "CACHEOVERRIDE") {
        return true;
      }
    }
    return false;
  }

  /*
  const verifiedChange = () => {
    setVerifiedUsers(!verifiedUsers);
  };
  */


  return (
    <div>
      <ThemeProvider theme={theme}>
        <HeaderTool name={keywordAllTools("navbar_twitter_sna")} description={keywordAllTools("navbar_twitter_sna_description")} icon={<TwitterSNAIcon style={{ fill: "#51A5B2" }} width="40px" height="40px"/>} advanced="true"/>
          <Card className={cardClasses.root}>
            <CardHeader
              title={keyword("cardheader_parameters")}
              className={classes.headerUpladedImage}
            />
            <Box p={4}>

              <Grid container direction="column">

                <Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
                  {keyword("twittersna_title_elements")}
                </Typography>
                <Box m={1} />


                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={8}>
                    <TextField
                      disabled={searchFormDisabled}
                      error={keyWordsError}
                      value={keyWords}
                      onChange={(e) => {
                        setKeywords(e.target.value);
                        setKeyWordsError(false);
                      }}
                      id="standard-full-width"
                      label={"* " + keyword("twittersna_field_all")}
                      className={classes.neededField}
                      placeholder={keyword("twitter_sna_search")}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
                    <Grid item>
                      <SearchIcon style={{ color: "#757575" }} />
                    </Grid>
                    <Grid>
                      <Box m={1} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="body2" align="left" style={{ color: "#757575" }}>
                        {keyword("explanation_allelements")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Box m={1} />

                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={8}>
                    <TextField
                      disabled={searchFormDisabled}
                      error={keyWordsAnyError}
                      value={keyWordsAny}
                      onChange={(e) => {
                        setKeywordsAny(e.target.value);
                        setKeyWordsAnyError(false);
                      }}
                      id="standard-full-width"
                      label={"*  " + keyword("twittersna_field_any")}
                      className={classes.neededField}
                      placeholder={keyword("twitter_sna_search")}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
                    <Grid item>
                      <SearchIcon style={{ color: "#757575" }} />
                    </Grid>
                    <Grid>
                      <Box m={1} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="body2" align="left" style={{ color: "#757575" }}>
                        {keyword("explanation_anyelements")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Box m={2} />

                <Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
                  {keyword("twittersna_title_time")}
                </Typography>
                <Box m={1} />

                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={4}>
                    <DateTime
                      id="standard-full-width-since"
                      disabled={searchFormDisabled}
                      input={true}
                      isValidDate={sinceDateIsValid}
                      label={"*  " + keyword("twitter_sna_from_date")}
                      className={classes.neededField}
                      dateFormat={"YYYY-MM-DD"}
                      timeFormat={"HH:mm:ss"}
                      value={since}
                      handleChange={handleSinceDateChange}
                      error={sinceError}
                      placeholder={keyword("twitter_sna_selectdate")}

                    />
                  </Grid>
                  <Grid item xs={4}>
                    <DateTime
                      id="standard-full-width-until"
                      disabled={searchFormDisabled}
                      input={true}
                      isValidDate={untilDateIsValid}
                      label={"*  " + keyword("twitter_sna_until_date")}
                      className={classes.neededField}
                      dateFormat={"YYYY-MM-DD"}
                      timeFormat={"HH:mm:ss"}
                      value={until}
                      handleChange={handleUntilDateChange}
                      error={untilError}
                      placeholder={keyword("twitter_sna_selectdate")}
                    />
                  </Grid>

                  <Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
                    <Grid item>
                      <CalendarTodayIcon style={{ color: "#757575" }} />
                    </Grid>
                    <Grid>
                      <Box m={1} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="body2" align="left" style={{ color: "#757575" }}>
                        {keyword("explanation_dates")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Box m={1} />

                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={8}>
                    <Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
                      {keyword("twittersna_title_timezone")}
                    </Typography>
                  </Grid>

                  <Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
                    <Grid item>
                      <GlobeIcon style={{ color: "#757575" }} />
                    </Grid>
                    <Grid>
                      <Box m={1} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="body2" align="left" style={{ color: "#757575" }}>
                        {keyword("explanation_timezone")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Box m={1} />

                <Box pl={3}>

                  <FormControl component="fieldset" disabled={searchFormDisabled} style={{ width: "100%" }}>
                    <RadioGroup
                      aria-label="position"
                      name="position"
                      value={localTime}
                      onChange={(e) => setLocalTime(e.target.value)}
                      row
                    >
                      <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start">
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
                      </Grid>
                    </RadioGroup>
                  </FormControl>

                </Box>

                <Box m={2} />

                <Accordion>

                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: "#17717e" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Box pl={3} pr={3} pt={1} pb={1}>
                      <Typography variant="h6" align="left" style={{ color: "#17717e" }}>
                        {keyword("twittersna_title_optional")}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails style={{ flexDirection: "column" }}>

                    <Box pl={3} pr={3}>

                      <Grid container direction="column" spacing={0}>

                        <Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
                          {keyword("twittersna_title_words")}
                        </Typography>
                        <Box m={1} />

                        <Grid container spacing={4} alignItems="center">
                          <Grid item xs={8}>
                            <TextField
                              disabled={searchFormDisabled}
                              value={bannedWords}
                              onChange={(e) => setBannedWords(e.target.value)}
                              id="standard-full-width"
                              label={keyword("twitter_sna_not")}
                              placeholder={"word word2"}
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
                            <Grid item>
                              <ExcludeIcon style={{ color: "#757575" }} />
                            </Grid>
                            <Grid>
                              <Box m={1} />
                            </Grid>
                            <Grid item xs>
                              <Typography variant="body2" align="left" style={{ color: "#757575" }}>
                                {keyword("explanation_exclude")}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Box m={1} />

                        <Grid container spacing={4} alignItems="center">
                          <Grid item xs={8}>
                            <FormControl
                              variant="outlined"
                              className={classes.formControl}
                              disabled={searchFormDisabled}
                            >
                              <InputLabel id="test-select-label">
                                {keyword("lang_choices")}
                              </InputLabel>
                              <Select
                                native
                                labelId="test-select-label"
                                label={keyword("lang_choices")}
                                id="demo-controlled-open-select"
                                open={openLangInput}
                                onClose={() => setLangInputOpen(false)}
                                onOpen={() => setLangInputOpen(true)}
                                value={langInput}
                                onChange={(e) => setLangInput(e.target.value)}
                              >
                                <option value=""></option>
                                <option value={"lang_fr"}>{keyword("lang_fr")}</option>
                                <option value={"lang_en"}>{keyword("lang_en")}</option>
                                <option value={"lang_es"}>{keyword("lang_es")}</option>
                                <option value={"lang_ar"}>{keyword("lang_ar")}</option>
                                <option value={"lang_de"}>{keyword("lang_de")}</option>
                                <option value={"lang_it"}>{keyword("lang_it")}</option>
                                <option value={"lang_id"}>{keyword("lang_id")}</option>
                                <option value={"lang_pt"}>{keyword("lang_pt")}</option>
                                <option value={"lang_ko"}>{keyword("lang_ko")}</option>
                                <option value={"lang_tr"}>{keyword("lang_tr")}</option>
                                <option value={"lang_ru"}>{keyword("lang_ru")}</option>
                                <option value={"lang_nl"}>{keyword("lang_nl")}</option>
                                <option value={"lang_hi"}>{keyword("lang_hi")}</option>
                                <option value={"lang_no"}>{keyword("lang_no")}</option>
                                <option value={"lang_sv"}>{keyword("lang_sv")}</option>
                                <option value={"lang_fi"}>{keyword("lang_fi")}</option>
                                <option value={"lang_da"}>{keyword("lang_da")}</option>
                                <option value={"lang_pl"}>{keyword("lang_pl")}</option>
                                <option value={"lang_hu"}>{keyword("lang_hu")}</option>
                                <option value={"lang_fa"}>{keyword("lang_fa")}</option>
                                <option value={"lang_he"}>{keyword("lang_he")}</option>
                                <option value={"lang_ur"}>{keyword("lang_ur")}</option>
                                <option value={"lang_th"}>{keyword("lang_th")}</option>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
                            <Grid item>
                              <TranslateIcon style={{ color: "#757575" }} />
                            </Grid>
                            <Grid>
                              <Box m={1} />
                            </Grid>
                            <Grid item xs>
                              <Typography variant="body2" align="left" style={{ color: "#757575" }}>
                                {keyword("explanation_language")}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Box m={2} />
                        <Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
                          {keyword("twittersna_title_accounts")}
                        </Typography>
                        <Box m={1} />


                        <Grid container spacing={4} alignItems="center">
                          <Grid item xs={8}>
                            <TextField
                              disabled={searchFormDisabled}
                              value={usersInput}
                              onChange={(e) => setUsersInput(e.target.value)}
                              id="standard-full-width"
                              label={keyword("twitter_sna_user")}
                              placeholder={keyword("twitter_sna_placholder_tweetedby")}
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
                            <Grid item>
                              <PersonOutlineIcon style={{ color: "#757575" }} />
                            </Grid>
                            <Grid>
                              <Box m={1} />
                            </Grid>
                            <Grid item xs>
                              <Typography variant="body2" align="left" style={{ color: "#757575" }}>
                                {keyword("explanation_account")}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>

                        {/*

                        <Box m={1} />

                        <Grid container spacing={4} alignItems="center" style={{ paddingLeft: "0px" }}>
                          <Grid item xs={8}>
                            <Box pl={3}>
                              <FormControl component="fieldset" disabled={searchFormDisabled}>
                                <FormControlLabel
                                  aria-label="position"
                                  name="position"
                                  control={
                                    <Checkbox
                                      color="primary"
                                      onChange={verifiedChange}
                                      disabled={searchFormDisabled}
                                      checked={verifiedUsers} />
                                  }
                                  label={keyword("twitter_sna_verified")}
                                  labelPlacement="end"
                                />
                              </FormControl>
                            </Box>

                          </Grid>

                          <Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
                            <Grid item>
                              <DoneIcon style={{ color: "#757575" }} />
                            </Grid>
                            <Grid>
                              <Box m={1} />
                            </Grid>
                            <Grid item xs>
                              <Typography variant="body2" align="left" style={{ color: "#757575" }}>
                                {keyword("explanation_verified")}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>

                                */}

                        <Box m={2} />


                        <Grid container spacing={4} alignItems="center">
                          <Grid item xs={8}>
                            <Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
                              {keyword("twittersna_title_media")}
                            </Typography>
                          </Grid>


                          <Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
                            <Grid item>
                              <PermMediaIcon style={{ color: "#757575" }} />
                            </Grid>
                            <Grid>
                              <Box m={1} />
                            </Grid>
                            <Grid item xs>
                              <Typography variant="body2" align="left" style={{ color: "#757575" }}>
                                {keyword("explanation_media")}
                              </Typography>
                            </Grid>
                          </Grid>

                        </Grid>


                        <Box m={0} />

                        <Box pl={3}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                disabled={searchFormDisabled}
                                checked={mediaImage}
                                onChange={imageChange}
                                value="checkedBox"
                                color="primary"
                              />
                            }
                            label={keyword("twitterStats_media_images")}
                            style={{ paddingLeft: "0px" }}

                          />
                          <Box mt={0} />
                          <FormControlLabel
                            control={
                              <Checkbox
                                disabled={searchFormDisabled}
                                checked={mediaVideo}
                                onChange={videoChange}
                                value="checkedBox"
                                color="primary"
                              />
                            }
                            label={keyword("twitterStats_media_videos")}
                            style={{ paddingLeft: "0px" }}
                          />
                        </Box>

                        <Box m={2} />

                        <Grid container spacing={4} alignItems="center">
                          <Grid item xs={8}>
                            <Typography variant="h6" align="left">
                              {keyword("twittersna_title_advanced")}
                            </Typography>
                          </Grid>

                          <Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
                            <Grid item>
                              <LaptopIcon style={{ color: "#757575" }} />
                            </Grid>
                            <Grid>
                              <Box m={1} />
                            </Grid>
                            <Grid item xs>
                              <Typography variant="body2" align="left" style={{ color: "#757575" }}>
                                {keyword("explanation_cache")}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Box m={0} />

                        {cacheCheck() && (
                          <Box pl={3}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disabled={searchFormDisabled}
                                  checked={cache}
                                  onChange={cacheChange}
                                  value="checkedBox"
                                  color="primary"
                                />
                              }
                              label={keyword("disable_cache")}
                            />
                          </Box>
                        )}
                      </Grid>


                    </Box>
                  </AccordionDetails>


                </Accordion>


                <Box m={2} />


                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<SearchIcon />}
                  onClick={onSubmit}
                  disabled={
                    searchFormDisabled || keyWordsError || sinceError || untilError
                  }
                >
                  {keyword("button_submit")}
                </Button>

                <Box m={1} />
                {!userAuthenticated && <OnWarningInfo keyword={"warning_sna"} />}

              </Grid>
            </Box>

          </Card>        
      </ThemeProvider>
    </div>
  );
};
export default TwitterSna;
