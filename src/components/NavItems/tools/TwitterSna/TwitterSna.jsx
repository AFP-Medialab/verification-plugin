import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExcludeIcon from "@mui/icons-material/HighlightOff";
import LaptopIcon from "@mui/icons-material/Laptop";
//import DoneIcon from '@mui/icons-material/Done';
import PermMediaIcon from "@mui/icons-material/PermMedia";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GlobeIcon from "@mui/icons-material/Public";
import SearchIcon from "@mui/icons-material/Search";
import TranslateIcon from "@mui/icons-material/Translate";

import { useTrackEvent } from "@/Hooks/useAnalytics";
import DateAndTimePicker from "@/components/Shared/DateTimePicker/DateAndTimePicker";
import { dataAnalysisSna } from "@/constants/tools";
import { setError } from "@/redux/reducers/errorReducer";
import { convertMomentToGMT } from "@Shared/DateTimePicker/convertToGMT";
import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import dateFormat from "dateformat";
import dayjs from "dayjs";
import _ from "lodash";

import { theme as defaultTheme } from "../../../../theme";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useMyStyles, {
  myCardStyles,
} from "../../../Shared/MaterialUiStyles/useMyStyles";
import OnWarningInfo from "../../../Shared/OnClickInfo/OnWarningInfo";
import { replaceAll } from "../TwitterAdvancedSearch/createUrl";
import useTwitterSnaRequest from "./Hooks/useTwitterSnaRequest";

