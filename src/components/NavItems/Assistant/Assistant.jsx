import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { Close } from "@mui/icons-material";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { setError } from "redux/reducers/errorReducer";

import { ROLES } from "../../../constants/roles.jsx";
import {
  cleanAssistantState,
  setUrlMode,
  submitInputUrl,
} from "../../../redux/actions/tools/assistantActions";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import AssistantCheckStatus from "./AssistantCheckResults/AssistantCheckStatus";
import AssistantNEResult from "./AssistantCheckResults/AssistantNEResult";
import AssistantFileSelected from "./AssistantFileSelected";
import AssistantIntroduction from "./AssistantIntroduction";
import AssistantCommentResult from "./AssistantScrapeResults/AssistantCommentResult";
import AssistantCredSignals from "./AssistantScrapeResults/AssistantCredibilitySignals";
import AssistantLinkResult from "./AssistantScrapeResults/AssistantLinkResult";
import AssistantMediaResult from "./AssistantScrapeResults/AssistantMediaResult";
import AssistantSCResults from "./AssistantScrapeResults/AssistantSCResults";
import AssistantTextResult from "./AssistantScrapeResults/AssistantTextResult";
import AssistantWarnings from "./AssistantScrapeResults/AssistantWarnings";
import AssistantUrlSelected from "./AssistantUrlSelected";

const Assistant = () => {
  // styles, language, dispatch, params
  const { url } = useParams();
  const navigate = useNavigate();
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  //form states
  const inputUrl = useSelector((state) => state.assistant.inputUrl);
  const urlMode = useSelector((state) => state.assistant.urlMode);
  const imageVideoSelected = useSelector(
    (state) => state.assistant.imageVideoSelected,
  );

  //result states
  const imageList = useSelector((state) => state.assistant.imageList);
  const videoList = useSelector((state) => state.assistant.videoList);
  const text = useSelector((state) => state.assistant.urlText);
  const linkList = useSelector((state) => state.assistant.linkList);
  const collectedComments = useSelector(
    (state) => state.assistant.collectedComments,
  );
  const errorKey = useSelector((state) => state.assistant.errorKey);

  // checking if user logged in
  const role = useSelector((state) => state.userSession.user.roles);

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

  //third party fail states
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
  const previousFactChecksFailState = useSelector(
    (state) => state.assistant.previousFactChecksFail,
  );
  const subjectivityFailState = useSelector(
    (state) => state.assistant.subjectivityFail,
  );
  const machineGeneratedTextFailState = useSelector(
    (state) => state.assistant.machineGeneratedTextFail,
  );
  // const mtFailState = useSelector(state => state.assistant.mtFail)

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
    <Grid2
      container
      spacing={4}
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      className={classes.root}
    >
      {/* introduction */}
      <Grid2 size="grow" width="100%">
        <AssistantIntroduction cleanAssistant={cleanAssistant} />
      </Grid2>

      {/* url entry field */}
      {urlMode ? (
        <Grid2 size="grow" width="100%">
          <AssistantUrlSelected
            formInput={formInput}
            setFormInput={setFormInput}
            cleanAssistant={cleanAssistant}
          />
        </Grid2>
      ) : null}

      {/* local file selection field */}
      {imageVideoSelected ? (
        <Grid2 size="grow" width="100%">
          <AssistantFileSelected />
        </Grid2>
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
      previousFactChecksFailState ||
      machineGeneratedTextFailState ? (
        <Grid2 size={{ xs: 12 }}>
          <AssistantCheckStatus />
        </Grid2>
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
                <Close sx={{ color: "white" }} />
              </IconButton>
            }
          />

          <CardContent>
            <Grid2 container spacing={4}>
              {/* warnings and api status checks */}
              {dbkfTextMatch || dbkfImageResult || dbkfVideoMatch ? (
                <Grid2
                  size={{ xs: 12 }}
                  className={classes.assistantGrid}
                  hidden={urlMode === null || urlMode === false}
                >
                  <AssistantWarnings />
                </Grid2>
              ) : null}

              {/* source crediblity//URL domain analysis results */}
              {positiveSourceCred || cautionSourceCred || mixedSourceCred ? (
                <Grid2 size={{ xs: 12 }}>
                  <AssistantSCResults />
                </Grid2>
              ) : null}

              {/* media results */}
              {imageList.length > 0 ||
              videoList.length > 0 ||
              imageVideoSelected ? (
                <Grid2 size={{ xs: 12 }}>
                  <AssistantMediaResult />
                </Grid2>
              ) : null}

              {/* YouTube comments if video */}
              {collectedComments ? (
                <Grid2 size={12}>
                  <AssistantCommentResult
                    collectedComments={collectedComments}
                  />
                </Grid2>
              ) : null}

              {/* text results */}
              {text ? (
                <Grid2 size={{ xs: 12 }}>
                  <AssistantTextResult />
                </Grid2>
              ) : null}

              {/* named entity results */}
              {text && neResult ? (
                <Grid2 size={{ xs: 12 }}>
                  <AssistantNEResult />
                </Grid2>
              ) : null}

              {/* extracted urls with url domain analysis */}
              {text && linkList.length !== 0 ? (
                <Grid2 size={{ xs: 12 }}>
                  <AssistantLinkResult />
                </Grid2>
              ) : null}

              {/* credibility signals */}
              {role.includes(ROLES.BETA_TESTER) && text ? (
                <Grid2 size={{ xs: 12 }}>
                  <AssistantCredSignals />
                </Grid2>
              ) : null}
            </Grid2>
          </CardContent>
        </Card>
      ) : null}
    </Grid2>
  );
};
export default Assistant;
