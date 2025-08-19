import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { useColorScheme } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { Close } from "@mui/icons-material";

import AssistantCheckStatus from "@/components/NavItems/Assistant/AssistantCheckResults/AssistantCheckStatus";
import AssistantNEResult from "@/components/NavItems/Assistant/AssistantCheckResults/AssistantNEResult";
import AssistantCommentResult from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantCommentResult";
import AssistantLinkResult from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantLinkResult";
import AssistantMediaResult from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantMediaResult";
import AssistantTextResult from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantTextResult";
import AssistantSCResults from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantUrlDomainAnalysisResults";
import AssistantWarnings from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantWarnings";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import {
  cleanAssistantState,
  setUrlMode,
  submitInputUrl,
} from "@/redux/actions/tools/assistantActions";
import { setError } from "@/redux/reducers/errorReducer";

import AssistantFileSelected from "./AssistantFileSelected";
import AssistantIntroduction from "./AssistantIntroduction";
import AssistantUrlSelected from "./AssistantUrlSelected";

const Assistant = () => {
  // styles, language, dispatch, params
  const { url } = useParams();
  const navigate = useNavigate();
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // for dark mode
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  // form states
  const inputUrl = useSelector((state) => state.assistant.inputUrl);
  const urlMode = useSelector((state) => state.assistant.urlMode);
  const imageVideoSelected = useSelector(
    (state) => state.assistant.imageVideoSelected,
  );

  // result states
  const imageList = useSelector((state) => state.assistant.imageList);
  const videoList = useSelector((state) => state.assistant.videoList);
  const text = useSelector((state) => state.assistant.urlText);
  const linkList = useSelector((state) => state.assistant.linkList);
  const collectedComments = useSelector(
    (state) => state.assistant.collectedComments,
  );
  const errorKey = useSelector((state) => state.assistant.errorKey);

  //third party check states
  const neResult = useSelector((state) => state.assistant.neResultCategory);

  // source credibility
  const positiveSourceCred = useSelector(
    (state) => state.assistant.positiveSourceCred,
  );
  const cautionSourceCred = useSelector(
    (state) => state.assistant.cautionSourceCred,
  );
  const mixedSourceCred = useSelector(
    (state) => state.assistant.mixedSourceCred,
  );

  const dbkfTextMatch = useSelector((state) => state.assistant.dbkfTextMatch);
  const dbkfImageResult = useSelector(
    (state) => state.assistant.dbkfImageMatch,
  );
  const dbkfVideoMatch = useSelector((state) => state.assistant.dbkfVideoMatch);

  // third party fail states
  const scFailState = useSelector((state) => state.assistant.inputSCFail);
  const dbkfTextFailState = useSelector(
    (state) => state.assistant.dbkfTextMatchFail,
  );
  const dbkfMediaFailState = useSelector(
    (state) => state.assistant.dbkfMediaMatchFail,
  );
  const neFailState = useSelector((state) => state.assistant.neFail);
  const newsFramingFailState = useSelector(
    (state) => state.assistant.newsFramingFail,
  );
  const newsGenreFailState = useSelector(
    (state) => state.assistant.newsGenreFail,
  );
  const persuasionFailState = useSelector(
    (state) => state.assistant.persuasionFail,
  );
  const prevFactChecksFailState = useSelector(
    (state) => state.assistant.previousFactChecksFail,
  );
  const prevFactChecksResult = useSelector(
    (state) => state.assistant.prevFactChecksResult,
  );
  const subjectivityFailState = useSelector(
    (state) => state.assistant.subjectivityFail,
  );
  const machineGeneratedTextChunksFailState = useSelector(
    (state) => state.assistant.machineGeneratedChunksTextFail,
  );
  const machineGeneratedTextSentencesFailState = useSelector(
    (state) => state.assistant.machineGeneratedTextSentencesFail,
  );
  const multilingualStanceFailState = useSelector(
    (state) => state.assistant.multilingualStanceFail,
  );

  //local state
  const [formInput, setFormInput] = useState(inputUrl);

  // clean assistant
  const cleanAssistant = () => {
    dispatch(cleanAssistantState());
    setFormInput("");
  };

  // set correct error message
  useEffect(() => {
    if (errorKey) {
      dispatch(setError(keyword(errorKey)));
      cleanAssistant();
    }
  }, [errorKey]);

  // if a url is present in the plugin url(as a param), set it to input
  useEffect(() => {
    if (url !== undefined) {
      let uri = url !== null ? decodeURIComponent(url) : undefined;
      dispatch(setUrlMode(true));
      setFormInput(uri);
      dispatch(submitInputUrl(uri));
      navigate("/app/assistant/" + encodeURIComponent(url));
    }
  }, [url]);

  // for having a single results section with a close button
  const handleClose = () => {
    //setFormInput("");
    cleanAssistant();
    dispatch(setUrlMode(true));
  };

  return (
    <Grid
      container
      spacing={4}
      direction="column"
      className={classes.root}
      sx={{
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {/* introduction */}
      <Grid
        size="grow"
        sx={{
          width: "100%",
        }}
      >
        <AssistantIntroduction cleanAssistant={cleanAssistant} />
      </Grid>
      {/* url entry field */}
      {urlMode ? (
        <Grid
          size="grow"
          sx={{
            width: "100%",
          }}
        >
          <AssistantUrlSelected
            formInput={formInput}
            setFormInput={setFormInput}
            cleanAssistant={cleanAssistant}
          />
        </Grid>
      ) : null}
      {/* local file selection field */}
      {imageVideoSelected ? (
        <Grid
          size="grow"
          sx={{
            width: "100%",
          }}
        >
          <AssistantFileSelected />
        </Grid>
      ) : null}
      {/* assistant status */}
      {scFailState ||
      dbkfTextFailState ||
      dbkfMediaFailState ||
      neFailState ||
      newsFramingFailState ||
      newsGenreFailState ||
      persuasionFailState ||
      subjectivityFailState ||
      prevFactChecksFailState ||
      machineGeneratedTextChunksFailState ||
      machineGeneratedTextSentencesFailState ||
      multilingualStanceFailState ? (
        <Grid size={{ xs: 12 }}>
          <AssistantCheckStatus />
        </Grid>
      ) : null}
      {/* assistant results section */}
      {urlMode && inputUrl ? (
        <Card variant="outlined" sx={{ width: "100%", mb: 2 }}>
          <CardHeader
            className={classes.assistantCardHeader}
            title={
              <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
                {keyword("assistant_results")}
              </Typography>
            }
            action={
              <IconButton aria-label="close" onClick={handleClose}>
                <Close
                  sx={{ color: resolvedMode === "dark" ? "white" : "grey" }}
                />
              </IconButton>
            }
          />

          <CardContent>
            <Grid container spacing={4}>
              {/* warnings and api status checks */}
              {dbkfTextMatch ||
              dbkfImageResult ||
              dbkfVideoMatch ||
              prevFactChecksResult ? (
                <Grid
                  size={{ xs: 12 }}
                  className={classes.assistantGrid}
                  hidden={urlMode === false}
                >
                  <AssistantWarnings />
                </Grid>
              ) : null}

              {/* source credibility//URL domain analysis results */}
              {positiveSourceCred || cautionSourceCred || mixedSourceCred ? (
                <Grid size={{ xs: 12 }}>
                  <AssistantSCResults />
                </Grid>
              ) : null}

              {/* media results */}
              {imageList.length > 0 ||
              videoList.length > 0 ||
              imageVideoSelected ? (
                <Grid size={{ xs: 12 }}>
                  <AssistantMediaResult />
                </Grid>
              ) : null}

              {/* YouTube comments if video */}
              {collectedComments.length > 0 ? (
                <Grid size={12}>
                  <AssistantCommentResult
                    collectedComments={collectedComments}
                  />
                </Grid>
              ) : null}

              {/* text results */}
              {text ? (
                <Grid size={{ xs: 12 }}>
                  <AssistantTextResult />
                </Grid>
              ) : null}

              {/* named entity results */}
              {text && neResult ? (
                <Grid size={{ xs: 12 }}>
                  <AssistantNEResult />
                </Grid>
              ) : null}

              {/* extracted urls with url domain analysis */}
              {text && linkList.length !== 0 ? (
                <Grid size={{ xs: 12 }}>
                  <AssistantLinkResult />
                </Grid>
              ) : null}
            </Grid>
          </CardContent>
        </Card>
      ) : null}
    </Grid>
  );
};
export default Assistant;
