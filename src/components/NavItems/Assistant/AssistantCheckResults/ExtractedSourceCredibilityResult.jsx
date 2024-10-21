import React from "react";
import { useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ExtractedSourceCredibilityDBKFDialog from "./ExtractedSourceCredibilityDBKFDialog";
import Typography from "@mui/material/Typography";

const ExtractedSourceCredibilityResult = ({
  extractedSourceCredibilityResults,
  sourceType,
  url,
  urlColor,
  urlIcon,
}) => {
  const trafficLightColors = useSelector(
    (state) => state.assistant.trafficLightColors,
  );

  // passing through correct colours for details here
  const sourceCredibilityResults = [
    [
      extractedSourceCredibilityResults.caution,
      trafficLightColors.caution,
      "warning",
    ],
    [
      extractedSourceCredibilityResults.mixed,
      trafficLightColors.mixed,
      "mentions",
    ],
    [
      extractedSourceCredibilityResults.positive,
      trafficLightColors.positive,
      "fact_checker",
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
                    sourceType={sourceType}
                    url={url}
                    urlColor={urlColor}
                    urlIcon={urlIcon}
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
