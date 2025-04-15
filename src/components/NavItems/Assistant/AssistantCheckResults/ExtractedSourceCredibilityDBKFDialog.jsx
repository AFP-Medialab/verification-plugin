import React, { useState } from "react";

import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import {
  TransHtmlDoubleLineBreak,
  TransSourceCredibilityTooltip,
  TransUrlDomainAnalysisLink,
} from "../TransComponents";
import { getUrlTypeFromCredScope } from "./assistantUtils";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const renderScope = (keyword, scope) => {
  return (
    <ListItem>
      {scope && scope.includes("/") ? (
        <Typography
          variant={"subtitle2"}
        >{` ${keyword("account_scope")} ${scope} `}</Typography>
      ) : scope ? (
        <Typography
          variant={"subtitle2"}
        >{` ${keyword("domain_scope")} ${scope} `}</Typography>
      ) : null}
    </ListItem>
  );
};

const renderLabels = (keyword, labels) => {
  return (
    <ListItem>
      {labels ? (
        <Typography
          variant={"subtitle2"}
        >{` ${keyword("labelled_as")} ${labels} `}</Typography>
      ) : null}
    </ListItem>
  );
};

const renderDescription = (keyword, description) => {
  return (
    <ListItem>
      {description ? (
        <Typography
          variant={"subtitle2"}
        >{` ${keyword("commented_as")} ${description} `}</Typography>
      ) : null}
    </ListItem>
  );
};

const renderEvidence = (keyword, evidence, source, scope) => {
  return (
    <>
      <ListItem>
        <Typography variant={"subtitle2"}>
          {scope && scope.includes("/")
            ? keyword("source_cred_popup_header_account")
            : keyword("source_cred_popup_header_domain")}{" "}
          {source}
        </Typography>
      </ListItem>
      <ListItem>
        <List sx={{ listStyle: "decimal", ml: 4 }}>
          {evidence
            ? evidence.map((result, index) => (
                <ListItem key={index} sx={{ display: "list-item" }}>
                  <Typography>
                    <Link target="_blank" href={result} color="inherit">
                      {result}
                    </Link>
                  </Typography>
                </ListItem>
              ))
            : null}
        </List>
      </ListItem>
    </>
  );
};

const ExtractedSourceCredibilityDBKFDialog = ({
  sourceCredibility,
  url,
  domainOrAccount,
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
          <Grid container>
            {/* url */}
            <Grid size={{ xs: 11 }}>
              <Typography sx={{ wordWrap: "break-word" }}>
                {keyword("assistant_urlbox")}
                {": "}
                <Link color={urlColor} href={url}>
                  {url}
                </Link>
              </Typography>
            </Grid>

            <Grid size={{ xs: 1 }} display="flex" justifyContent="flex-end">
              {/* tooltip help */}
              <Tooltip
                interactive={"true"}
                leaveDelay={50}
                style={{ display: "flex", marginLeft: "auto" }}
                title={
                  <>
                    <TransSourceCredibilityTooltip keyword={keyword} />
                    <TransHtmlDoubleLineBreak keyword={keyword} />
                    <TransUrlDomainAnalysisLink keyword={keyword} />
                  </>
                }
                classes={{ tooltip: classes.assistantTooltip }}
              >
                <HelpOutlineOutlinedIcon color={"action"} />
              </Tooltip>

              {/* close button */}
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>

        <DialogContent dividers>
          {sourceCredibility
            ? sourceCredibility.map(
                (
                  [sourceCredibilityResults, trafficLightColor, sourceType],
                  index,
                ) => (
                  <div key={index}>
                    {sourceCredibilityResults
                      ? sourceCredibilityResults.map((value, key) => (
                          <Accordion key={key}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Stack direction="row">
                                <Chip
                                  label={keyword(sourceType)}
                                  color={trafficLightColor}
                                  size="small"
                                />
                                <Typography sx={{ ml: 1 }}>
                                  {value.credibilityScope &&
                                  value.credibilityScope.includes("/")
                                    ? ` ${keyword("this")} ${getUrlTypeFromCredScope(value.credibilityScope)} ${keyword("source_credibility_warning_account")} ${" "}${value.credibilitySource}`
                                    : ` ${keyword("source_credibility_warning_domain")} ${value.credibilitySource} `}
                                </Typography>
                              </Stack>
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
                                {sourceCredibilityResults[key]
                                  .credibilityEvidence.length > 0
                                  ? renderEvidence(
                                      keyword,
                                      sourceCredibilityResults[key]
                                        .credibilityEvidence,
                                      value.credibilitySource,
                                      value.credibilityScope,
                                    )
                                  : null}
                              </List>
                            </AccordionDetails>
                          </Accordion>
                        ))
                      : null}
                  </div>
                ),
              )
            : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ExtractedSourceCredibilityDBKFDialog;
