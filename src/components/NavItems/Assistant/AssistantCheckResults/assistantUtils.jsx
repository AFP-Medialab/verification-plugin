import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Grid2,
  IconButton,
  Link,
  List,
  ListItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// URL Domain Analysis and Extacted URLs shared code
// AssistantSCResuts.jsx
// AssistantLinkResult.jsx
// ExtractedUrlDomainAnalysisResults.jsx

export const getUrlTypeFromCredScope = (string) => {
  let urlType = string.split("/")[0].replace(".com", "");
  if (urlType === "t.me") {
    urlType = "telegram";
  }
  return capitaliseFirstLetter(urlType);
};

const renderSourceTypeChip = (keyword, sourceType, trafficLightColor) => {
  return (
    <Chip label={keyword(sourceType)} color={trafficLightColor} size="small" />
  );
};

const renderThisDomainOrAccount = (keyword, scope, source) => {
  return (
    <>
      {scope.includes("/") ? (
        <Typography
          sx={{ ml: 1 }}
          //color={trafficLightColor}
        >
          {` ${keyword("this")}`}
          {getUrlTypeFromCredScope(scope)}
          {` ${keyword("source_credibility_warning_account")} ${" "}${source}`}
        </Typography>
      ) : (
        <Typography
          sx={{ ml: 1 }}
          //color={trafficLightColor}
        >
          {` ${keyword("source_credibility_warning_domain")} ${source} `}
        </Typography>
      )}
    </>
  );
};

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
                  <Typography variant="subtitle2">
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

export const renderUrlTitle = (
  keyword,
  classes,
  url,
  urlColor,
  handleClose,
) => {
  return (
    <Grid2 container>
      {/* url */}
      <Grid2 size={handleClose != null ? { xs: 11 } : { xs: 12 }}>
        <Typography sx={{ wordWrap: "break-word", align: "start" }}>
          {keyword("assistant_urlbox")}
          {": "}
          <Link color={urlColor} href={url}>
            {url}
          </Link>
        </Typography>
      </Grid2>

      {handleClose != null ? (
        <Grid2 size={{ xs: 1 }} display="flex" justifyContent="flex-end">
          {/* tooltip help */}
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

          {/* close button */}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid2>
      ) : null}
    </Grid2>
  );
};

export const renderAccordion = (
  keyword,
  sourceCredibility,
  scroll = false, // for long list of evidence links in URL Domain Analysis
) => {
  return (
    <>
      {sourceCredibility
        ? sourceCredibility.map(
            (
              [sourceCredibilityResults, trafficLightColor, sourceType],
              index,
            ) => (
              <div key={index}>
                {sourceCredibilityResults
                  ? sourceCredibilityResults.map((value, key) => (
                      <Accordion key={key} style={{ overflow: "hidden" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          {value.credibilityScope ? (
                            <Stack direction="row">
                              {renderSourceTypeChip(
                                keyword,
                                sourceType,
                                trafficLightColor,
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
                            {renderScope(keyword, value.credibilityScope)}
                            {renderLabels(keyword, value.credibilityLabels)}
                            {renderDescription(
                              keyword,
                              value.credibilityDescription,
                            )}
                            {value.credibilityEvidence.length > 0
                              ? renderEvidence(
                                  keyword,
                                  value.credibilityEvidence,
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
    </>
  );
};
