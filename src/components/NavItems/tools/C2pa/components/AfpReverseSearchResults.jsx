import React, { useState } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";

import { TabContext, TabList, TabPanel } from "@mui/lab";

import { i18nLoadNamespace } from "../../../../Shared/Languages/i18nLoadNamespace";
import { prettyCase } from "../../../../Shared/Utils/stringUtils";

const AfpReverseSearchResults = ({
  thumbnailImage,
  thumbnailImageCaption,
  imageMetadata,
}) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/C2pa");

  const [tabValue, setTabValue] = useState("exif");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Stack direction="row" spacing={4}>
      <Box width="100%">
        <Grid2 container direction="row" spacing={2} p={4} width="100%">
          <Grid2
            container
            direction="column"
            size={{ md: 12, lg: 6 }}
            spacing={2}
          >
            <Grid2>
              <img
                src={thumbnailImage}
                style={{
                  width: 345,
                  borderRadius: "10px",
                }}
              />
            </Grid2>

            {thumbnailImageCaption &&
            typeof thumbnailImageCaption === "string" ? (
              <Grid2 mt={2}>
                <Stack direction="column" spacing={1}>
                  <Typography>{keyword("image_caption_title")}</Typography>

                  <Typography variant={"caption"}>
                    {thumbnailImageCaption}
                  </Typography>
                </Stack>
              </Grid2>
            ) : (
              <Alert severity="info" sx={{ width: "fit-content" }}>
                {keyword("no_caption_available_alert")}
              </Alert>
            )}
          </Grid2>
          <Grid2
            container
            direction="column"
            size={{ md: 12, lg: 6 }}
            spacing={2}
          >
            <Alert severity="info" sx={{ width: "fit-content" }}>
              {keyword("afp_produced_image_info")}
            </Alert>

            {imageMetadata && (
              <>
                <Box sx={{ width: "100%", typography: "body1" }}>
                  <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        variant="scrollable"
                        scrollButtons="auto"
                        onChange={handleTabChange}
                        aria-label="Image metadata tabs"
                      >
                        {Object.keys(imageMetadata)
                          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                          .map((item, index) => {
                            return (
                              <Tab label={item} value={item} key={index} />
                            );
                          })}
                      </TabList>
                    </Box>

                    {Object.keys(imageMetadata).map((metadataGroup, index) => {
                      return (
                        <TabPanel value={metadataGroup} key={index}>
                          <List>
                            {Object.entries(imageMetadata[metadataGroup]).map(
                              ([key, value]) => {
                                // we may need to improve the value processing later on for a prettier print
                                return (
                                  <ListItem key={key} disablePadding>
                                    <ListItemText
                                      primary={prettyCase(key)}
                                      secondary={<>{value.toString()}</>}
                                    />
                                  </ListItem>
                                );
                              },
                            )}
                          </List>
                        </TabPanel>
                      );
                    })}
                  </TabContext>
                </Box>
              </>
            )}
          </Grid2>
        </Grid2>
      </Box>
    </Stack>
  );
};

export default AfpReverseSearchResults;
