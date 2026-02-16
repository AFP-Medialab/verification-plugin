import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import DbkfMediaResults from "@/components/NavItems/Assistant/AssistantCheckResults/DbkfMediaResults";
import DbkfTextResults from "@/components/NavItems/Assistant/AssistantCheckResults/DbkfTextResults";
import PreviousFactCheckResults from "@/components/NavItems/Assistant/AssistantCheckResults/PreviousFactCheckResults";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { ROLES } from "@/constants/roles";

import {
  TransDbkfLink,
  TransHtmlDoubleLineBreak,
  TransKinitAuthor,
  TransOntotextAuthor,
  TransPrevFactChecksLink,
} from "../TransComponents";

const AssistantWarnings = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();

  // checking if user logged in
  const role = useSelector((state) => state.userSession.user.roles);

  // state
  const dbkfTextMatch = useSelector((state) => state.assistant.dbkfTextMatch);
  const dbkfImageMatch = useSelector((state) => state.assistant.dbkfImageMatch);
  const dbkfVideoMatch = useSelector((state) => state.assistant.dbkfVideoMatch);
  const prevFactChecksDone = useSelector(
    (state) => state.assistant.prevFactChecksDone,
  );
  const prevFactChecksLoading = useSelector(
    (state) => state.assistant.prevFactChecksLoading,
  );
  const prevFactChecksResult = useSelector(
    (state) => state.assistant.prevFactChecksResult,
  );

  // wait for previous fact checks results to compare with DBKFText before showing to users
  // combine results if necessary
  // only happens if beta user logged in
  const DBKF = [
    keyword("dbkf_acronym"),
    keyword("database_of_known_fakes_explanation"),
  ];
  const FCSS = [
    keyword("fcss_acronym"),
    keyword("fact_check_semantic_search_explanation"),
  ];
  const updatedPrevFactCheckResult = [];
  const separateDbkfTextMatch = [];
  let uniqueSeparateDbkfTextMatch = [];
  if (role.includes(ROLES.BETA_TESTER)) {
    if (prevFactChecksResult && dbkfTextMatch) {
      // pfc and dbkf results
      prevFactChecksResult.forEach((pfcResult) => {
        dbkfTextMatch.forEach((dbkfResult) => {
          if (pfcResult.url === dbkfResult.externalLink) {
            updatedPrevFactCheckResult.push({
              ...pfcResult,
              factCheckServices: [FCSS, DBKF],
            });
          } else {
            updatedPrevFactCheckResult.push({
              ...pfcResult,
              factCheckServices: [FCSS],
            });
            separateDbkfTextMatch.push({
              ...dbkfResult,
              factCheckServices: [DBKF],
            });
          }
        });
      });
      uniqueSeparateDbkfTextMatch = separateDbkfTextMatch.filter(
        (obj, index, self) =>
          index === self.findIndex((item) => item.id === obj.id),
      );
    } else if (prevFactChecksResult && !dbkfTextMatch) {
      // pfc but no dbkf results
      prevFactChecksResult.forEach((pfcResult) => {
        updatedPrevFactCheckResult.push({
          ...pfcResult,
          factCheckServices: [FCSS],
        });
      });
    } else if (!prevFactChecksResult && dbkfTextMatch) {
      // dbkf but no pfc results
      dbkfTextMatch.forEach((dbkfResult) => {
        separateDbkfTextMatch.push({
          ...dbkfResult,
          factCheckServices: [DBKF],
        });
      });
      uniqueSeparateDbkfTextMatch = separateDbkfTextMatch.filter(
        (obj, index, self) =>
          index === self.findIndex((item) => item.id === obj.id),
      );
    }
  } else {
    // not logged in and dbkf only
    dbkfTextMatch
      ? dbkfTextMatch.forEach((dbkfResult) => {
          separateDbkfTextMatch.push({
            ...dbkfResult,
            factCheckServices: [DBKF],
          });
        })
      : null;
  }

  return (
    <Card variant="outlined" id="warnings">
      <CardHeader
        className={classes.assistantCardHeader}
        title={
          <Alert severity="warning" sx={{ bgcolor: "background.paper" }}>
            <Typography>{keyword("warnings_title")}</Typography>
          </Alert>
        }
        action={
          <Tooltip
            interactive={"true"}
            title={
              <>
                <Trans t={keyword} i18nKey="dbkf_tooltip" />
                <TransHtmlDoubleLineBreak keyword={keyword} />
                <TransOntotextAuthor keyword={keyword} />
                <TransHtmlDoubleLineBreak keyword={keyword} />
                <TransDbkfLink keyword={keyword} />
                {role.includes(ROLES.BETA_TESTER) ? (
                  <>
                    <TransHtmlDoubleLineBreak keyword={keyword} />
                    <Trans t={keyword} i18nKey="previous_fact_checks_tooltip" />
                    <TransHtmlDoubleLineBreak keyword={keyword} />
                    <TransKinitAuthor keyword={keyword} />
                    <TransHtmlDoubleLineBreak keyword={keyword} />
                    <TransPrevFactChecksLink keyword={keyword} />
                  </>
                ) : null}
              </>
            }
            classes={{ tooltip: classes.assistantTooltip }}
          >
            <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
          </Tooltip>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Collapse
            in={factChecksExpanded}
            className={classes.assistantBackground}
          >
            <Skeleton variant="rounded" height={40} />
            <Skeleton variant="rounded" width={400} height={40} />
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
export default AssistantWarnings;
