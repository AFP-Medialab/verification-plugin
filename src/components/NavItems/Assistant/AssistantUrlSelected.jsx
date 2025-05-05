import React, { useState } from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

// version 5.2.0
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { useTrackEvent } from "../../../Hooks/useAnalytics";
import {
  cleanAssistantState,
  submitInputUrl,
} from "../../../redux/actions/tools/assistantActions";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import { KNOWN_LINKS } from "./AssistantRuleBook";
import {
  TransHtmlDoubleLineBreak,
  TransSupportedUrlsLink,
} from "./TransComponents";

const AssistantUrlSelected = (props) => {
  // styles, language, dispatch, params
  const navigate = useNavigate();
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  //form states
  const inputUrl = useSelector((state) => state.assistant.inputUrl);
  const inputUrlType = useSelector((state) => state.assistant.inputUrlType);
  const loading = useSelector((state) => state.assistant.loading);

  //local state
  const formInput = props.formInput || "";
  const setFormInput = (value) => props.setFormInput(value);
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
    dispatch(cleanAssistantState());
    setUrl(formInput);
    dispatch(submitInputUrl(formInput));
    navigate("/app/assistant/" + encodeURIComponent(formInput));
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
    <div>
      <Card variant="outlined">
        <CardHeader
          className={classes.assistantCardHeader}
          title={
            <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
              {keyword("assistant_give_url")}
            </Typography>
          }
          action={
            <Tooltip
              interactive={"true"}
              title={
                <>
                  <Trans
                    t={keyword}
                    i18nKey="assistant_help_3" // update this for bluesky and vk and others?
                    components={{
                      b: <b />,
                      ul: <ul />,
                      li: <li />,
                    }}
                  />
                  <TransHtmlDoubleLineBreak keyword={keyword} />
                  <TransSupportedUrlsLink keyword={keyword} />
                </>
              }
              classes={{ tooltip: classes.assistantTooltip }}
            >
              <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
            </Tooltip>
          }
        />

        <CardContent>
          <Box sx={{ mr: 2 }}>
            <form>
              <Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  {/* text box */}
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

                  {/* submit button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    data-testid="assistant-url-selected-analyse-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmissionURL();
                    }}
                  >
                    {keyword("button_submit")}
                  </Button>
                </Stack>

                {/* archive */}
                {inputUrl === null ? null : (
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "flex-start",
                      alignItems: "left",
                    }}
                  >
                    <Button
                      onClick={() => handleArchive()}
                      startIcon={<ArchiveOutlinedIcon />}
                    >
                      <label>{keyword("archive_link")}</label>
                    </Button>
                  </Stack>
                )}
              </Stack>
            </form>
          </Box>
        </CardContent>
      </Card>
      {loading && (
        <Card sx={{ mt: 4 }}>
          <Stack
            direction="column"
            spacing={4}
            sx={{
              p: 4,
            }}
          >
            <Skeleton variant="rounded" height={40} />
            <Skeleton variant="rounded" width="50%" height={40} />
          </Stack>
        </Card>
      )}
    </div>
  );
};

export default AssistantUrlSelected;
