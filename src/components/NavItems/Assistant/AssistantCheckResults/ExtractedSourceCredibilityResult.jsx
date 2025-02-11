import React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ExtractedSourceCredibilityDBKFDialog from "./ExtractedSourceCredibilityDBKFDialog";

const ExtractedSourceCredibilityResult = ({
  extractedSourceCredibilityResults,
  url,
  domainOrAccount,
  urlColor,
  sourceTypes,
}) => {
  const trafficLightColors = useSelector(
    (state) => state.assistant.trafficLightColors,
  );

  // passing through correct colours for details here
  const sourceCredibilityResults = [
    [
      extractedSourceCredibilityResults.caution,
      trafficLightColors.caution,
      sourceTypes.caution,
    ],
    [
      extractedSourceCredibilityResults.mixed,
      trafficLightColors.mixed,
      sourceTypes.mixed,
    ],
    [
      extractedSourceCredibilityResults.positive,
      trafficLightColors.positive,
      sourceTypes.positive,
    ],
  ];

  return (
    <List component={Stack} direction="row" disablePadding={true}>
      {sourceCredibilityResults ? (
        <ListItem>
          <ListItemText
            primary={
              <div>
                <Typography
                  variant={"body1"}
                  component={"div"}
                  align={"left"}
                  color={"textPrimary"}
                ></Typography>
                <Box mb={0.5} />
              </div>
            }
            secondary={
              <Typography
                variant={"caption"}
                component={"div"}
                color={"textSecondary"}
              >
                <ListItemSecondaryAction>
                  <ExtractedSourceCredibilityDBKFDialog
                    sourceCredibility={sourceCredibilityResults}
                    url={url}
                    domainOrAccount={domainOrAccount}
                    urlColor={urlColor}
                  />
                </ListItemSecondaryAction>
              </Typography>
            }
          />
        </ListItem>
      ) : null}
    </List>
  );
};
export default ExtractedSourceCredibilityResult;
