import React, { useState } from "react";
import Iframe from "react-iframe";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { CastForEducation, ExpandMore } from "@mui/icons-material";

import { changeTabEvent } from "@Shared/GoogleAnalytics/GoogleAnalytics";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import PropTypes from "prop-types";

import IconClassRoom from "../../NavBar/images/SVG/Navbar/Classroom.svg";
import HeaderTool from "../../Shared/HeaderTool/HeaderTool";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import youverifyImage from "./Images/YouVerify_Logo.png";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box
        sx={{
          p: 3,
        }}
      >
        {children}
      </Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ClassRoom = () => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/ClassRoom");

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    changeTabEvent(newValue, tabTitle(newValue));
  };

  const [videoUrl, setVideoUrl] = useState(null);
  const [inputRef, setInputRef] = useState(null);

  const glossary = () => {
    let res = [];
    let i = 1;
    while (keyword("glossary_word_" + i) !== "glossary_word_" + i) {
      res.push({
        word: keyword("glossary_word_" + i),
        definition: keyword("glosary_definition_" + i),
      });
      i++;
    }
    return res;
  };

  const EducationalResources = () => {
    let res = [];
    for (
      let i = 1;
      keyword("classroom_title_" + i) !== "classroom_title_" + i;
      i++
    ) {
      res.push({
        title: keyword("classroom_title_" + i),
        url: keyword("classroom_url_" + i),
      });
    }
    return res;
  };

  const introduction = (n) => {
    let arr = [];
    for (let i = 1; i <= n; i++) {
      arr.push({
        title: keyword("introduction_title" + i),
        content: keyword("introduction_para" + i),
      });
    }
    return arr;
  };

  const tabTitle = (index) => {
    switch (index) {
      case 0:
        return keyword("classroom_introduction");
      case 1:
        return keyword("classroom_teaching");
      case 2:
        return keyword("remote_resources_title");
      case 3:
        return keyword("classroom_game");
      case 4:
        return keyword("classroom_gamification");
      /*case 5:
                                                                                                                                                                          return keyword("classroom_gamification_2");*/
      case 5:
        return keyword("user_resources_title");
      case 6:
        return keyword("glossary_title");
      default:
        return keyword("classroom_introduction");
    }
  };

  return (
    <Box>
      <Stack direction="column" spacing={2}>
        <HeaderTool
          name={keyword("classroom_title")}
          icon={
            <IconClassRoom
              style={{
                fill: "var(--mui-palette-primary-main)",
                marginRight: "10px",
              }}
              width="40px"
              height="40px"
            />
          }
        />
        <Card variant="outlined">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                mt: 1,
              }}
            />

            <Tabs
              indicatorColor="primary"
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                sx={{ minWidth: "100px !important" }}
                label={tabTitle(0)}
                {...a11yProps(0)}
              />
              <Tab
                sx={{ minWidth: "100px !important" }}
                label={tabTitle(1)}
                {...a11yProps(1)}
              />
              <Tab
                sx={{ minWidth: "100px !important" }}
                label={tabTitle(2)}
                {...a11yProps(2)}
              />
              <Tab
                sx={{ minWidth: "100px !important" }}
                label={tabTitle(3)}
                {...a11yProps(3)}
              />
              <Tab
                sx={{ minWidth: "100px !important" }}
                label={tabTitle(4)}
                {...a11yProps(4)}
              />
              {/* <Tab label={tabTitle(5)}  {...a11yProps(5)} />*/}
              <Tab
                sx={{ minWidth: "100px !important" }}
                label={tabTitle(5)}
                {...a11yProps(5)}
              />
              <Tab
                sx={{ minWidth: "100px !important" }}
                label={tabTitle(6)}
                {...a11yProps(6)}
              />
            </Tabs>
            <TabPanel value={value} index={0}>
              {introduction(5).map((obj, index) => {
                return (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        {obj.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        sx={{
                          textAlign: "start",
                        }}
                      >
                        {obj.content}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Iframe
                frameBorder="0"
                url={keyword("teaching_url")}
                allow="fullscreen"
                height="700"
                width="100%"
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Divider />
              {EducationalResources().map((value, index) => {
                return (
                  <div key={index}>
                    <Box
                      sx={{
                        m: 1,
                      }}
                    />
                    <Grid
                      key={index}
                      container
                      direction="row"
                      spacing={2}
                      sx={{
                        justifyContent: "space-between",
                      }}
                    >
                      <Grid
                        container
                        direction="row"
                        size={{ xs: 10 }}
                        spacing={2}
                        sx={{
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                      >
                        <Grid size={{ xs: 1 }}>
                          <CastForEducation fontSize={"large"} />
                        </Grid>
                        <Grid size="grow">
                          <Typography variant={"h6"}>{value.title}</Typography>
                        </Grid>
                      </Grid>
                      <Grid size="grow">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setVideoUrl(value.url)}
                        >
                          {keyword("display")}
                        </Button>
                      </Grid>
                    </Grid>
                    <Divider />
                  </div>
                );
              })}
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Iframe
                frameBorder="0"
                url={keyword("quiz_url")}
                allow="fullscreen"
                height="450"
                width="100%"
              />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <Iframe
                frameBorder="0"
                url={keyword("gamification_url")}
                allow="fullscreen"
                height="450"
                width="100%"
              />
            </TabPanel>
            {/*<TabPanel value={value} index={5}>
                                <Iframe
                                    frameBorder="0"
                                    url={keyword("gamification_url_2")}
                                    allow="fullscreen"
                                    height="450"
                                    width="100%"
                                />
                            </TabPanel>*/}
            <TabPanel value={value} index={5}>
              <Grid container direction="column" spacing={2}>
                <Grid
                  sx={{
                    mb: 2,
                  }}
                >
                  <Typography variant={"h5"}>
                    {keyword("user_resources_intro")}
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="body1" align={"justify"}>
                    {keyword("user_resources_intro_remote")}
                  </Typography>
                </Grid>
                <Grid>
                  <TextField
                    inputRef={(ref) => setInputRef(ref)}
                    id="standard-full-width"
                    label={keyword("api_input")}
                    placeholder="URL"
                    fullWidth
                  />
                </Grid>
                <Grid>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setVideoUrl(inputRef.value)}
                  >
                    {keyword("display")}
                  </Button>
                </Grid>
                <Grid
                  sx={{
                    mt: 4,
                  }}
                >
                  <Typography variant="body1">{keyword("examples")}</Typography>
                  <Typography variant="body1">
                    {keyword("youtube_example")}
                  </Typography>
                  <Typography variant="body1">
                    {keyword("twitter_example")}
                  </Typography>
                  <Typography variant="body1">
                    {keyword("website_example")}
                  </Typography>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={6}>
              {glossary().map((obj, key) => {
                return (
                  <div key={key}>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "inline",
                      }}
                    >
                      {obj.word + " : "}
                    </Typography>
                    <Typography
                      variant="body1"
                      align={"justify"}
                      sx={{
                        display: "inline",
                      }}
                    >
                      {obj.definition}
                    </Typography>
                    <Box
                      sx={{
                        m: 2,
                      }}
                    />
                  </div>
                );
              })}
            </TabPanel>
          </Box>
          <a
            href={keyword("youverify_link")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={youverifyImage} width={"10%"} alt={youverifyImage} />
          </a>
          <Dialog
            height={"400px"}
            fullWidth
            maxWidth={"md"}
            open={videoUrl !== null}
            onClose={() => setVideoUrl(null)}
            aria-labelledby="max-width-dialog-title"
          >
            <DialogContent>
              <Iframe
                frameBorder="0"
                url={videoUrl}
                allow="fullscreen"
                height="400"
                width="100%"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setVideoUrl(null)} color="primary">
                {keyword("close")}
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Stack>
    </Box>
  );
};
export default ClassRoom;
