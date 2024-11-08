import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { setStateExpanded } from "../../../../redux/actions/tools/assistantActions";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Alert } from "@mui/material";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

const AssistantCheckStatus = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const stateExpanded = useSelector((state) => state.assistant.stateExpanded);

  const scTitle = keyword("source_cred_title");
  const scFailState = useSelector((state) => state.assistant.inputSCFail);
  const dbkfTextTitle = keyword("dbkf_text_title");
  const dbkfTextFailState = useSelector(
    (state) => state.assistant.dbkfTextMatchFail,
  );
  const dbkfMediaTitle = keyword("dbkf_media_title");
  const dbkfMediaFailState = useSelector(
    (state) => state.assistant.dbkfMediaMatchFail,
  );

  const neTitle = keyword("ne_title");
  const neFailState = useSelector((state) => state.assistant.neFail);

  const newsFramingTitle = keyword("news_framing_title");
  const newsFramingFailState = useSelector(
    (state) => state.assistant.newsFramingFail,
  );

  const newsGenreTitle = keyword("news_genre_title");
  const newsGenreFailState = useSelector(
    (state) => state.assistant.newsGenreFail,
  );

  const persuasionTitle = keyword("persuasion_techniques_title");
  const persuasionFailState = useSelector(
    (state) => state.assistant.persuasionFail,
  );

  const subjectivityTitle = keyword("subjectivity_title");
  const subjectivityFailState = useSelector(
    (state) => state.assistant.subjectivityFail,
  );

  const prevFactChecksTitle = keyword("previous_fact_checks_title");
  const prevFactChecksFailState = useSelector(
    (state) => state.assistant.prevFactChecksFail,
  );

  const machineGeneratedTextTitle = keyword("machine_generated_text_title");
  const machineGeneratedTextFailState = useSelector(
    (state) => state.assistant.machineGeneratedTextFail,
  );

  const failStates = [
    { title: scTitle, failed: scFailState },
    { title: dbkfMediaTitle, failed: dbkfMediaFailState },
    { title: dbkfTextTitle, failed: dbkfTextFailState },
    { title: neTitle, failed: neFailState },
    { title: newsFramingTitle, failed: newsFramingFailState },
    { title: newsGenreTitle, failed: newsGenreFailState },
    { title: persuasionTitle, failed: persuasionFailState },
    { title: subjectivityTitle, failed: subjectivityFailState },
    { title: prevFactChecksTitle, failed: prevFactChecksFailState },
    { title: machineGeneratedTextTitle, failed: machineGeneratedTextFailState },
  ];

  return (
    <Alert severity="warning">
      <Typography component={"span"}>
        <Box color={"orange"} fontStyle="italic">
          {keyword("status_subtitle")}
          <IconButton
            className={classes.assistantIconRight}
            onClick={() => dispatch(setStateExpanded(!stateExpanded))}
          >
            <ExpandMoreIcon style={{ color: "orange" }} />
          </IconButton>
        </Box>
      </Typography>

      <Collapse in={stateExpanded} className={classes.assistantBackground}>
        <List disablePadding={true}>
          {failStates.map((value, key) =>
            value.failed ? (
              <ListItem key={key}>
                <ListItemText primary={value.title} />
              </ListItem>
            ) : null,
          )}
        </List>
      </Collapse>
    </Alert>
  );
};
export default AssistantCheckStatus;
