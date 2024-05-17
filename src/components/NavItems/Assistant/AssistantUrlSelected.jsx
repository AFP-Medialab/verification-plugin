import React from "react";
import { useDispatch, useSelector } from "react-redux";

import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import { Box, CardHeader, TextField } from "@mui/material/";
import Button from "@mui/material//Button";
import Card from "@mui/material//Card";
import CardContent from "@mui/material//CardContent";
import Grid from "@mui/material//Grid";
import LinearProgress from "@mui/material//LinearProgress";
import Typography from "@mui/material//Typography";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { KNOWN_LINKS } from "./AssistantRuleBook";
import { submitInputUrl } from "../../../redux/actions/tools/assistantActions";

import { useTrackEvent } from "../../../Hooks/useAnalytics";
import { useState } from "react";

const AssistantUrlSelected = (props) => {
  // styles, language, dispatch, params
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  //form states
  const inputUrl = useSelector((state) => state.assistant.inputUrl);
  const inputUrlType = useSelector((state) => state.assistant.inputUrlType);
  const loading = useSelector((state) => state.assistant.loading);

  //local state
  const formInput = props.formInput;
  const setFormInput = (value) => props.setFormInput(value);
  const cleanAssistant = () => props.cleanAssistant();
  const [url, setUrl] = useState(undefined);

  useTrackEvent(
    "submission",
    "assistant",
    "page assistant",
    formInput,
    null,
    url,
  );

  const handleSubmissionURL = () => {
    setUrl(formInput);
    dispatch(submitInputUrl(formInput));
    //trackEvent("submission", "assistant", "page assistant", formInput);
  };

  const handleArchive = () => {
    let archiveUrl = "";

    switch (inputUrlType) {
      case KNOWN_LINKS.FACEBOOK:
        archiveUrl =
          "https://www.facebook.com/plugins/post.php?href=" +
          encodeURIComponent(inputUrl);
        break;
      case KNOWN_LINKS.INSTAGRAM:
        if (inputUrl.endsWith("/"))
          archiveUrl = inputUrl.endsWith("/")
            ? inputUrl + "embed/captioned/"
            : inputUrl + "/embed/captioned/";
        break;
      default:
        archiveUrl = inputUrl;
    }
    navigator.clipboard.writeText(archiveUrl).then(() => {
      window.open("https://web.archive.org/save/" + archiveUrl, "_blank");
    });
  };

  return (
    <Card>
      <CardHeader
        className={classes.assistantCardHeader}
        title={
          <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
            {keyword("assistant_give_url")}
          </Typography>
        }
      />

      {loading && <LinearProgress color={"secondary"} />}

      <CardContent>
        <Box mr={2}>
          <form>
            <Grid container>
              <Grid item xs={10}>
                <TextField
                  variant="outlined"
                  label={keyword("assistant_paste_url")}
                  style={{ margin: 8 }}
                  placeholder={""}
                  fullWidth
                  value={formInput || ""}
                  onChange={(e) => setFormInput(e.target.value)}
                  data-testid="assistant-url-selected-input"
                />
              </Grid>
              <Grid item xs={2}>
                <Box mt={2} ml={6}>
                  {inputUrl === null ? (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      data-testid="assistant-url-selected-analyse-btn"
                      onClick={(e) => {
                        e.preventDefault(), handleSubmissionURL();
                      }}
                    >
                      {keyword("button_analyse")}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => cleanAssistant()}
                    >
                      {keyword("button_clean")}
                    </Button>
                  )}
                </Box>
              </Grid>
              {inputUrl === null ? null : (
                <Grid item xs={1}>
                  <Box ml={1}>
                    <Button
                      onClick={() => handleArchive()}
                      startIcon={<ArchiveOutlinedIcon />}
                    >
                      <label>{keyword("archive_link")}</label>
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </form>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssistantUrlSelected;
