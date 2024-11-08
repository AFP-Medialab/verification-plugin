import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // version 5.2.0

import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import { Box, CardHeader, Skeleton, TextField } from "@mui/material/";
import Button from "@mui/material//Button";
import Card from "@mui/material//Card";
import CardContent from "@mui/material//CardContent";
import Typography from "@mui/material//Typography";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { KNOWN_LINKS } from "./AssistantRuleBook";
import { submitInputUrl } from "../../../redux/actions/tools/assistantActions";

import { useTrackEvent } from "../../../Hooks/useAnalytics";
import Stack from "@mui/material/Stack";

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
    cleanAssistant();
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
      <Card>
        <CardHeader
          className={classes.assistantCardHeader}
          title={
            <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
              {keyword("assistant_give_url")}
            </Typography>
          }
        />

        <CardContent>
          <Box sx={{ mr: 2 }}>
            <form>
              <Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-start"
                  alignItems="center"
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
                    justifyContent="flex-start"
                    alignItems="left"
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
          <Stack direction="column" spacing={4} p={4}>
            <Skeleton variant="rounded" height={40} />
            <Skeleton variant="rounded" width="50%" height={40} />
          </Stack>
        </Card>
      )}
    </div>
  );
};

export default AssistantUrlSelected;
