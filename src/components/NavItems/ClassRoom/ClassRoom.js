import React, {useState} from "react";
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Iframe from "react-iframe";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import CastForEducationIcon from '@material-ui/icons/CastForEducation';
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import youCheckImage from "./Images/youCheck.png"
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/ClassRoom.tsv";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Accordion from "@material-ui/core/Accordion";
import {changeTabEvent} from "../../Shared/GoogleAnalytics/GoogleAnalytics";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

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
        'aria-controls': `simple-tabpanel-${index}`,
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
            while (keyword("glossary_word_" + i) !== '') {
                res.push({
                        word: keyword("glossary_word_" + i),
                        definition: keyword("glosary_definition_" + i)
                    }
                );
                i++;
            }
            return res;
        };

        const EducationalResources = () => {
            let res = [];
            for (let i = 1; keyword("classroom_title_" + i) !== ""; i++) {
                res.push(
                    {
                        title: keyword("classroom_title_" + i),
                        url: keyword("classroom_url_" + i)
                    }
                );
            }
            return res;
        };

        const introduction = (n) => {
            let arr = [];
            for (let i=1; i <= n; i++) {
                arr.push({
                    title: keyword("introduction_title" + i),
                    content: keyword("introduction_para" + i)
                })
            }
            return arr;
        }

        const tabTitle = (index) => {
            switch (index) {
                case 0:
                    return keyword("classroom_introduction");
                case 1: 
                    return keyword("classroom_teaching");
                case 2:
                    return keyword("remote_resources_title");
                case 3:
                    return keyword("classroom_gamification");
                case 4:
                    return keyword("user_resources_title");
                case 5:
                    return keyword("glossary_title");
                default:
                    return keyword("classroom_introduction");
            }
        }

        return (
            <Paper className={classes.root}>
                <Box justifyContent="center" display="flex" flexDirection="column">
                    <CustomTile text={keyword("classroom_title")}/>
                    <Box m={1}/>
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label={tabTitle(0)} {...a11yProps(0)} />
                        <Tab label={tabTitle(1)} {...a11yProps(1)} />
                        <Tab label={tabTitle(2)} {...a11yProps(2)} />
                        <Tab label={tabTitle(3)} {...a11yProps(3)} />
                        <Tab label={tabTitle(4)}  {...a11yProps(4)} />
                        <Tab label={tabTitle(5)}  {...a11yProps(5)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        {
                            introduction(5).map((obj, index) => {
                                return (
                                    <Accordion key={index}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography className={classes.heading}>{obj.title}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className={"content"}
                                                dangerouslySetInnerHTML={{ __html: obj.content }}></div>
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            })
                        }
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
                        <Divider/>
                        {
                            EducationalResources().map((value, index) => {
                                return (
                                    <div key={index}>
                                        <Box m={1}/>
                                        <Grid key={index} container justify="space-between" spacing={2}
                                              alignContent={"center"}>
                                            <Grid item>
                                                <CastForEducationIcon fontSize={"large"}/>
                                            </Grid>
                                            <Grid item align="left">
                                                <Typography variant={"h6"}>
                                                    {
                                                        value.title
                                                    }
                                                </Typography>
                                            </Grid>
                                            <Grid item align="right">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => setVideoUrl(value.url)}>
                                                    {
                                                        keyword("display")
                                                    }
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Divider/>
                                    </div>
                                )
                            })
                        }
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Iframe
                            frameBorder="0"
                            url={keyword("gamification_url")}
                            allow="fullscreen"
                            height="450"
                            width="100%"
                        />
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        <Typography variant={"h5"}>{keyword("user_resources_intro")}</Typography>
                        <Box m={2}/>
                        <Typography variant="body1" align={"justify"}>{keyword("user_resources_intro_remote")}</Typography>
                        <div>
                            <TextField
                                inputRef={ref => setInputRef(ref)}
                                id="standard-full-width"
                                label={keyword("api_input")}
                                placeholder="URL"
                                fullWidth
                            />
                            <Box m={1}/>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setVideoUrl(inputRef.value)}>
                                {
                                    keyword("display")
                                }
                            </Button>
                        </div>
                        <Typography variant="body1" color="textSecondary" align={"justify"}>
                            {
                                keyword("examples")
                            }
                        </Typography>
                        <Typography variant="body1" color="textSecondary" align={"justify"}>
                            {
                                keyword("youtube_example")
                            }
                        </Typography>
                        <Typography variant="body1" color="textSecondary" align={"justify"}>
                            {
                                keyword("twitter_example")
                            }
                        </Typography>
                        <Typography variant="body1" color="textSecondary" align={"justify"}>
                            {
                                keyword("website_example")
                            }
                        </Typography>
                    </TabPanel>
                    <TabPanel value={value} index={5}>
                        {
                            glossary().map((obj, key) => {
                                return (
                                    <div key={key}>
                                        <Typography variant="h6" display="inline">
                                            {
                                                obj.word +" : "
                                            }
                                        </Typography>
                                        <Typography variant="body1" display="inline" align={"justify"}>
                                            {
                                                obj.definition
                                            }
                                        </Typography>
                                        <Box m={2}/>
                                    </div>
                                )
                            })
                        }
                    </TabPanel>
                </Box>
                <a href="http://project-youcheck.com/" target="_blank" rel="noopener noreferrer">
                    <img src={youCheckImage} width={"10%"} alt={youCheckImage}/>
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
            </Paper>
        );
    }
;
export default ClassRoom;