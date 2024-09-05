import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Divider from "@mui/material/Divider";
import { Grid2 } from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";

import AssistantCheckStatus from "./AssistantCheckResults/AssistantCheckStatus";
import AssistantFileSelected from "./AssistantFileSelected";
import AssistantIntroduction from "./AssistantIntroduction";
import AssistantLinkResult from "./AssistantScrapeResults/AssistantLinkResult";
import AssistantMediaResult from "./AssistantScrapeResults/AssistantMediaResult";
import AssistantNEResult from "./AssistantCheckResults/AssistantNEResult";
import AssistantSCResults from "./AssistantScrapeResults/AssistantSCResults";
import AssistantTextResult from "./AssistantScrapeResults/AssistantTextResult";
import AssistantUrlSelected from "./AssistantUrlSelected";
import AssistantWarnings from "./AssistantScrapeResults/AssistantWarnings";
import AssistantCredSignals from "./AssistantScrapeResults/AssistantCredibilitySignals";

import {
  cleanAssistantState,
  setUrlMode,
  submitInputUrl,
} from "../../../redux/actions/tools/assistantActions";
import { setError } from "redux/reducers/errorReducer";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

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
      navigate("/app/assistant/");
      //history.push("/app/assistant/");
    }
  }, [url]);

  return (
    <div>
      <Grid2
        container
        spacing={4}
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        className={classes.root}
      >
        {/* introduction */}
        <Grid2 size="grow" width={"inherit"}>
          <AssistantIntroduction cleanAssistant={cleanAssistant} />
        </Grid2>

        {/* url entry field */}
        {urlMode ? (
          <Grid2 size="grow" width={"inherit"}>
            <AssistantUrlSelected
              formInput={formInput}
              setFormInput={setFormInput}
              cleanAssistant={cleanAssistant}
            />
          </Grid2>
        ) : null}

        {/* local file selection field */}
        {imageVideoSelected ? (
          <Grid2 size="grow" width={"inherit"}>
            <AssistantFileSelected />
          </Grid2>
        ) : null}

        {/* warnings and api status checks */}
        {dbkfTextMatch || dbkfImageResult || dbkfVideoMatch ? (
          <Grid2
            size="grow"
            className={classes.assistantGrid}
            hidden={urlMode === null || urlMode === false}
          >
            <AssistantWarnings />
          </Grid2>
        ) : null}

        {positiveSourceCred || cautionSourceCred || mixedSourceCred ? (
          <Grid2 size="grow">
            <AssistantSCResults />
          </Grid2>
        ) : null}

        {scFailState ||
        dbkfTextFailState ||
        dbkfMediaFailState ||
        neFailState ||
        newsFramingFailState ||
        newsGenreFailState ? (
          <Grid2 size="grow">
            <AssistantCheckStatus />
          </Grid2>
        ) : null}

        {/* media results */}
        <Grid2 size="grow" width={"inherit"}>
          <Card
            className={classes.root}
            hidden={
              !urlMode ||
              (urlMode && inputUrl === null) ||
              (urlMode &&
                inputUrl !== null &&
                !imageList.length &&
                !videoList.length)
            }
            data-testid="url-media-results"
          >
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant={"h5"} align={"left"}>
                  {keyword("url_media")}
                </Typography>
                <Divider />
              </Grid2>

              {imageList.length > 0 ||
              videoList.length > 0 ||
              imageVideoSelected ? (
                <Grid2 size={{ xs: 12 }}>
                  <AssistantMediaResult />
                </Grid2>
              ) : null}
            </Grid2>
          </Card>
        </Grid2>

        {/* text results */}
        <Grid2 size="grow" width={"inherit"}>
          <Card
            className={classes.root}
            hidden={linkList.length === 0 && text === null && neResult === null}
          >
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant={"h5"} align={"left"}>
                  {keyword("url_text")}
                </Typography>
                <Divider />
              </Grid2>

              {text ? (
                <Grid2 size={{ xs: 12 }}>
                  <AssistantTextResult />
                </Grid2>
              ) : null}

              {neResult ? (
                <Grid2 size={{ xs: 12 }}>
                  <AssistantNEResult />
                </Grid2>
              ) : null}

              {linkList.length !== 0 ? (
                <Grid2 size={{ xs: 12 }}>
                  <AssistantLinkResult />
                </Grid2>
              ) : null}

              {text ? (
                <Grid2 size={{ xs: 12 }}>
                  <AssistantCredSignals />
                </Grid2>
              ) : null}
            </Grid2>
          </Card>
        </Grid2>
      </Grid2>
    </div>
  );
};
export default Assistant;
