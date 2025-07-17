import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningAmber from "@mui/icons-material/WarningAmber";

import DbkfMediaResults from "@/components/NavItems/Assistant/AssistantCheckResults/DbkfMediaResults";
import DbkfTextResults from "@/components/NavItems/Assistant/AssistantCheckResults/DbkfTextResults";
import PreviousFactCheckResults from "@/components/NavItems/Assistant/AssistantCheckResults/PreviousFactCheckResults";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { ROLES } from "@/constants/roles";
import { setWarningExpanded } from "@/redux/actions/tools/assistantActions";

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
    <Card variant="outlined">
      <CardHeader
        className={classes.assistantCardHeader}
        title={
          <Alert severity="warning" sx={{ bgcolor: "background.paper" }}>
            <Typography>Database of known fakes matches</Typography>
          </Alert>
        }
      />
      <CardContent>
        {dbkfTextMatch && <DbkfTextResults />}

        {(dbkfImageMatch || dbkfVideoMatch) && <DbkfMediaResults />}

        {role.includes(ROLES.BETA_TESTER) && prevFactChecksResult && (
          <PreviousFactCheckResults />
        )}
      </CardContent>
    </Card>
  );
};
export default AssistantWarnings;
