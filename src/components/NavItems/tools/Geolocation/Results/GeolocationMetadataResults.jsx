import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ErrorBoundaryFallback from "@Shared/ErrorBoundaryFallback/ErrorBoundaryFallback";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const GeolocationMetadataResults = ({ metadata, urlImage }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Geolocalizer");

  if (!metadata?.latitude || !metadata?.longitude) return null;

  const resultIcon = new Icon({
    iconUrl: "img/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

  return (
    <Stack direction="column" spacing={4}>
      <Card variant="outlined" data-testid="geolocation-metadata-results">
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
              sx={{ justifyContent: "center", display: "flex" }}
              data-testid="geolocation-metadata-results-image"
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
            <Stack direction="column" spacing={4} sx={{ width: "100%" }}>
              <Box
                sx={{ width: "100%" }}
                data-testid="geolocation-metadata-results-map"
              >
                <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                  <MapContainer
                    center={[metadata.latitude, metadata.longitude]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{
                      width: "100%",
                      height: "400px",
                      borderRadius: 10,
                    }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <Marker
                      position={[metadata.latitude, metadata.longitude]}
                      icon={resultIcon}
                    >
                      <Popup>{keyword("geo_prediction")}</Popup>
                    </Marker>
                  </MapContainer>
                </ErrorBoundary>
              </Box>
              <Box sx={{ width: "100%" }}>
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
                    <Typography variant="body1" style={{ color: "#697684" }}>
                      {keyword("geo_lat")}
                    </Typography>
                    <Typography variant="h5">{metadata.latitude}</Typography>
                  </Grid>
                  <Grid
                    container
                    direction="column"
                    sx={{
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography variant="body1" style={{ color: "#697684" }}>
                      {keyword("geo_lon")}
                    </Typography>
                    <Typography variant="h5">{metadata.longitude}</Typography>
                  </Grid>
                </Grid>
                <Box sx={{ m: 4 }} />
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/place/${metadata.latitude},${metadata.longitude}`,
                      "_blank",
                    )
                  }
                  data-testid="geolocation-metadata-results-button-to-gmaps"
                >
                  {keyword("geo_maps")}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
};

export default GeolocationMetadataResults;
