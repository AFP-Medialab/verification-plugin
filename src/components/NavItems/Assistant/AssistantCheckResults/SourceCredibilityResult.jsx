import React from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";

import SourceCredibilityDBKFDialog from "./SourceCredibilityDBKFDialog";
import { getUrlTypeFromCredScope } from "./assistantUtils";

const SourceCredibilityResult = (props) => {
  // central
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // props
  const sourceCredibilityResults = props.scResultFiltered;
  const iconColor = props.iconColor;
  const sourceType = props.sourceType;

  return (
    <List disablePadding={true}>
      {sourceCredibilityResults
        ? sourceCredibilityResults.map((value, key) => (
            <ListItem key={key}>
              <ListItemText
                primary={
                  <Box>
                    <Typography
                      variant={"body1"}
                      component={"div"}
                      color={"textPrimary"}
                    >
                      {value.credibilityScope &&
                      value.credibilityScope.includes("/") ? (
                        <Typography>
                          {` ${keyword("this")}`}
                          {getUrlTypeFromCredScope(value.credibilityScope)}
                          {` ${keyword("source_credibility_warning_account")} ${" "}${value.credibilitySource}`}
                        </Typography>
                      ) : value.credibilityScope ? (
                        <Typography>
                          {` ${keyword("source_credibility_warning_domain")} ${" "}${value.credibilitySource}`}
                        </Typography>
                      ) : null}
                    </Typography>
                    <Box
                      sx={{
                        mb: 0.5,
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Typography
                    variant={"caption"}
                    component={"div"}
                    color={"textSecondary"}
                  >
                    {value.credibilityScope &&
                    value.credibilityScope.includes("/") ? (
                      <Typography variant={"subtitle2"}>
                        {` ${" "} ${keyword("account_scope")} ${value.credibilityScope} `}
                      </Typography>
                    ) : value.credibilityScope ? (
                      <Typography variant={"subtitle2"}>
                        {` ${keyword("domain_scope")} ${value.credibilityScope} `}
                      </Typography>
                    ) : null}
                    {value.credibilityLabels ? (
                      <Typography variant={"subtitle2"}>
                        {` ${keyword("labelled_as")} ${value.credibilityLabels} `}
                      </Typography>
                    ) : null}
                    {value.credibilityDescription ? (
                      <Typography variant={"subtitle2"}>
                        {` ${keyword("commented_as")} ${value.credibilityDescription} `}
                      </Typography>
                    ) : null}
                    {value.credibilityEvidence.length > 0 ? (
                      <ListItemSecondaryAction>
                        <SourceCredibilityDBKFDialog
                          evidence={value.credibilityEvidence}
                          source={value.credibilitySource}
                          color={iconColor}
                          sourceType={sourceType}
                        />
                      </ListItemSecondaryAction>
                    ) : null}
                  </Typography>
                }
              />
            </ListItem>
          ))
        : null}
    </List>
  );
};
export default SourceCredibilityResult;
