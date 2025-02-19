import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";

import { Map } from "@mui/icons-material";

import { TabContext, TabList, TabPanel } from "@mui/lab";

import { i18nLoadNamespace } from "../Languages/i18nLoadNamespace";
import { prettyCase } from "../Utils/stringUtils";

const MetadataList = ({ metadata }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Metadata");

  const [tabValue, setTabValue] = useState(
    Object.keys(metadata).length ? Object.keys(metadata).sort()[0] : false,
  );

  // Sync tabValue when metadata updates
  useEffect(() => {
    console.log(metadata);

    const sortedKeys = Object.keys(metadata).sort();
    if (sortedKeys.length) {
      setTabValue(sortedKeys[0]);
    } else {
      setTabValue(0);
    }
  }, [metadata]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getGoogleMapsLink = (
    latitude,
    latitudeRef,
    longitude,
    longitudeRef,
  ) => {
    if (!latitude || !latitudeRef || !longitude || !longitudeRef) {
      return <></>;
    }

    let url = "https://www.google.com/maps/place/"; //38%C2%B054'35.4%22N+1%C2%B026'19.2%22E/
    let lat =
      latitude[0] +
      "%C2%B0" +
      latitude[1] +
      "'" +
      latitude[2] +
      "%22" +
      latitudeRef;
    let long =
      longitude[0] +
      "%C2%B0" +
      longitude[1] +
      "'" +
      longitude[2] +
      "%22" +
      longitudeRef;
    return url + lat + "+" + long;
  };

  return (
    <>
      {metadata ? (
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                variant="scrollable"
                scrollButtons="auto"
                onChange={handleTabChange}
                aria-label="Image metadata tabs"
              >
                {Object.keys(metadata)
                  .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                  .map((item, index) => {
                    return <Tab label={item} value={item} key={index} />;
                  })}
              </TabList>
            </Box>

            {Object.keys(metadata).map((metadataGroup, index) => {
              return (
                <TabPanel value={metadataGroup} key={index}>
                  <List>
                    {Object.entries(metadata[metadataGroup]).map(
                      ([key, value]) => {
                        // we may need to improve the value processing later on for a prettier print
                        if (value) {
                          return (
                            <ListItem key={key} disablePadding>
                              <ListItemText
                                primary={prettyCase(key)}
                                secondary={<>{value.toString() ?? ""}</>}
                              />
                            </ListItem>
                          );
                        }
                      },
                    )}
                  </List>
                </TabPanel>
              );
            })}
          </TabContext>

          {metadata &&
            tabValue === "gps" &&
            metadata["gps"] &&
            metadata["gps"]["GPSLatitude"] &&
            metadata["gps"]["GPSLatitudeRef"] &&
            metadata["gps"]["GPSLongitude"] &&
            metadata["gps"]["GPSLongitudeRef"] && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  window.open(
                    getGoogleMapsLink(
                      metadata["gps"]["GPSLatitude"],
                      metadata["gps"]["GPSLatitudeRef"],
                      metadata["gps"]["GPSLongitude"],
                      metadata["gps"]["GPSLongitudeRef"],
                    ),
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <Map />
                <Typography variant={"subtitle2"}>
                  {keyword("metadata_gps_button")}
                </Typography>
              </Button>
            )}
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export default MetadataList;
