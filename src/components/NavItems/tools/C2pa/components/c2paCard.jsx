import React, { useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useSelector } from "react-redux";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import {
  ExpandMore,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
} from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpIcon from "@mui/icons-material/Help";
import MapIcon from "@mui/icons-material/Map";

import { ROLES } from "@/constants/roles";
import { JsonBlock } from "@Shared/JsonBlock";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { Icon as GeoIcon } from "leaflet";
import moment from "moment";

/**
 * @param {Object} result - full C2PA result object
 * @param {string} currentImageId - controlled current image id
 * @param {string} mainImageId - controlled main image id
 * @param {function} onNavigate - (id) => void, called when user navigates to an ingredient or parent
 * @param {Object} validationIssues - optional validation issues
 * @param {boolean} hasSimilarAfpResult - optional flag for AFP reverse search result
 * @param {boolean} isImage - whether the current asset is an image (vs video)
 */
const C2PaCard = ({
  result,
  currentImageId,
  mainImageId,
  onNavigate,
  validationIssues,
  hasSimilarAfpResult,
  isImage,
}) => {
  const role = useSelector((state) => state.userSession.user.roles);
  const parentId = result[currentImageId].parent;
  const manifestData = result[currentImageId].manifestData;
  const depthExceeded = result[currentImageId].depthExceeded;

  const latitude = manifestData?.captureInfo?.latitude ?? null;
  const longitude = manifestData?.captureInfo?.longitude ?? null;

  const keyword = i18nLoadNamespace("components/NavItems/tools/C2pa");

  const validationMessage = (issues) => {
    if (issues.trustedSourceIssue && issues.status.length <= 2) {
      return keyword("content_credentials_unknown_source");
    }
    return keyword("content_credentials_invalid");
  };
  const sectionTitle = (titleKey, infoKey, variant = "h6") => (
    <Grid container direction="row" sx={{ alignItems: "center" }}>
      <Grid>
        <Typography variant={variant}>{keyword(titleKey)}</Typography>
      </Grid>
      {infoKey && (
        <>
          <Grid sx={{ m: 2 }} />
          <Tooltip title={<h3>{keyword(infoKey)}</h3>}>
            <HelpIcon />
          </Tooltip>
        </>
      )}
    </Grid>
  );

  const mainSectionValidation = (titleKey, trustIssue) => (
    <Grid container direction="row" sx={{ alignItems: "center" }}>
      <Grid>
        <Typography variant="h5">{keyword(titleKey)}</Typography>
      </Grid>
      <Grid sx={{ m: 2 }} />
      {trustIssue === "Trusted" && (
        <CheckCircleIcon style={{ color: "green" }} />
      )}
    </Grid>
  );

  return (
    <Box>
      <Card p={1} variant="outlined">
        <CardContent>
          {!manifestData ? (
            <Box sx={{ m: 1 }}>
              {depthExceeded ? (
                <Alert>
                  {isImage
                    ? keyword("child_depth_exceeded_image")
                    : keyword("child_depth_exceeded_video")}
                </Alert>
              ) : (
                <Stack direction="column" spacing={2}>
                  <Alert severity="info" m={1}>
                    {isImage
                      ? keyword("no_c2pa_info_image")
                      : keyword("no_c2pa_info_video")}
                  </Alert>
                  {hasSimilarAfpResult && (
                    <Alert severity="success" m={1}>
                      {keyword("reverse_search_result_found_warning")}
                    </Alert>
                  )}
                </Stack>
              )}
              <Box sx={{ m: 1 }} />
            </Box>
          ) : (
            <>
              {validationIssues?.status && (
                <Box sx={{ m: 1 }}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Alert severity="error" m={1}>
                        {validationMessage(validationIssues)}
                      </Alert>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List
                        dense
                        disablePadding
                        sx={{ listStyleType: "disc", pl: 2 }}
                      >
                        {validationIssues.status?.map((status, key) => (
                          <ListItem
                            key={key}
                            sx={{ display: "list-item", p: 0 }}
                          >
                            <Typography>
                              {status.code + " " + status.explanation}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                  <Box sx={{ m: 2 }} />
                </Box>
              )}
              {mainSectionValidation(
                "c2pa_information",
                validationIssues?.state,
              )}
              <Box sx={{ m: 1 }} />
              <Stack>
                <Typography>{manifestData.title}</Typography>
                <Box sx={{ m: 1 }} />

                {/* Content credentials */}
                <Box sx={{ p: 1 }}>
                  <Stack>
                    {sectionTitle(
                      "content_credentials_title",
                      "content_credential_explanation",
                    )}
                    <Box sx={{ p: 1 }}>
                      <Typography>
                        {keyword("content_credentials_issuer") +
                        " " +
                        manifestData.signatureInfo.commonName
                          ? manifestData.signatureInfo.commonName
                          : manifestData.signatureInfo.issuer}
                      </Typography>
                      {manifestData.signatureInfo.time && (
                        <Typography>
                          {keyword("content_credentials_date_issued") +
                            " " +
                            moment(manifestData.signatureInfo.time).format(
                              "D.MM.yyyy",
                            )}
                        </Typography>
                      )}
                    </Box>
                    {(manifestData.claimGenerator ||
                      manifestData.softwareUsed) && (
                      <>
                        <Typography sx={{ fontSize: 18 }}>
                          {keyword("app_device_used")}
                        </Typography>
                        <Stack spacing={1} sx={{ p: 1 }}>
                          {manifestData.claimGenerator.name && (
                            <Typography>
                              {manifestData.claimGenerator.name}
                            </Typography>
                          )}
                          {manifestData.claimGenerator.info?.map(
                            (item, idx) => (
                              <Typography key={idx}>{item.name}</Typography>
                            ),
                          )}
                          {manifestData.softwareUsed?.map((item, idx) => (
                            <Typography key={idx}>
                              {item.softwareAgent}
                            </Typography>
                          ))}
                        </Stack>
                      </>
                    )}
                  </Stack>
                  <Box sx={{ m: 1 }} />

                  <Divider m={1} />
                </Box>

                {/* Producer / credit */}
                {manifestData.producer && (
                  <Box sx={{ p: 1 }}>
                    <Stack>
                      {sectionTitle("credit_title", "credit_explanation")}
                      <Box sx={{ p: 1 }}>
                        {manifestData.producer?.map((producer, key) => (
                          <Stack key={key}>
                            {producer.name && (
                              <Typography>
                                {keyword("credit_producer") +
                                  " " +
                                  producer.name}
                              </Typography>
                            )}
                            {producer.socials?.length > 0 && (
                              <>
                                <Typography>
                                  {keyword("credit_social")}
                                </Typography>
                                <Stack>
                                  {producer.socials.map((obj, i) => (
                                    <Typography key={i}>
                                      {obj["@id"]}
                                    </Typography>
                                  ))}
                                </Stack>
                              </>
                            )}
                          </Stack>
                        ))}
                      </Box>
                    </Stack>
                    <Box sx={{ m: 1 }} />
                    <Divider m={1} />
                  </Box>
                )}
                {/* Capture info */}
                {manifestData.captureInfo && (
                  <Box sx={{ p: 1 }}>
                    <Stack>
                      {sectionTitle(
                        "capture_info_title",
                        "capture_info_explanation",
                      )}
                      <Box sx={{ p: 1 }}>
                        {manifestData.captureInfo.make && (
                          <Typography>
                            {keyword("capture_info_make") +
                              " " +
                              manifestData.captureInfo.make}
                          </Typography>
                        )}
                        {manifestData.captureInfo.model && (
                          <Typography>
                            {keyword("capture_info_model") +
                              " " +
                              manifestData.captureInfo.model}
                          </Typography>
                        )}
                        {manifestData.captureInfo.dateTime && (
                          <Typography>
                            {keyword("capture_info_date") +
                              " " +
                              moment(manifestData.captureInfo.dateTime).format(
                                "D.MM.yyyy",
                              )}
                          </Typography>
                        )}
                        {manifestData.captureInfo.latitude && (
                          <Typography>
                            {keyword("capture_info_latitude") +
                              " " +
                              manifestData.captureInfo.latitude}
                          </Typography>
                        )}
                        {manifestData.captureInfo.longitude && (
                          <Typography>
                            {keyword("capture_info_longitude") +
                              " " +
                              manifestData.captureInfo.longitude}
                          </Typography>
                        )}
                        {longitude && latitude && (
                          <Box sx={{ p: 3 }}>
                            {!isNaN(longitude) && !isNaN(latitude) && (
                              <>
                                <MapContainer
                                  center={[latitude, longitude]}
                                  zoom={13}
                                  scrollWheelZoom={false}
                                  style={{ width: "100%", height: "200px" }}
                                >
                                  <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  />
                                  <Marker
                                    position={[latitude, longitude]}
                                    icon={
                                      new GeoIcon({
                                        iconUrl: "img/marker_location.svg",
                                        iconSize: [60, 60],
                                        iconAnchor: [30, 0],
                                      })
                                    }
                                  />
                                </MapContainer>
                                <Box sx={{ m: 1 }} />
                              </>
                            )}
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              onClick={() =>
                                window.open(
                                  `http://www.google.com/maps/place/${latitude},${longitude}`,
                                  "_blank",
                                )
                              }
                            >
                              <MapIcon />
                              {keyword("geo_maps")}
                            </Button>
                          </Box>
                        )}
                        {manifestData.captureInfo.allCaptureInfo && (
                          <Box sx={{ p: 1 }}>
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography>
                                  {keyword("capture_info_more_results")}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {manifestData.captureInfo.allCaptureInfo.map(
                                  (obj, key) => (
                                    <Stack key={key}>
                                      {Object.keys(obj.data).map(
                                        (objKey, index) =>
                                          typeof obj.data[objKey] ===
                                          "string" ? (
                                            <Typography key={index}>
                                              {objKey + ": " + obj.data[objKey]}
                                            </Typography>
                                          ) : null,
                                      )}
                                    </Stack>
                                  ),
                                )}
                              </AccordionDetails>
                            </Accordion>
                          </Box>
                        )}
                      </Box>
                    </Stack>
                    <Box sx={{ m: 1 }} />
                    <Divider />
                  </Box>
                )}

                {/* Process / edits / ingredients */}
                <Box sx={{ p: 1 }}>
                  {sectionTitle("process_title", "process_explanation")}
                  <Box sx={{ p: 1 }}>
                    {manifestData.children ? (
                      <Stack spacing={2}>
                        <>
                          <Stack spacing={1} sx={{ p: 1 }}>
                            {manifestData.children.map((obj, key) => (
                              <div key={key}>
                                <Typography sx={{ fontSize: 18 }}>
                                  {keyword("process_ingredients")}
                                </Typography>
                                <Box>
                                  {result[obj].url ? (
                                    <img
                                      src={result[obj].url}
                                      style={{
                                        maxWidth: "150px",
                                        maxHeight: "60vh",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => onNavigate(obj)}
                                    />
                                  ) : (
                                    <Button
                                      onClick={() => onNavigate(obj)}
                                      startIcon={<KeyboardArrowRight />}
                                      variant="contained"
                                    >
                                      {keyword("process_ingredients")}
                                    </Button>
                                  )}
                                </Box>
                              </div>
                            ))}
                          </Stack>
                        </>
                      </Stack>
                    ) : (
                      <></> /*<Alert severity="info">
                        {isImage
                          ? keyword("process_no_info_image")
                          : keyword("process_no_info_video")}
                      </Alert>*/
                    )}
                  </Box>
                </Box>
              </Stack>
            </>
          )}

          {parentId && (
            <Box sx={{ maxWidth: "fit-content", marginInline: "auto" }}>
              <Button
                onClick={() => onNavigate(parentId)}
                startIcon={<KeyboardArrowLeft />}
                variant="contained"
              >
                {keyword("previous_image")}
              </Button>
              <Box sx={{ m: 0.5 }} />
              {parentId !== mainImageId && (
                <Button
                  onClick={() => onNavigate(mainImageId)}
                  startIcon={<KeyboardDoubleArrowLeft />}
                  variant="contained"
                >
                  {keyword("first_image")}
                </Button>
              )}
            </Box>
          )}
          {role.includes(ROLES.EXTRA_FEATURE) && manifestData && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <JsonBlock jsonString={JSON.stringify(manifestData, null, 2)} />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default C2PaCard;
