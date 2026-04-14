import React from "react";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import {
  DomainDialog,
  TransHtmlDoubleLineBreak,
  TransUrlDomainAnalysisLink,
  TransUrlDomainAnalysisTooltip,
  TransUsfdAuthor,
} from "../components";

export const renderSourceTypeChip = (
  keyword,
  trafficLightColor,
  sourceType,
) => {
  return (
    <Chip label={keyword(sourceType)} color={trafficLightColor} size="small" />
  );
};

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
          <Box sx={{ pt: 0.75 }}>
            <Tooltip
              interactive={"true"}
              leaveDelay={50}
              style={{ display: "flex", marginLeft: "auto" }}
              title={
                <>
                  <TransUrlDomainAnalysisTooltip keyword={keyword} />
                  <TransHtmlDoubleLineBreak keyword={keyword} />
                  <TransUsfdAuthor keyword={keyword} />
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
          <Box sx={{ pr: 1 }}>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Grid>
      ) : null}
    </Grid>
  );
};

export const renderDomainAnalysisResults = (
  keyword,
  urlDomainAnalysisResults,
  trafficLightColor,
  sourceType,
) => {
  return (
    <List disablePadding={true}>
      {urlDomainAnalysisResults?.map((value, key) => (
        <ListItem
          key={key}
          secondaryAction={
            value.evidence ? (
              <DomainDialog
                keyword={keyword}
                value={value}
                trafficLightColor={trafficLightColor}
                sourceType={sourceType}
              />
            ) : null
          }
        >
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
                <Box sx={{ mb: 0.5 }} />
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
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};
