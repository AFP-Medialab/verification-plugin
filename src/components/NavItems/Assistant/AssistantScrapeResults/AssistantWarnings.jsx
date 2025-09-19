import React from "react";
import { useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import DbkfMediaResults from "@/components/NavItems/Assistant/AssistantCheckResults/DbkfMediaResults";
import DbkfTextResults from "@/components/NavItems/Assistant/AssistantCheckResults/DbkfTextResults";
import PreviousFactCheckResults from "@/components/NavItems/Assistant/AssistantCheckResults/PreviousFactCheckResults";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { ROLES } from "@/constants/roles";

const AssistantWarnings = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();

  // checking if user logged in
  const role = useSelector((state) => state.userSession.user.roles);

  // state
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
            <Typography>{keyword("dbkf_title")}</Typography>
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