const TwitterSna = () => {
  const theme = {
    ...defaultTheme,
    components: {
      MuiCardHeader: {
        styleOverrides: {
          root: {
            paddingTop: "11px!important",
            paddingBottom: "11px!important",
          },
          title: {
            fontSize: "20px!important",
            fontweight: 500,
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            minWidth: "25%!important",
            fontSize: 12,
          },
        },
      },

      MuiAccordion: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            "&:before": {
              width: "0px",
            },
            border: "1px solid var(--mui-palette-primary-main)",
          },
          rounded: {
            borderRadius: "15px",
          },
        },
      },
    },
  };

  const classes = useMyStyles();
  const cardClasses = myCardStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/TwitterSna");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

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
    (state) => state.userSession && state.userSession.userAuthenticated,
  );

  const dispatch = useDispatch();

  // Component state (default sample values if not authenticated)
  const [keyWords, setKeywords] = useState(
    userAuthenticated
      ? request && request.keywordList
        ? request.keywordList.join(" ")
        : ""
      : "",
  );

  const [keyWordsAny, setKeywordsAny] = useState(
    request && request.keywordAnyList ? request.keywordAnyList.join(" ") : "",
  );

  const [keyWordsError, setKeyWordsError] = useState(false);
  const [keyWordsAnyError, setKeyWordsAnyError] = useState(false);
  const [bannedWords, setBannedWords] = useState(
    request && request.bannedWords ? request.bannedWords.join(" ") : "",
  );
  const [usersInput, setUsersInput] = useState(
    userAuthenticated
      ? request && request.userList
        ? request.userList.join(" ")
        : ""
      : "",
  );
  const [since, setSince] = useState(null);

  const [sinceError, setSinceError] = useState(false);
  const [until, setUntil] = useState(null);
  const [untilError, setUntilError] = useState(false);

  useEffect(() => {
    setSince(null);
  }, []);

  const [langInput, setLangInput] = useState(
    userAuthenticated
      ? request && request.lang
        ? "lang_" + request.lang
        : "lang_all"
      : "lang_all",
  );
  const [openLangInput, setLangInputOpen] = React.useState(false);
  const [filters, setFilers] = useState(
    request && request.media ? request.media : "none",
  );
  const [verifiedUsers, setVerifiedUsers] = useState(
    request && request.verified ? request.verified : false,
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
    verifiedUsersP,
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
        bannedWordsP.trim().match(/("[^"]+"|[^"\s]+)/g),
      );

    const newFrom =
      localTimeP === "false" ? convertMomentToGMT(sinceP) : sinceP;
    const newUntil =
      localTimeP === "false" ? convertMomentToGMT(untilP) : untilP;

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
      verifiedUsers,
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

  const handleSinceDateChange = (date) => {
    setSinceError(date === null);
    if (until && date >= until) setSinceError(true);
    setSince(dayjs(date));
  };

  const handleUntilDateChange = (date) => {
    setUntilError(date === null);
    if (since && date < since) setUntilError(true);
    setUntil(dayjs(date));
  };

  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;
  const client_id = getclientId();

  const [submittedRequest, setSubmittedRequest] = useState(
    userAuthenticated ? null : makeRequest(),
  );

  const onSubmit = () => {
    //Mandatory Fields errors
    if (keyWords.trim() === "" && keyWordsAny.trim() === "") {
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
      /*trackEvent(
                                                                                                                    "submission",
                                                                                                                    "tsna",
                                                                                                                    "redirect to tsna",
                                                                                                                    JSON.stringify(newRequest),
                                                                                                                    client_id,
                                                                                                                    uid
                                                                                                                  );*/
      setSubmittedRequest(newRequest);
    }
  };

  useTrackEvent(
    "submission",
    "tsna",
    "redirect to tsna",
    JSON.stringify(submittedRequest),
    client_id,
    submittedRequest,
    uid,
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
          : "",
      );
      setUsersInput(
        userAuthenticated
          ? urlObj.request.userList
            ? urlObj.request.userList.join(" ")
            : ""
          : "",
      );
      setSince(
        userAuthenticated
          ? urlObj.request.from
            ? urlObj.request.from
            : null
          : null,
      );
      setUntil(
        userAuthenticated
          ? urlObj.request.until
            ? urlObj.request.until
            : null
          : null,
      );
      setLocalTime(
        userAuthenticated
          ? urlObj.request.localTime
            ? urlObj.request.localTime
            : "true"
          : "true",
      );
      setLangInput(
        userAuthenticated
          ? urlObj.request.lang
            ? "lang_" + urlObj.request.lang
            : "lang_all"
          : "lang_all",
      );
      setFilers(
        userAuthenticated
          ? urlObj.request.media
            ? urlObj.request.media
            : "none"
          : "none",
      );
      setVerifiedUsers(
        userAuthenticated
          ? urlObj.request.verified
            ? urlObj.request.verified
            : "false"
          : "false",
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
        "false",
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
        "false",
      );
      setSubmittedRequest(newSubmittedRequest);
    }
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
        <HeaderTool
          name={keywordAllTools("navbar_twitter_sna")}
          description={keywordAllTools("navbar_twitter_sna_description")}
          icon={
            <dataAnalysisSna.icon
              sx={{ fill: "var(--mui-palette-primary-main)", fontSize: "40px" }}
            />
          }
        />
        <Card variant="outlined" className={cardClasses.root}>
          <CardHeader
            title={keyword("cardheader_parameters")}
            className={classes.headerUploadedImage}
          />
          <Box
            sx={{
              p: 4,
            }}
          >
            <Grid container direction="column">
              <Typography
                variant="h6"
                align="left"
                style={{ paddingLeft: "0px" }}
              >
                {keyword("twittersna_title_elements")}
              </Typography>
              <Box
                sx={{
                  m: 1,
                }}
              />

              <Grid
                container
                spacing={4}
                sx={{
                  alignItems: "center",
                }}
              >
                <Grid size={{ xs: 8 }}>
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

                <Grid
                  size={{ xs: 4 }}
                  container
                  direction="row"
                  sx={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Grid>
                    <SearchIcon style={{ color: "#757575" }} />
                  </Grid>
                  <Grid>
                    <Box
                      sx={{
                        m: 1,
                      }}
                    />
                  </Grid>
                  <Grid size="grow">
                    <Typography
                      variant="body2"
                      align="left"
                      style={{ color: "#757575" }}
                    >
                      {keyword("explanation_allelements")}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Box
                sx={{
                  m: 1,
                }}
              />

              <Grid
                container
                spacing={4}
                sx={{
                  alignItems: "center",
                }}
              >
                <Grid size={{ xs: 8 }}>
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

                <Grid
                  size={{ xs: 4 }}
                  container
                  direction="row"
                  sx={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Grid>
                    <SearchIcon style={{ color: "#757575" }} />
                  </Grid>
                  <Grid>
                    <Box
                      sx={{
                        m: 1,
                      }}
                    />
                  </Grid>
                  <Grid size="grow">
                    <Typography
                      variant="body2"
                      align="left"
                      style={{ color: "#757575" }}
                    >
                      {keyword("explanation_anyelements")}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Box
                sx={{
                  m: 2,
                }}
              />

              <Typography
                variant="h6"
                align="left"
                style={{ paddingLeft: "0px" }}
              >
                {keyword("twittersna_title_time")}
              </Typography>
              <Box
                sx={{
                  m: 1,
                }}
              />

              <Grid
                container
                spacing={4}
                sx={{
                  alignItems: "center",
                }}
              >
                <Grid size={{ xs: 8 }}>
                  <DateAndTimePicker
                    time={true}
                    disabled={searchFormDisabled}
                    keywordFromDate={keyword("twitter_sna_from_date")}
                    keywordUntilDate={keyword("twitter_sna_until_date")}
                    fromValue={since}
                    untilValue={until}
                    handleSinceChange={handleSinceDateChange}
                    handleUntilChange={handleUntilDateChange}
                  />
                </Grid>

                <Grid
                  size={{ xs: 4 }}
                  container
                  direction="row"
                  sx={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Grid>
                    <CalendarTodayIcon style={{ color: "#757575" }} />
                  </Grid>
                  <Grid>
                    <Box
                      sx={{
                        m: 1,
                      }}
                    />
                  </Grid>
                  <Grid size="grow">
                    <Typography
                      variant="body2"
                      align="left"
                      style={{ color: "#757575" }}
                    >
                      {keyword("explanation_dates")}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Box
                sx={{
                  m: 1,
                }}
              />

              <Grid
                container
                spacing={4}
                sx={{
                  alignItems: "center",
                }}
              >
                <Grid size={{ xs: 8 }}>
                  <Typography
                    variant="h6"
                    align="left"
                    style={{ paddingLeft: "0px" }}
                  >
                    {keyword("twittersna_title_timezone")}
                  </Typography>
                </Grid>

                <Grid
                  size={{ xs: 4 }}
                  container
                  direction="row"
                  sx={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Grid>
                    <GlobeIcon style={{ color: "#757575" }} />
                  </Grid>
                  <Grid>
                    <Box
                      sx={{
                        m: 1,
                      }}
                    />
                  </Grid>
                  <Grid size="grow">
                    <Typography
                      variant="body2"
                      align="left"
                      style={{ color: "#757575" }}
                    >
                      {keyword("explanation_timezone")}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Box
                sx={{
                  m: 1,
                }}
              />

              <Box
                sx={{
                  pl: 3,
                }}
              >
                <FormControl
                  component="fieldset"
                  disabled={searchFormDisabled}
                  style={{ width: "100%" }}
                >
                  <RadioGroup
                    aria-label="position"
                    name="position"
                    value={localTime}
                    onChange={(e) => setLocalTime(e.target.value)}
                    row
                  >
                    <Grid
                      container
                      direction="column"
                      sx={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
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
                        label={keyword("twitter_sna_gmt")}
                        labelPlacement="end"
                      />
                    </Grid>
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box
                sx={{
                  m: 2,
                }}
              />

              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      style={{ color: "var(--mui-palette-primary-main)" }}
                    />
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Box
                    sx={{
                      pl: 3,
                      pr: 3,
                      pt: 1,
                      pb: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      align="left"
                      sx={{ color: "var(--mui-palette-primary-main)" }}
                    >
                      {keyword("twittersna_title_optional")}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails style={{ flexDirection: "column" }}>
                  <Box
                    sx={{
                      pl: 3,
                      pr: 3,
                    }}
                  >
                    <Grid container direction="column" spacing={0}>
                      <Typography
                        variant="h6"
                        align="left"
                        style={{ paddingLeft: "0px" }}
                      >
                        {keyword("twittersna_title_words")}
                      </Typography>
                      <Box
                        sx={{
                          m: 1,
                        }}
                      />

                      <Grid
                        container
                        spacing={4}
                        sx={{
                          alignItems: "center",
                        }}
                      >
                        <Grid size={{ xs: 8 }}>
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

                        <Grid
                          size={{ xs: 4 }}
                          container
                          direction="row"
                          sx={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Grid>
                            <ExcludeIcon style={{ color: "#757575" }} />
                          </Grid>
                          <Grid>
                            <Box
                              sx={{
                                m: 1,
                              }}
                            />
                          </Grid>
                          <Grid size="grow">
                            <Typography
                              variant="body2"
                              align="left"
                              style={{ color: "#757575" }}
                            >
                              {keyword("explanation_exclude")}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Box
                        sx={{
                          m: 1,
                        }}
                      />

                      <Grid
                        container
                        spacing={4}
                        sx={{
                          alignItems: "center",
                        }}
                      >
                        <Grid size={{ xs: 8 }}>
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
                              <option value={"lang_fr"}>
                                {keyword("lang_fr")}
                              </option>
                              <option value={"lang_en"}>
                                {keyword("lang_en")}
                              </option>
                              <option value={"lang_es"}>
                                {keyword("lang_es")}
                              </option>
                              <option value={"lang_ar"}>
                                {keyword("lang_ar")}
                              </option>
                              <option value={"lang_de"}>
                                {keyword("lang_de")}
                              </option>
                              <option value={"lang_it"}>
                                {keyword("lang_it")}
                              </option>
                              <option value={"lang_id"}>
                                {keyword("lang_id")}
                              </option>
                              <option value={"lang_pt"}>
                                {keyword("lang_pt")}
                              </option>
                              <option value={"lang_ko"}>
                                {keyword("lang_ko")}
                              </option>
                              <option value={"lang_tr"}>
                                {keyword("lang_tr")}
                              </option>
                              <option value={"lang_ru"}>
                                {keyword("lang_ru")}
                              </option>
                              <option value={"lang_nl"}>
                                {keyword("lang_nl")}
                              </option>
                              <option value={"lang_hi"}>
                                {keyword("lang_hi")}
                              </option>
                              <option value={"lang_no"}>
                                {keyword("lang_no")}
                              </option>
                              <option value={"lang_sv"}>
                                {keyword("lang_sv")}
                              </option>
                              <option value={"lang_fi"}>
                                {keyword("lang_fi")}
                              </option>
                              <option value={"lang_da"}>
                                {keyword("lang_da")}
                              </option>
                              <option value={"lang_pl"}>
                                {keyword("lang_pl")}
                              </option>
                              <option value={"lang_hu"}>
                                {keyword("lang_hu")}
                              </option>
                              <option value={"lang_fa"}>
                                {keyword("lang_fa")}
                              </option>
                              <option value={"lang_he"}>
                                {keyword("lang_he")}
                              </option>
                              <option value={"lang_ur"}>
                                {keyword("lang_ur")}
                              </option>
                              <option value={"lang_th"}>
                                {keyword("lang_th")}
                              </option>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid
                          size={{ xs: 4 }}
                          container
                          direction="row"
                          sx={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Grid>
                            <TranslateIcon style={{ color: "#757575" }} />
                          </Grid>
                          <Grid>
                            <Box
                              sx={{
                                m: 1,
                              }}
                            />
                          </Grid>
                          <Grid size="grow">
                            <Typography
                              variant="body2"
                              align="left"
                              style={{ color: "#757575" }}
                            >
                              {keyword("explanation_language")}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Box
                        sx={{
                          m: 2,
                        }}
                      />
                      <Typography
                        variant="h6"
                        align="left"
                        style={{ paddingLeft: "0px" }}
                      >
                        {keyword("twittersna_title_accounts")}
                      </Typography>
                      <Box
                        sx={{
                          m: 1,
                        }}
                      />

                      <Grid
                        container
                        spacing={4}
                        sx={{
                          alignItems: "center",
                        }}
                      >
                        <Grid size={{ xs: 8 }}>
                          <TextField
                            disabled={searchFormDisabled}
                            value={usersInput}
                            onChange={(e) => setUsersInput(e.target.value)}
                            id="standard-full-width"
                            label={keyword("twitter_sna_user")}
                            placeholder={keyword(
                              "twitter_sna_placholder_tweetedby",
                            )}
                            fullWidth
                            variant="outlined"
                          />
                        </Grid>

                        <Grid
                          size={{ xs: 4 }}
                          container
                          direction="row"
                          sx={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Grid>
                            <PersonOutlineIcon style={{ color: "#757575" }} />
                          </Grid>
                          <Grid>
                            <Box
                              sx={{
                                m: 1,
                              }}
                            />
                          </Grid>
                          <Grid size="grow">
                            <Typography
                              variant="body2"
                              align="left"
                              style={{ color: "#757575" }}
                            >
                              {keyword("explanation_account")}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      {/*

                        <Box m={1} />

                       <Grid container spacing={4} alignItems="center" style={{ paddingLeft: "0px" }}>
                         <Grid size={{xs: 8}}>
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

                         <Grid size={{xs: 4}} container direction="row" justifyContent="flex-start" alignItems="center">
                           <Grid>
                              <DoneIcon style={{ color: "#757575" }} />
                            </Grid>
                            <Grid>
                              <Box m={1} />
                            </Grid>
                             <Grid size="grow">
                              <Typography variant="body2" align="left" style={{ color: "#757575" }}>
                                {keyword("explanation_verified")}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>

                                */}

                      <Box
                        sx={{
                          m: 2,
                        }}
                      />

                      <Grid
                        container
                        spacing={4}
                        sx={{
                          alignItems: "center",
                        }}
                      >
                        <Grid size={{ xs: 8 }}>
                          <Typography
                            variant="h6"
                            align="left"
                            style={{ paddingLeft: "0px" }}
                          >
                            {keyword("twittersna_title_media")}
                          </Typography>
                        </Grid>

                        <Grid
                          size={{ xs: 4 }}
                          container
                          direction="row"
                          sx={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Grid>
                            <PermMediaIcon style={{ color: "#757575" }} />
                          </Grid>
                          <Grid>
                            <Box
                              sx={{
                                m: 1,
                              }}
                            />
                          </Grid>
                          <Grid size="grow">
                            <Typography
                              variant="body2"
                              align="left"
                              style={{ color: "#757575" }}
                            >
                              {keyword("explanation_media")}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Box
                        sx={{
                          m: 0,
                        }}
                      />

                      <Box
                        sx={{
                          pl: 3,
                        }}
                      >
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
                        <Box
                          sx={{
                            mt: 0,
                          }}
                        />
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

                      <Box
                        sx={{
                          m: 2,
                        }}
                      />

                      <Grid
                        container
                        spacing={4}
                        sx={{
                          alignItems: "center",
                        }}
                      >
                        <Grid size={{ xs: 8 }}>
                          <Typography variant="h6" align="left">
                            {keyword("twittersna_title_advanced")}
                          </Typography>
                        </Grid>

                        <Grid
                          size={{ xs: 4 }}
                          container
                          direction="row"
                          sx={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Grid>
                            <LaptopIcon style={{ color: "#757575" }} />
                          </Grid>
                          <Grid>
                            <Box
                              sx={{
                                m: 1,
                              }}
                            />
                          </Grid>
                          <Grid size="grow">
                            <Typography
                              variant="body2"
                              align="left"
                              style={{ color: "#757575" }}
                            >
                              {keyword("explanation_cache")}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Box
                        sx={{
                          m: 0,
                        }}
                      />

                      {cacheCheck() && (
                        <Box
                          sx={{
                            pl: 3,
                          }}
                        >
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

              <Box
                sx={{
                  m: 2,
                }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={onSubmit}
                disabled={
                  searchFormDisabled ||
                  keyWordsError ||
                  sinceError ||
                  untilError
                }
              >
                {keyword("button_submit")}
              </Button>

              <Box
                sx={{
                  m: 1,
                }}
              />
              {!userAuthenticated && <OnWarningInfo keyword={"warning_sna"} />}
            </Grid>
          </Box>
        </Card>
      </ThemeProvider>
    </div>
  );
};
export default TwitterSna;
