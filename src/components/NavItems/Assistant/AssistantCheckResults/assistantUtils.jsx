import React, { useState } from "react";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";

import {
  TransHtmlDoubleLineBreak,
  TransSourceCredibilityTooltip,
  TransUrlDomainAnalysisLink,
} from "../TransComponents";

// functions for AssistantUrlDomainAnalysis and ExtractedUrlDomainAnalysis

export const renderSourceTypeChip = (
  keyword,
  trafficLightColor,
  sourceType,
) => {
  return (
    <Chip label={keyword(sourceType)} color={trafficLightColor} size="small" />
  );
};

// functions for ExtractedUrlDomainAnalysis

export function prependHttps(url) {
  return url ? (url.startsWith("http://") ? url : "https://" + url) : null;
}

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getUrlTypeFromCredScope = (string) => {
  let urlType = string.split("/")[0].replace(".com", "");
  if (urlType === "t.me") {
    urlType = "telegram";
  }
  return capitaliseFirstLetter(urlType);
};

export const renderThisDomainOrAccount = (
  keyword,
  credibilityScope,
  source,
) => {
  return (
    <>
      {credibilityScope.includes("/") ? (
        <Typography>
          {` ${keyword("this")} `}
          {getUrlTypeFromCredScope(credibilityScope)}
          {` ${keyword("source_credibility_warning_account")} ${source}`}
        </Typography>
      ) : (
        <Typography>
          {` ${keyword("source_credibility_warning_domain")} ${source}`}
        </Typography>
      )}
    </>
  );
};

export const renderScope = (keyword, credibilityScope) => {
  return (
    <>
      {credibilityScope?.includes("/") ? (
        <Typography variant={"subtitle2"}>
          {` ${keyword("account_scope")} ${credibilityScope}`}
        </Typography>
      ) : credibilityScope ? (
        <Typography variant={"subtitle2"}>
          {` ${keyword("domain_scope")} ${credibilityScope}`}
        </Typography>
      ) : null}
    </>
  );
};

export const renderLabels = (keyword, labels) => {
  return (
    <>
      {labels ? (
        <Typography variant={"subtitle2"}>
          {` ${keyword("labelled_as")} ${labels} `}
        </Typography>
      ) : null}
    </>
  );
};

export const renderDescription = (keyword, description) => {
  return (
    <>
      {description ? (
        <Typography variant={"subtitle2"}>
          {` ${keyword("commented_as")} ${description} `}
        </Typography>
      ) : null}
    </>
  );
};

export const renderEvidence = (
  keyword,
  labels,
  evidence,
  source,
  credibilityScope,
) => {
  return (
    <List>
      <ListItem>
        <Typography variant={"subtitle2"}>
          {credibilityScope?.includes("/")
            ? keyword("source_cred_popup_header_account")
            : keyword("source_cred_popup_header_domain")}{" "}
          {source}
        </Typography>
      </ListItem>
      <ListItem>
        <List sx={{ listStyle: "decimal", ml: 4 }}>
          {evidence?.map((result, index) => (
            <ListItem key={index} sx={{ display: "list-item" }}>
              <Typography variant="subtitle2">
                <Link
                  style={{ cursor: "pointer" }}
                  target="_blank"
                  href={result}
                  color="inherit"
                >
                  {result}
                </Link>
              </Typography>
            </ListItem>
          ))}
        </List>
      </ListItem>
      <ListItem>
        {labels === "present in GDI reports" && (
          <Typography variant={"subtitle2"} sx={{ align: "start" }}>
            <Box sx={{ fontStyle: "italic", m: 1 }}>
              {keyword("gdi_reports_warning")}
            </Box>
          </Typography>
        )}
      </ListItem>
    </List>
  );
};

export const renderDomainTitle = (
  keyword,
  classes,
  credibilityScope,
  urlColor,
  handleClose,
) => {
  return (
    <Grid container>
      {/* domain or account */}
      <Grid size={handleClose != null ? { xs: 11 } : { xs: 12 }}>
        <Typography sx={{ wordWrap: "break-word", align: "start" }}>
          {credibilityScope.includes("/")
            ? keyword("account_scope")
            : keyword("domain_scope")}{" "}
          <Tooltip title={prependHttps(credibilityScope)}>
            <Link
              style={{ cursor: "pointer" }}
              target="_blank"
              href={prependHttps(credibilityScope)}
              color={urlColor}
            >
              {credibilityScope}
            </Link>
          </Tooltip>
        </Typography>
      </Grid>

      {handleClose != null ? (
        <Grid size={{ xs: 1 }} display="flex" justifyContent="flex-end">
          {/* tooltip help */}
          <Box
            sx={{
              pt: 0.75,
            }}
          >
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
          </Box>

          {/* close button */}
          <Box
            sx={{
              pr: 1,
            }}
          >
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Grid>
      ) : null}
    </Grid>
  );
};

// functions for AssistantUrlDomainAnalysis

export const renderDomainAnalysisResults = (
  keyword,
  sourceCredibiltyResults,
  trafficLightColor,
  sourceType,
) => {
  return (
    <List disablePadding={true}>
      {sourceCredibiltyResults?.map((value, key) => (
        <ListItem key={key}>
          <ListItemText
            primary={
              <Box>
                <Typography
                  variant={"body1"}
                  component={"div"}
                  color={"textPrimary"}
                >
                  {renderThisDomainOrAccount(
                    keyword,
                    value.credibilityScope,
                    value.source,
                  )}
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
                {renderScope(keyword, value.credibilityScope)}
                {renderLabels(keyword, value.labels)}
                {renderDescription(keyword, value.description)}
                {value.evidence
                  ? renderDialog(keyword, value, trafficLightColor, sourceType)
                  : null}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

const renderDialog = (keyword, value, trafficLightColor, sourceType) => {
  const classes = useMyStyles();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ListItemSecondaryAction>
      {/* Tooltip with more details icon */}
      <Tooltip title="Details">
        <ListAltOutlinedIcon
          style={{ cursor: "pointer" }}
          onClick={handleClickOpen}
        />
      </Tooltip>

      {/* dialog box which appears when clicking tooltip icon above */}
      <Dialog onClose={handleClose} maxWidth={"lg"} open={open}>
        <DialogTitle>
          <Grid container>
            <Grid size={{ xs: 11 }}>
              <Typography variant="body1" component="div">
                <Chip
                  label={keyword(sourceType)}
                  color={trafficLightColor}
                  size="small"
                />{" "}
                {keyword("source_cred_popup_header_domain")} {value.source}
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 1 }}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {/* tooltip help */}
              <Box
                sx={{
                  pt: 0.75,
                }}
              >
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
              </Box>

              {/* close button */}
              <Box
                sx={{
                  pr: 1,
                }}
              >
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>

        <DialogContent dividers>
          <List sx={{ listStyle: "decimal", ml: 4 }}>
            {value.evidence.map((result, index) => (
              <ListItem key={index} sx={{ display: "list-item" }}>
                <Typography>
                  <Link target="_blank" href={result} color="inherit">
                    {result}
                  </Link>
                </Typography>
              </ListItem>
            ))}
          </List>
          {value.labels === "present in GDI reports" && (
            <Typography variant={"subtitle2"} sx={{ align: "start" }}>
              <Box sx={{ fontStyle: "italic", m: 1 }}>
                {keyword("gdi_reports_warning")}
              </Box>
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </ListItemSecondaryAction>
  );
};
