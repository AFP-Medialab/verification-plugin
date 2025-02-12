import React, { useState } from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid2 from "@mui/material/Grid2";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LinkIcon from "@mui/icons-material/Link";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import {
  setImageVideoSelected,
  setUrlMode,
} from "../../../redux/actions/tools/assistantActions";
import AssistantIcon from "../../NavBar/images/navbar/assistant-icon-primary.svg";
import HeaderTool from "../../Shared/HeaderTool/HeaderTool";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import {
  TransHtmlDoubleLineBreak,
  TransSupportedUrlsLink,
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
    classButtonURL !== classes.bigButtonDivSelectted &&
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

  if (urlMode && classButtonURL !== classes.bigButtonDivSelectted) {
    setClassButtonURL(classes.bigButtonDivSelectted);
    setClassIconURL(classes.bigButtonIconSelectted);
  } else if (
    imageVideoSelected &&
    classButtonLocal !== classes.bigButtonDivSelectted
  ) {
    setClassButtonLocal(classes.bigButtonDivSelectted);
    setClassIconLocal(classes.bigButtonIconSelectted);
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
      <Card>
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
                  <Trans
                    t={keyword}
                    i18nKey="assistant_help_2"
                    components={{
                      b: <b />,
                      ul: <ul />,
                      li: <li />,
                    }}
                  />
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
          <Box m={2}>
            <Grid2 container spacing={3} alignItems="flex-start">
              <Grid2 size={{ xs: 6 }}>
                <Box
                  data-testid="assistant-webpage-link"
                  p={3}
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
                      setClassButtonURL(classes.bigButtonDivSelectted);
                      setClassIconURL(classes.bigButtonIconSelectted);

                      setClassButtonLocal(classes.bigButtonDiv);
                      setClassIconLocal(classes.bigButtonIcon);

                      setShowURL(true);
                      setShowLocal(false);
                    }
                  }}
                >
                  <Grid2
                    container
                    direction="row"
                    style={{ flexWrap: "nowrap" }}
                    spacing={2}
                  >
                    <Grid2 size={{ xs: 1 }}>
                      <LinkIcon className={classIconURL} />
                    </Grid2>
                    <Grid2>
                      <Grid2
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        <Grid2>
                          <Typography
                            variant="body1"
                            style={{ fontWeight: 600 }}
                            textAlign={"start"}
                          >
                            {keyword("assistant_webpage_header")}
                          </Typography>
                        </Grid2>

                        <Box mt={1} />

                        <Grid2>
                          <Typography variant="body1" textAlign={"start"}>
                            {keyword("assistant_webpage_text")}
                          </Typography>
                        </Grid2>
                      </Grid2>
                    </Grid2>
                  </Grid2>
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 6 }}>
                <Box
                  p={3}
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

                      setClassButtonLocal(classes.bigButtonDivSelectted);
                      setClassIconLocal(classes.bigButtonIconSelectted);

                      setShowURL(false);
                      setShowLocal(true);
                    }
                  }}
                >
                  <Grid2
                    container
                    direction="row"
                    style={{ flexWrap: "nowrap" }}
                    spacing={2}
                  >
                    <Grid2 size={{ xs: 1 }}>
                      <InsertDriveFileIcon className={classIconLocal} />
                    </Grid2>

                    <Grid2>
                      <Grid2
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={1}
                      >
                        <Grid2 size={{ xs: 12 }}>
                          <Typography
                            variant="body1"
                            style={{ fontWeight: 600 }}
                            textAlign={"start"}
                          >
                            {keyword("assistant_file_header")}
                          </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <Typography variant="body1" textAlign={"start"}>
                            {keyword("assistant_file_text")}
                          </Typography>
                        </Grid2>
                      </Grid2>
                    </Grid2>
                  </Grid2>
                </Box>
              </Grid2>
            </Grid2>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssistantIntroduction;
