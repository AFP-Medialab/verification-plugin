import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";

import {
  renderDescription,
  renderEvidence,
  renderLabels,
  renderScope,
  renderSourceTypeChip,
  renderThisDomainOrAccount,
  renderUrlTitle,
} from "./assistantUtils";

const ExtractedUrlDomainAnalysisResults = ({
  extractedSourceCredibilityResults,
  url,
  urlColor,
  sourceTypes,
  trafficLightColors,
}) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // passing through correct colours for details here
  const sourceCredibility = [
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
      {sourceCredibility ? (
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
                  <Tooltip title="Details">
                    <ListAltOutlinedIcon
                      style={{ cursor: "pointer" }}
                      onClick={handleClickOpen}
                    />
                  </Tooltip>

                  <Dialog
                    onClose={handleClose}
                    maxWidth={"lg"}
                    open={open}
                    scroll={"paper"}
                  >
                    <DialogTitle>
                      {/* display the url */}
                      {sourceCredibility
                        ? renderUrlTitle(
                            keyword,
                            classes,
                            url,
                            urlColor,
                            handleClose,
                          )
                        : null}
                    </DialogTitle>

                    <DialogContent dividers>
                      {/* display the URL Domain Analysis results in an accordion*/}
                      {sourceCredibility?.map(
                        (
                          [
                            sourceCredibilityResults,
                            trafficLightColor,
                            sourceType,
                          ],
                          index,
                        ) => (
                          <Box key={index} mt={3} ml={2}>
                            {sourceCredibilityResults?.map((value, key) => (
                              <Accordion
                                key={key}
                                style={{ overflow: "hidden" }}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                >
                                  {value.credibilityScope ? (
                                    <Stack direction="row">
                                      {renderSourceTypeChip(
                                        keyword,
                                        trafficLightColor,
                                        sourceType,
                                      )}
                                      {renderThisDomainOrAccount(
                                        keyword,
                                        value.credibilityScope,
                                        value.credibilitySource,
                                      )}
                                    </Stack>
                                  ) : null}
                                </AccordionSummary>

                                <AccordionDetails
                                  sx={
                                    scroll == true
                                      ? {
                                          display: "flex",
                                          maxHeight: "300px",
                                          overflowY: "scroll",
                                        }
                                      : null
                                  }
                                >
                                  <List key={key}>
                                    <ListItem>
                                      {renderScope(
                                        keyword,
                                        value.credibilityScope,
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      {renderLabels(
                                        keyword,
                                        value.credibilityLabels,
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      {renderDescription(
                                        keyword,
                                        value.credibilityDescription,
                                      )}
                                    </ListItem>
                                  </List>
                                  {value.credibilityEvidence.length > 0
                                    ? renderEvidence(
                                        keyword,
                                        value.credibilityLabels,
                                        value.credibilityEvidence,
                                        value.credibilitySource,
                                        value.credibilityScope,
                                      )
                                    : null}
                                </AccordionDetails>
                              </Accordion>
                            ))}
                          </Box>
                        ),
                      )}
                    </DialogContent>
                  </Dialog>
                </ListItemSecondaryAction>
              </Typography>
            }
          />
        </ListItem>
      ) : null}
    </List>
  );
};
export default ExtractedUrlDomainAnalysisResults;
