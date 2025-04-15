import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

import { ROLES } from "../../../../../constants/roles";

const GeolocationResults = ({ result, urlImage }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Geolocalizer");

  const userRoles = useSelector((state) => state.userSession.user.roles);

  if (!userRoles.includes(ROLES.EXTRA_FEATURE)) {
    result = result.slice(0, 1);
  }

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        {result &&
          result.length > 0 &&
          result.map((res, key) => (
            <Card variant="outlined" key={key}>
              {userRoles.includes(ROLES.EXTRA_FEATURE) &&
                res.confidence &&
                typeof res.confidence === "number" && (
                  <Box
                    sx={{
                      width: "100%",
                      p: 4,
                    }}
                  >
                    <Typography>{`Confidence score: ${
                      res.confidence >= 0.5
                        ? Math.round(res.confidence * 100)
                        : Math.floor(res.confidence * 100)
                    }%`}</Typography>
                  </Box>
                )}
              <Grid
                container
                direction={{ md: "row", xs: "column" }}
                style={{ flexWrap: "nowrap" }}
                spacing={4}
                sx={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                  p: 4,
                }}
              >
                <Grid
                  container
                  direction="column"
                  spacing={3}
                  size={{ md: 6, xs: 12 }}
                  sx={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <Grid
                    size={6}
                    style={{ width: "100%" }}
                    sx={{
                      justifyContent: "center",
                      display: "flex",
                    }}
                  >
                    <img
                      src={urlImage}
                      alt="image submitted"
                      style={{
                        maxHeight: "400px",
                        maxWidth: "-webkit-fill-available",
                        backgroundSize: "contain",
                        borderRadius: 10,
                      }}
                    />
                  </Grid>
                </Grid>

                {res.latitude && res.longitude && (
                  <Grid
                    container
                    direction="column"
                    spacing={3}
                    size={{ md: 6, xs: 12 }}
                    sx={{
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    <Stack
                      direction="column"
                      spacing={4}
                      sx={{
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <MapContainer
                          center={[res.latitude, res.longitude]}
                          zoom={13}
                          scrollWheelZoom={false}
                          style={{
                            width: "100%",
                            height: "400px",
                            borderRadius: 10,
                          }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker
                            position={[res.latitude, res.longitude]}
                            icon={
                              new Icon({
                                iconUrl: "img/marker_location.svg",
                                iconSize: [60, 60],
                                iconAnchor: [30, 0],
                              })
                            }
                          >
                            <Popup>{keyword("geo_prediction")}</Popup>
                          </Marker>
                        </MapContainer>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Grid
                          container
                          direction="row"
                          style={{ flexWrap: "nowrap" }}
                          spacing={1}
                          sx={{
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Grid
                            container
                            direction="column"
                            sx={{
                              justifyContent: "flex-start",
                              alignItems: "flex-start",
                            }}
                          >
                            <Typography
                              variant="body1"
                              style={{ color: "#697684" }}
                            >
                              {keyword("geo_lat")}
                            </Typography>

                            <Typography variant="h5">{res.latitude}</Typography>
                          </Grid>

                          <Grid
                            container
                            direction="column"
                            sx={{
                              justifyContent: "flex-start",
                              alignItems: "flex-start",
                            }}
                          >
                            <Typography
                              variant="body1"
                              style={{ color: "#697684" }}
                            >
                              {keyword("geo_lon")}
                            </Typography>

                            <Typography variant="h5">
                              {res.longitude}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Box
                          sx={{
                            m: 4,
                          }}
                        />

                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          onClick={() =>
                            window.open(
                              "https://www.google.com/maps/place/" +
                                res.latitude +
                                "," +
                                res.longitude,
                              "_blank ",
                            )
                          }
                        >
                          {keyword("geo_maps")}
                        </Button>
                      </Box>
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </Card>
          ))}
      </Stack>
    </Box>
  );
};
export default GeolocationResults;
