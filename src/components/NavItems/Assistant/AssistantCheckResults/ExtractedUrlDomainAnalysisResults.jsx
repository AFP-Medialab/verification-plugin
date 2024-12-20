import React, { useState } from "react";
import { useSelector } from "react-redux";

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import { renderAccordion, renderUrlTitle } from "./assistantUtils";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "components/Shared/MaterialUiStyles/useMyStyles";

const UrlDomainAnalysisResults = ({
  extractedSourceCredibilityResults,
  url,
  urlColor,
  sourceTypes,
  trafficLightColors,
  domainOrAccount, // check what does this do here?
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
                      {/* display the URL Domain Analysis */}
                      {renderAccordion(keyword, sourceCredibility)}
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
export default UrlDomainAnalysisResults;
