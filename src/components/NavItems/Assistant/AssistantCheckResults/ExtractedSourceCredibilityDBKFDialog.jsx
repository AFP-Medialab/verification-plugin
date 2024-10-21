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
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
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
import { getUrlTypeFromCredScope } from "./assistantUtils";
import { Chip, Stack } from "@mui/material";

const renderScope = (keyword, scope) => {
  return (
    <ListItem>
      {scope && scope.includes("/") ? (
        <Typography variant={"subtitle2"}>
          {` ${keyword("account_scope")} ${scope} `}
        </Typography>
      ) : scope ? (
        <Typography variant={"subtitle2"}>
          {` ${keyword("domain_scope")} ${scope} `}
        </Typography>
      ) : null}
    </ListItem>
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
      <List sx={{ listStyle: "decimal", ml: 4 }}>
        {evidence
          ? evidence.map((result, index) => (
              <ListItem key={index} sx={{ display: "list-item" }}>
                {/* <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon> */}
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
  //sourceType,
  url,
  urlColor,
  urlIcon,
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
          <Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            {"URL: "}
            <Link color={urlColor} href={url}>
              {url}
            </Link>
          </Typography>
          {/* <Typography>
            {console.log(sourceCredibility)}
            {sourceCredibility[0][0][0] ? sourceCredibility[0][0][0] ? sourceCredibility[0][0][0].credibilityScope ? (
              <>
            {"Domain/Account: "}
            <Link color={urlColor} href={sourceCredibility[0][0][0].credibilityScope}>
              {url}
            </Link>
            </>
            ) : null : null : null}
          </Typography> */}
        </DialogTitle>

        <DialogContent dividers>
          {sourceCredibility
            ? sourceCredibility.map(
                (
                  [
                    sourceCredibilityResults,
                    trafficLightColor,
                    sourceTypeLabel,
                  ],
                  index,
                ) => (
                  <div key={index}>
                    {sourceCredibilityResults
                      ? sourceCredibilityResults.map((value, key) => (
                          <Accordion key={key}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              {value.credibilityScope &&
                              value.credibilityScope.includes("/") ? (
                                <Stack direction="row">
                                  {/* {console.log(sourceType, trafficLightColor)} */}
                                  <Chip
                                    label={keyword(sourceTypeLabel)}
                                    color={trafficLightColor}
                                    size="small"
                                  />
                                  {/* <urlIcon color={urlColor} /> */}
                                  <Typography
                                    sx={{ ml: 1 }}
                                    color={trafficLightColor}
                                  >
                                    {` ${keyword("this")}`}
                                    {getUrlTypeFromCredScope(
                                      value.credibilityScope,
                                    )}
                                    {` ${keyword(
                                      "source_credibility_warning_account",
                                    )} ${" "}${value.credibilitySource}`}
                                  </Typography>
                                </Stack>
                              ) : value.credibilityScope ? (
                                <Stack direction="row">
                                  {/* {console.log(sourceType, trafficLightColor)} */}
                                  <Chip
                                    label={keyword(sourceTypeLabel)}
                                    color={trafficLightColor}
                                    size="small"
                                  />
                                  {/* <urlIcon color={urlColor} /> */}
                                  <Typography
                                    sx={{ ml: 1 }}
                                    color={trafficLightColor}
                                  >
                                    {` ${keyword(
                                      "source_credibility_warning_domain",
                                    )} ${value.credibilitySource} `}
                                  </Typography>
                                </Stack>
                              ) : null}
                            </AccordionSummary>

                            <AccordionDetails>
                              <List key={key}>
                                {renderScope(
                                  keyword,
                                  sourceCredibilityResults[key]
                                    .credibilityScope,
                                )}

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
