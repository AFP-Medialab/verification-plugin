import React, { useState } from "react";
import { Card, createTheme, ThemeProvider } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Iframe from "react-iframe";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import youverifyImage from "./Images/YouVerify_Logo.png";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/ClassRoom.tsv";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import { changeTabEvent } from "../../Shared/GoogleAnalytics/GoogleAnalytics";
import HeaderTool from "../../Shared/HeaderTool/HeaderTool";
import IconClassRoom from "../../NavBar/images/SVG/Navbar/Classroom.svg";

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
      <Box p={3}>{children}</Box>
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
  const keyword = useLoadLanguage("components/NavItems/ClassRoom.tsv", tsv);

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
    while (keyword("glossary_word_" + i) !== "") {
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
    for (let i = 1; keyword("classroom_title_" + i) !== ""; i++) {
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

  const theme = createTheme({
    components: {
      MuiTab: {
        styleOverrides: {
          wrapper: {
            fontSize: "10px",
          },
          root: {
            minWidth: "100px!important",
          },
        },
      },
    },
    palette: {
      primary: {
        light: "#00926c",
        main: "#00926c",
        dark: "#00926c",
        contrastText: "#fff",
      },
    },
  });

  return (
    <div>
      <ThemeProvider theme={theme}>
        <HeaderTool
          name={keyword("classroom_title")}
          icon={
            <IconClassRoom
              style={{ fill: "#00926c", marginRight: "10px" }}
              width="40px"
              height="40px"
            />
          }
        />

        <Card>
          <Box display="flex" flexDirection="column">
            <Box mt={1} />

            <Tabs
              indicatorColor="primary"
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              variant="fullWidth"
            >
              <Tab label={tabTitle(0)} {...a11yProps(0)} />
              <Tab label={tabTitle(1)} {...a11yProps(1)} />
              <Tab label={tabTitle(2)} {...a11yProps(2)} />
              <Tab label={tabTitle(3)} {...a11yProps(3)} />
              <Tab label={tabTitle(4)} {...a11yProps(4)} />
              {/* <Tab label={tabTitle(5)}  {...a11yProps(5)} />*/}
              <Tab label={tabTitle(5)} {...a11yProps(5)} />
              <Tab label={tabTitle(6)} {...a11yProps(6)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              {introduction(5).map((obj, index) => {
                return (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        {obj.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography textAlign={"start"}>{obj.content}</Typography>
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
                    <Box m={1} />
                    <Grid
                      key={index}
                      container
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Grid
                        container
                        direction="row"
                        item
                        xs={10}
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={2}
                      >
                        <Grid item xs={1}>
                          <CastForEducationIcon fontSize={"large"} />
                        </Grid>
                        <Grid item xs>
                          <Typography variant={"h6"}>{value.title}</Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs>
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
                <Grid item mb={2}>
                  <Typography variant={"h5"}>
                    {keyword("user_resources_intro")}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1" align={"justify"}>
                    {keyword("user_resources_intro_remote")}
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    inputRef={(ref) => setInputRef(ref)}
                    id="standard-full-width"
                    label={keyword("api_input")}
                    placeholder="URL"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setVideoUrl(inputRef.value)}
                  >
                    {keyword("display")}
                  </Button>
                </Grid>
                <Grid item mt={4}>
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
                    <Typography variant="h6" display="inline">
                      {obj.word + " : "}
                    </Typography>
                    <Typography
                      variant="body1"
                      display="inline"
                      align={"justify"}
                    >
                      {obj.definition}
                    </Typography>
                    <Box m={2} />
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
      </ThemeProvider>
    </div>
  );
};
export default ClassRoom;
