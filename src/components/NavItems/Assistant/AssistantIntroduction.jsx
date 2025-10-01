import React, { useState } from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LinkIcon from "@mui/icons-material/Link";

import AssistantIcon from "@/components/NavBar/images/navbar/assistant-icon-primary.svg";
import HeaderTool from "@/components/Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import {
  setImageVideoSelected,
  setUrlMode,
} from "@/redux/actions/tools/assistantActions";

import {
  TransAssistantHelpTwoTooltip,
  TransHtmlDoubleLineBreak,
  TransSupportedToolsLink,
} from "./TransComponents";

const AssistantIntroduction = (props) => {
  // styles, language, dispatch, params
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  const [classButtonURL, setClassButtonURL] = useState(null);
  const [classButtonLocal, setClassButtonLocal] = useState(null);

  const [classIconURL, setClassIconURL] = useState(classes.bigButtonIcon);
  const [classIconLocal, setClassIconLocal] = useState(classes.bigButtonIcon);

  const [showURL, setShowURL] = useState(false);
  const [showLocal, setShowLocal] = useState(false);

  const [firstRender, setFirstRender] = useState(true);

  if (
    !showURL &&
    !showLocal &&
    classButtonURL !== classes.bigButtonDivSelected &&
    classButtonLocal !== classes.bigButtonDiv &&
    firstRender
  ) {
    setClassButtonURL(classes.bigButtonDiv);
    setClassButtonLocal(classes.bigButtonDiv);
    setFirstRender(false);
  }

  //form states
  const urlMode = useSelector((state) => state.assistant.urlMode);
  const imageVideoSelected = useSelector(
    (state) => state.assistant.imageVideoSelected,
  );

  if (urlMode && classButtonURL !== classes.bigButtonDivSelected) {
    setClassButtonURL(classes.bigButtonDivSelected);
    setClassIconURL(classes.bigButtonIconSelected);
  } else if (
    imageVideoSelected &&
    classButtonLocal !== classes.bigButtonDivSelected
  ) {
    setClassButtonLocal(classes.bigButtonDivSelected);
    setClassIconLocal(classes.bigButtonIconSelected);
  }

  const cleanAssistant = () => props.cleanAssistant();

  return (
    <div>
      <HeaderTool
        name={keyword("assistant_title")}
        description={keyword("assistant_intro")}
        icon={
          <AssistantIcon
            style={{ marginRight: "10px" }}
            width="40px"
            height="40px"
          />
        }
      />
      <Card variant="outlined">
        <CardHeader
          className={classes.assistantCardHeader}
          title={
            <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
              {keyword("assistant_choose")}
            </Typography>
          }
          action={
            <Tooltip
              interactive={"true"}
              title={
                <>
                  <Trans
                    t={keyword}
                    i18nKey="assistant_help_title"
                    components={{
                      b: <b />,
                    }}
                  />
                  <TransHtmlDoubleLineBreak keyword={keyword} />
                  <Trans t={keyword} i18nKey="assistant_help_1" />
                  <TransHtmlDoubleLineBreak keyword={keyword} />
                  <TransAssistantHelpTwoTooltip keyword={keyword} />
                  <TransSupportedToolsLink keyword={keyword} />
                </>
              }
              classes={{ tooltip: classes.assistantTooltip }}
            >
              <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
            </Tooltip>
          }
        />

        <CardContent>
          <Box
            sx={{
              m: 2,
            }}
          >
            <Grid
              container
              spacing={3}
              sx={{
                alignItems: "flex-start",
              }}
            >
              <Grid size={{ xs: 6 }}>
                <Box
                  data-testid="assistant-webpage-link"
                  className={classButtonURL}
                  onClick={() => {
                    if (!urlMode) {
                      window.scroll({
                        top: 200,
                        left: 0,
                        behavior: "smooth",
                      });
                      cleanAssistant();
                      dispatch(setUrlMode(!urlMode));
                      setClassButtonURL(classes.bigButtonDivSelected);
                      setClassIconURL(classes.bigButtonIconSelected);

                      setClassButtonLocal(classes.bigButtonDiv);
                      setClassIconLocal(classes.bigButtonIcon);

                      setShowURL(true);
                      setShowLocal(false);
                    }
                  }}
                  sx={{
                    p: 3,
                  }}
                >
                  <Grid
                    container
                    direction="row"
                    style={{ flexWrap: "nowrap" }}
                    spacing={2}
                  >
                    <Grid size={{ xs: 1 }}>
                      <LinkIcon className={classIconURL} />
                    </Grid>
                    <Grid>
                      <Grid
                        container
                        direction="column"
                        sx={{
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                      >
                        <Grid>
                          <Typography
                            variant="body1"
                            style={{ fontWeight: 600 }}
                            sx={{
                              textAlign: "start",
                            }}
                          >
                            {keyword("assistant_webpage_header")}
                          </Typography>
                        </Grid>

                        <Box
                          sx={{
                            mt: 1,
                          }}
                        />

                        <Grid>
                          <Typography
                            variant="body1"
                            sx={{
                              textAlign: "start",
                            }}
                          >
                            {keyword("assistant_webpage_text")}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Box
                  className={classButtonLocal}
                  onClick={() => {
                    if (!imageVideoSelected) {
                      setTimeout(function () {
                        window.scroll({
                          top: 320,
                          left: 0,
                          behavior: "smooth",
                        });
                      }, 100);

                      cleanAssistant();
                      dispatch(setImageVideoSelected(!imageVideoSelected));
                      setClassButtonURL(classes.bigButtonDiv);
                      setClassIconURL(classes.bigButtonIcon);

                      setClassButtonLocal(classes.bigButtonDivSelected);
                      setClassIconLocal(classes.bigButtonIconSelected);

                      setShowURL(false);
                      setShowLocal(true);
                    }
                  }}
                  sx={{
                    p: 3,
                  }}
                >
                  <Grid
                    container
                    direction="row"
                    style={{ flexWrap: "nowrap" }}
                    spacing={2}
                  >
                    <Grid size={{ xs: 1 }}>
                      <InsertDriveFileIcon className={classIconLocal} />
                    </Grid>

                    <Grid>
                      <Grid
                        container
                        direction="column"
                        spacing={1}
                        sx={{
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                      >
                        <Grid size={{ xs: 12 }}>
                          <Typography
                            variant="body1"
                            style={{ fontWeight: 600 }}
                            sx={{
                              textAlign: "start",
                            }}
                          >
                            {keyword("assistant_file_header")}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              textAlign: "start",
                            }}
                          >
                            {keyword("assistant_file_text")}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssistantIntroduction;
