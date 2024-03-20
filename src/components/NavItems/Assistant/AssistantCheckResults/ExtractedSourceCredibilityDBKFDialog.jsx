import React, { useState } from "react";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Link from "@mui/material/Link";
import LaunchIcon from "@mui/icons-material/Launch";
import Typography from "@mui/material/Typography";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

const renderSource = (keyword, trafficLightColor, source) => {
  return (
    <Typography color={trafficLightColor}>
      {keyword("source_cred_popup_header")} {source}
    </Typography>
  );
};

const renderLabels = (keyword, labels) => {
  return (
    <ListItem>
      {labels ? (
        <Typography variant={"subtitle2"}>
          {` ${keyword("labelled_as")} ${labels} `}
        </Typography>
      ) : null}
    </ListItem>
  );
};

const renderDescription = (keyword, description) => {
  return (
    <ListItem>
      {description ? (
        <Typography variant={"subtitle2"}>
          {` ${keyword("commented_as")} ${description} `}
        </Typography>
      ) : null}
    </ListItem>
  );
};

const renderEvidence = (evidence) => {
  return (
    <ListItem>
      <List>
        {evidence
          ? evidence.map((result, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <Typography>
                  <Link target="_blank" href={result}>
                    {result}
                  </Link>
                </Typography>
              </ListItem>
            ))
          : null}
      </List>
    </ListItem>
  );
};

const ExtractedSourceCredibilityDBKFDialog = ({
  sourceCredibility,
  sourceType,
  url,
  urlColor,
}) => {
  //central
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const [open, setOpen] = useState(false);
  const classes = useMyStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <LaunchIcon style={{ cursor: "pointer" }} onClick={handleClickOpen} />
      <Dialog
        onClose={handleClose}
        maxWidth={"lg"}
        open={open}
        scroll={"paper"}
      >
        <DialogTitle>
          <Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            {sourceType}
            {": "}
            <Link color={urlColor} href={url}>
              {url}
            </Link>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          {sourceCredibility
            ? sourceCredibility.map(
                ([sourceCredibilityResults, trafficLightColor], index) => (
                  <div key={index}>
                    {sourceCredibilityResults
                      ? sourceCredibilityResults.map((value, key) => (
                          <Accordion key={key}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              {renderSource(
                                keyword,
                                trafficLightColor,
                                sourceCredibilityResults[key].credibilitySource,
                              )}
                            </AccordionSummary>

                            <AccordionDetails>
                              <List key={key}>
                                {renderLabels(
                                  keyword,
                                  sourceCredibilityResults[key]
                                    .credibilityLabels,
                                )}

                                {renderDescription(
                                  keyword,
                                  sourceCredibilityResults[key]
                                    .credibilityDescription,
                                )}

                                {renderEvidence(
                                  sourceCredibilityResults[key]
                                    .credibilityEvidence,
                                )}
                              </List>
                            </AccordionDetails>
                          </Accordion>
                        ))
                      : null}
                  </div>
                ),
              )
            : null}

          <Box mr={2} mb={1}>
            <Tooltip
              interactive={"true"}
              leaveDelay={50}
              style={{ display: "flex", marginLeft: "auto" }}
              title={
                <div
                  className={"content"}
                  dangerouslySetInnerHTML={{
                    __html: keyword("sc_tooltip"),
                  }}
                />
              }
              classes={{ tooltip: classes.assistantTooltip }}
            >
              <HelpOutlineOutlinedIcon color={"action"} />
            </Tooltip>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ExtractedSourceCredibilityDBKFDialog;
