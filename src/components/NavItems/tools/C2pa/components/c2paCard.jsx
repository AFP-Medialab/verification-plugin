import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

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
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import {
  ExpandMore,
  KeyboardArrowLeft,
  KeyboardDoubleArrowLeft,
} from "@mui/icons-material";
import HelpIcon from "@mui/icons-material/Help";
import MapIcon from "@mui/icons-material/Map";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import moment from "moment/moment";

const C2PaCard = ({ c2paData, currentImageSrc, setCurrentImageSrc }) => {
  const [mainImageId, setMainImageId] = useState(c2paData.mainImageId);
  const [currentImageId, setCurrentImageId] = useState(c2paData.currentImageId);

  const url = c2paData.result[currentImageId].url;
  const parentId = c2paData.result[currentImageId].parent;
  const manifestData = c2paData.result[currentImageId].manifestData;
  // const validationIssues = c2paData.result[currentImageId].validationIssues;

  const latitude =
    manifestData && manifestData.captureInfo
      ? manifestData.captureInfo.latitude
      : null;
  const longitude =
    manifestData && manifestData.captureInfo
      ? manifestData.captureInfo.longitude
      : null;

  const [isImage, setIsImage] = useState(true);

  const depthExceeded = c2paData.result[currentImageId].depthExceeded;

  const keyword = i18nLoadNamespace("components/NavItems/tools/C2pa");

  useEffect(() => {
    const testImage = new Image();
    testImage.src = url;
    testImage.onload = function () {
      setIsImage(true);
    };
    testImage.onerror = function () {
      setIsImage(false);
    };
  }, []);

  useEffect(() => {
    if (currentImageSrc !== url) {
      for (const [imageId, imageObject] of Object.entries(c2paData.result)) {
        if (imageObject.url === currentImageSrc) {
          setCurrentImageId(imageId);
          break;
        }
      }
    }
  }, [currentImageSrc]);

  // const validationMessage = (issues) => {
  //   if (issues.trustedSourceIssue && issues.errorMessages.length <= 2) {
  //     return keyword("content_credentials_unknown_source");
  //   } else {
  //     return keyword("content_credentials_invalid");
  //   }
  // };

  /**
   *
   * @param {String} title the keyword for the title
   * @param {String} information the keyword for the title description
   * @returns {React.JSX.Element}
   */
  const title = (title, information) => {
    return (
      <Grid
        container
        direction="row"
        sx={{
          alignItems: "center",
        }}
      >
        <Grid>
          <Typography variant="h6">{keyword(title)}</Typography>
        </Grid>
        <Grid
          sx={{
            m: 2,
          }}
        />
        <Tooltip title={<h3>{keyword(information)}</h3>}>
          <HelpIcon />
        </Tooltip>
      </Grid>
    );
  };

  return (
    <Box>
      <Card p={1}>
        <CardContent>
          {!manifestData ? (
            <Box
              sx={{
                m: 1,
              }}
            >
              {depthExceeded ? (
                <Alert>
                  {isImage
                    ? keyword("child_depth_exceeded_image")
                    : keyword("child_depth_exceeded_video")}
                </Alert>
              ) : (
                <Alert severity="info" m={1}>
                  {isImage
                    ? keyword("no_c2pa_info_image")
                    : keyword("no_c2pa_info_video")}
                </Alert>
              )}
              <Box
                sx={{
                  m: 1,
                }}
              />
            </Box>
          ) : (
            <>
              {/*{validationIssues ? (*/}
              {/*  <Box*/}
              {/*    sx={{*/}
              {/*      m: 1,*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    <Alert severity="error" m={1}>*/}
              {/*      {validationMessage(validationIssues)}*/}
              {/*    </Alert>*/}
              {/*    <Box*/}
              {/*      sx={{*/}
              {/*        m: 2,*/}
              {/*      }}*/}
              {/*    />*/}
              {/*  </Box>*/}
              {/*) : null}*/}
              <Typography variant="h5">
                {keyword("c2pa_information")}
              </Typography>
              <Box
                sx={{
                  m: 1,
                }}
              />
              <Stack>
                <Typography>{manifestData.title}</Typography>
                <Box
                  sx={{
                    m: 1,
                  }}
                />
                <Box
                  sx={{
                    p: 1,
                  }}
                >
                  <Stack>
                    {title(
                      "content_credentials_title",
                      "content_credential_explanation",
                    )}

                    <Box
                      sx={{
                        p: 1,
                      }}
                    >
                      <Typography>
                        {keyword("content_credentials_issuer") +
                          manifestData.signatureInfo.issuer}
                      </Typography>
                      <Typography>
                        {keyword("content_credentials_date_issued") +
                          moment(manifestData.signatureInfo.time).format(
                            "D.MM.yyyy",
                          )}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box
                    sx={{
                      m: 1,
                    }}
                  />
                  <Divider m={1} />
                </Box>
                {manifestData.producer && (
                  <Box
                    sx={{
                      p: 1,
                    }}
                  >
                    <Stack>
                      {title("credit_title", "credit_explanation")}
                      <Box
                        sx={{
                          p: 1,
                        }}
                      >
                        <>
                          <Typography>
                            {manifestData.producer.name
                              ? keyword("credit_producer") +
                                manifestData.producer.name
                              : ""}
                          </Typography>
                          {manifestData.producer.socials ? (
                            <>
                              <Typography>
                                {keyword("credit_social")}
                              </Typography>
                              <Stack>
                                {manifestData.producer.socials.map(
                                  (obj, key) => {
                                    return (
                                      <Typography key={key}>
                                        {obj["@id"]}
                                      </Typography>
                                    );
                                  },
                                )}
                              </Stack>
                            </>
                          ) : null}
                        </>
                      </Box>
                    </Stack>

                    <Box
                      sx={{
                        m: 1,
                      }}
                    />
                    <Divider m={1} />
                  </Box>
                )}

                {manifestData.captureInfo && (
                  <Box
                    sx={{
                      p: 1,
                    }}
                  >
                    <Stack>
                      {title("capture_info_title", "capture_info_explanation")}
                      <Box
                        sx={{
                          p: 1,
                        }}
                      >
                        <>
                          {manifestData.captureInfo.make ? (
                            <Typography>
                              {keyword("capture_info_make") +
                                manifestData.captureInfo.make}
                            </Typography>
                          ) : null}
                          {manifestData.captureInfo.model ? (
                            <Typography>
                              {keyword("capture_info_model") +
                                manifestData.captureInfo.model}
                            </Typography>
                          ) : null}
                          {manifestData.captureInfo.dateTime ? (
                            <Typography>
                              {keyword("capture_info_date") +
                                moment(
                                  manifestData.captureInfo.dateTime,
                                ).format("D.MM.yyyy")}
                            </Typography>
                          ) : null}
                          {manifestData.captureInfo.latitude ? (
                            <>
                              <Typography>
                                {keyword("capture_info_latitude") +
                                  manifestData.captureInfo.latitude}
                              </Typography>
                            </>
                          ) : null}
                          {manifestData.captureInfo.longitude ? (
                            <>
                              <Typography>
                                {keyword("capture_info_longitude") +
                                  manifestData.captureInfo.longitude}
                              </Typography>
                            </>
                          ) : null}
                          {longitude && latitude ? (
                            <Box
                              sx={{
                                p: 3,
                              }}
                            >
                              {!isNaN(longitude) && !isNaN(latitude) ? (
                                <>
                                  <MapContainer
                                    center={[latitude, longitude]}
                                    zoom={13}
                                    scrollWheelZoom={false}
                                    style={{
                                      width: "100%",
                                      height: "200px",
                                    }}
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
                                    ></Marker>
                                  </MapContainer>
                                  <Box
                                    sx={{
                                      m: 1,
                                    }}
                                  />
                                </>
                              ) : null}

                              <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() =>
                                  window.open(
                                    "http://www.google.com/maps/place/" +
                                      latitude +
                                      "," +
                                      longitude,
                                    "_blank ",
                                  )
                                }
                              >
                                <MapIcon />
                                {keyword("geo_maps")}
                              </Button>
                            </Box>
                          ) : null}
                          {manifestData.captureInfo.allCaptureInfo ? (
                            <Box
                              sx={{
                                p: 1,
                              }}
                            >
                              <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                  <Typography>
                                    {keyword("capture_info_more_results")}
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  {manifestData.captureInfo.allCaptureInfo.map(
                                    (obj, key) => {
                                      return (
                                        <Stack key={key}>
                                          {Object.keys(obj.data).map(
                                            (objKey, index) => {
                                              if (
                                                typeof obj.data[objKey] ===
                                                "string"
                                              ) {
                                                return (
                                                  <Typography key={index}>
                                                    {objKey +
                                                      ": " +
                                                      obj.data[objKey]}
                                                  </Typography>
                                                );
                                              } else {
                                                return null;
                                              }
                                            },
                                          )}
                                        </Stack>
                                      );
                                    },
                                  )}
                                </AccordionDetails>
                              </Accordion>
                            </Box>
                          ) : null}
                        </>
                      </Box>
                    </Stack>

                    <Box
                      sx={{
                        m: 1,
                      }}
                    />
                    <Divider />
                  </Box>
                )}

                <Box
                  sx={{
                    p: 1,
                  }}
                >
                  {title("process_title", "process_explanation")}
                  <Box
                    sx={{
                      p: 1,
                    }}
                  >
                    {manifestData.editsAndActivity || manifestData.children ? (
                      <Stack>
                        {manifestData.editsAndActivity ? (
                          <>
                            <Typography
                              sx={{
                                fontSize: 18,
                              }}
                            >
                              {keyword("process_edits")}
                            </Typography>
                            <Box
                              sx={{
                                m: 1,
                              }}
                            />
                            <Box
                              sx={{
                                paddingLeft: 2,
                              }}
                            >
                              {manifestData.editsAndActivity.map((obj, key) => {
                                return (
                                  <Stack key={key}>
                                    <Stack direction="row">
                                      <img src={obj.icon} />
                                      <Typography
                                        sx={{
                                          paddingLeft: 1,
                                        }}
                                      >
                                        {obj.label + ":"}
                                      </Typography>
                                    </Stack>
                                    <Typography
                                      sx={{
                                        paddingLeft: 1,
                                      }}
                                    >
                                      {obj.description}
                                    </Typography>
                                    <Box
                                      sx={{
                                        m: 0.5,
                                      }}
                                    />
                                  </Stack>
                                );
                              })}
                            </Box>
                          </>
                        ) : null}

                        {manifestData.children ? (
                          <>
                            <Typography
                              sx={{
                                fontSize: 18,
                              }}
                            >
                              {keyword("process_ingredients")}
                            </Typography>
                            <Box
                              sx={{
                                m: 1,
                              }}
                            />
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{
                                p: 1,
                              }}
                            >
                              {manifestData.children.map((obj, key) => {
                                return (
                                  <Box key={key}>
                                    <img
                                      src={c2paData.result[obj].url}
                                      style={{
                                        maxWidth: "150px",
                                        maxHeight: "60vh",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        setCurrentImageId(obj);
                                        setCurrentImageSrc(
                                          c2paData.result[obj].url,
                                        );
                                      }}
                                    />
                                  </Box>
                                );
                              })}
                            </Stack>
                          </>
                        ) : null}
                      </Stack>
                    ) : (
                      <Alert severity="info">
                        {isImage
                          ? keyword("process_no_info_image")
                          : keyword("process_no_info_video")}
                      </Alert>
                    )}
                  </Box>
                </Box>
              </Stack>
            </>
          )}
          {parentId ? (
            <Box
              sx={{
                maxWidth: "fit-content",
                marginInline: "auto",
              }}
            >
              <Button
                onClick={() => {
                  setCurrentImageId(parentId);
                  setCurrentImageSrc(c2paData.result[parentId].url);
                }}
                startIcon={<KeyboardArrowLeft />}
                variant="contained"
              >
                {keyword("previous_image")}
              </Button>
              <Box
                sx={{
                  m: 0.5,
                }}
              />
              {parentId !== mainImageId ? (
                <Button
                  onClick={() => {
                    setCurrentImageId(mainImageId);
                    setCurrentImageSrc(c2paData.result[mainImageId].url);
                  }}
                  startIcon={<KeyboardDoubleArrowLeft />}
                  variant="contained"
                >
                  {keyword("first_image")}
                </Button>
              ) : null}
            </Box>
          ) : null}
        </CardContent>
      </Card>
    </Box>
  );
};

export default C2PaCard;
