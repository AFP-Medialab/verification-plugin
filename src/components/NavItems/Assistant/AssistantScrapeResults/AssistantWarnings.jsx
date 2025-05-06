import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { WarningAmber } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { ROLES } from "constants/roles";

import { setWarningExpanded } from "../../../../redux/actions/tools/assistantActions";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import DbkfMediaResults from "../AssistantCheckResults/DbkfMediaResults";
import DbkfTextResults from "../AssistantCheckResults/DbkfTextResults";
import PreviousFactCheckResults from "../AssistantCheckResults/PreviousFactCheckResults";

const AssistantWarnings = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();
  const dispatch = useDispatch();

  // checking if user logged in
  const role = useSelector((state) => state.userSession.user.roles);

  // state
  const warningExpanded = useSelector(
    (state) => state.assistant.warningExpanded,
  );
  const dbkfTextMatch = useSelector((state) => state.assistant.dbkfTextMatch);
  const dbkfImageMatch = useSelector((state) => state.assistant.dbkfImageMatch);
  const dbkfVideoMatch = useSelector((state) => state.assistant.dbkfVideoMatch);
  const prevFactChecksResult = useSelector(
    (state) => state.assistant.prevFactChecksResult,
  );

  return (
    <Card
      variant="outlined"
      className={classes.assistantWarningBorder}
      id="warnings"
    >
      <Grid container>
        <Grid size={{ xs: 12 }} style={{ display: "flex" }}>
          <CardMedia>
            <Box
              sx={{
                m: 1,
              }}
            >
              <WarningAmber color={"warning"} fontSize={"large"} />
            </Box>
          </CardMedia>
          <Box
            sx={{
              m: 1,
            }}
          />
          <div>
            <Typography component={"span"} variant={"h6"} color={"warning"}>
              <Box
                sx={{
                  mt: 1.5,
                  fontWeight: "fontWeightBold",
                }}
              >
                {keyword("warning_title")}
              </Box>
            </Typography>
          </div>
          <IconButton
            className={classes.assistantIconRight}
            onClick={() => dispatch(setWarningExpanded(!warningExpanded))}
          >
            <ExpandMoreIcon color={"warning"} />
          </IconButton>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Collapse
            in={warningExpanded}
            className={classes.assistantBackground}
          >
            <Box m={1} />

            {dbkfTextMatch && <DbkfTextResults />}

            {(dbkfImageMatch || dbkfVideoMatch) && <DbkfMediaResults />}

            {role.includes(ROLES.BETA_TESTER) && prevFactChecksResult && (
              <PreviousFactCheckResults />
            )}
          </Collapse>
        </Grid>
      </Grid>
    </Card>
  );
};
export default AssistantWarnings;
