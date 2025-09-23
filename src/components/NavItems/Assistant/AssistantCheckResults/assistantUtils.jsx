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
} from "..//TransComponents";

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

export const renderSourceTypeChip = (
  keyword,
  trafficLightColor,
  sourceType,
) => {
  return (
    <Chip label={keyword(sourceType)} color={trafficLightColor} size="small" />
  );
};

export const renderThisDomainOrAccount = (keyword, scope, source) => {
  return (
    <>
      {scope.includes("/") ? (
        <Typography>
          {` ${keyword("this")}`}
          {getUrlTypeFromCredScope(scope)}
          {` ${keyword("source_credibility_warning_account")} ${" "}${source}`}
        </Typography>
      ) : (
        <Typography>
          {` ${keyword("source_credibility_warning_domain")} ${source} `}
        </Typography>
      )}
    </>
  );
};

export const renderScope = (keyword, scope) => {
  return (
    <>
      {scope?.includes("/") ? (
        <Typography variant={"subtitle2"}>
          {` ${keyword("account_scope")} ${scope} `}
        </Typography>
      ) : scope ? (
        <Typography variant={"subtitle2"}>
          {` ${keyword("domain_scope")} ${scope} `}
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

export const renderEvidence = (keyword, labels, evidence, source, scope) => {
  return (
    <List>
      <ListItem>
        <Typography variant={"subtitle2"}>
          {scope?.includes("/")
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
                <Link target="_blank" href={result} color="inherit">
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

export const renderUrlTitle = (
  keyword,
  classes,
  url,
  urlColor,
  handleClose,
) => {
  return (
    <Grid container>
      {/* url */}
      <Grid size={handleClose != null ? { xs: 11 } : { xs: 12 }}>
        <Typography sx={{ wordWrap: "break-word", align: "start" }}>
          {keyword("assistant_urlbox")}
          {": "}
          <Link color={urlColor} href={url}>
            {url}
          </Link>
        </Typography>
      </Grid>

      {handleClose != null ? (
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
      ) : null}
    </Grid>
  );
};

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
                    value.credibilitySource,
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
                {renderLabels(keyword, value.credibilityLabels)}
                {renderDescription(keyword, value.credibilityDescription)}
                {value.credibilityEvidence.length > 0
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
                {keyword("source_cred_popup_header_domain")}{" "}
                {value.credibilitySource}
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
            {value.credibilityEvidence.map((result, index) => (
              <ListItem key={index} sx={{ display: "list-item" }}>
                <Typography>
                  <Link target="_blank" href={result} color="inherit">
                    {result}
                  </Link>
                </Typography>
              </ListItem>
            ))}
          </List>
          {value.credibilityLabels === "present in GDI reports" && (
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
