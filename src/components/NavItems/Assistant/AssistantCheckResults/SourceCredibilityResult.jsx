import React from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import SourceCredibilityDBKFDialog from "./SourceCredibilityDBKFDialog";
import Typography from "@mui/material/Typography";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { getUrlTypeFromCredScope } from "./assistantUtils";
import { Chip, Grid2 } from "@mui/material";

const SourceCredibilityResult = (props) => {
  // central
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // props
  const sourceCredibilityResults = props.scResultFiltered;
  const Icon = props.icon;
  const iconColor = props.iconColor;
  const sourceType = props.sourceType;

  return (
    <List disablePadding={true}>
      {sourceCredibilityResults
        ? sourceCredibilityResults.map((value, key) => (
            <ListItem key={key}>
              {/* <Grid2 container> */}

              {/* source type */}
              {/* <Grid2 size={ 2 }> */}
              {/* <ListItemAvatar>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Chip label={keyword(props.sourceType)} color={iconColor} size="small" />
                    </Box>
                  </ListItemAvatar> */}
              {/* </Grid2> */}

              {/* details from url domain analysis with details icon */}
              {/* <Grid2 size={  9 }> */}
              <ListItemText
                primary={
                  <div sx={{ ml: 2 }}>
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
                          {` ${keyword(
                            "source_credibility_warning_account",
                          )} ${" "}${value.credibilitySource}`}
                        </Typography>
                      ) : value.credibilityScope ? (
                        <Typography>
                          {` ${keyword(
                            "source_credibility_warning_domain",
                          )} ${" "}${value.credibilitySource}`}
                        </Typography>
                      ) : null}
                    </Typography>
                    <Box mb={0.5} />
                  </div>
                }
                secondary={
                  <Typography
                    variant={"caption"}
                    component={"div"}
                    color={"textSecondary"}
                  >
                    {value.credibilityScope.includes("/") ? (
                      <Typography variant={"subtitle2"}>
                        {` ${" "} ${keyword("account_scope")} ${
                          value.credibilityScope
                        } `}
                      </Typography>
                    ) : value.credibilityScope ? (
                      <Typography variant={"subtitle2"}>
                        {` ${keyword("domain_scope")} ${
                          value.credibilityScope
                        } `}
                      </Typography>
                    ) : null}
                    {value.credibilityLabels ? (
                      <Typography variant={"subtitle2"}>
                        {` ${keyword("labelled_as")} ${
                          value.credibilityLabels
                        } `}
                      </Typography>
                    ) : null}
                    {value.credibilityDescription ? (
                      <Typography variant={"subtitle2"}>
                        {` ${keyword("commented_as")} ${
                          value.credibilityDescription
                        } `}
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
                  // </Grid2>
                }
              />
              {/* //   </Grid2> */}
              {/* // </Grid2> */}
            </ListItem>
          ))
        : null}
    </List>
  );
};
export default SourceCredibilityResult;
