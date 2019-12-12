import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
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
import youCheckImage from "../../../Images/youCheck.png"


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        textAlign: "center",

    },
    card: {
        maxWidth: "300px",
        textAlign: "center",
    },
    media: {
        height: "auto",
        width: "auto",
        maxWidth: "60%",
    },
    grow: {
        flewGrow: 1,
    }
}));

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
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary &&  dictionary[lang]) ? dictionary[lang][key] : "";
    };

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [videoUrl, setVideoUrl] = useState(null);
    const [inputRef, setInputRef] = useState(null);
    const classes = useStyles();

    const EducationalResources = [
        {
            title: keyword("classroom_title_1"),
            url: "(tsv Fix)"
        },
        {
            title: keyword("classroom_title_2"),
            url: "(tsv Fix)"
        },
        {
            title: keyword("classroom_title_3"),
            url: "(tsv Fix)"
        },
        {
            title: keyword("classroom_title_4"),
            url: "(tsv Fix)"
        },
        {
            title: keyword("classroom_title_5"),
            url: "(tsv Fix)"
        },
    ];


    return (
        <Paper className={classes.root}>
            <Box justifyContent="center" display="flex" flexDirection="column">
                <CustomTile> {keyword("classroom_title")}  </CustomTile>
                <Box m={1}/>
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label={keyword("remote_resources_title")} {...a11yProps(0)} />
                    <Tab label={keyword("user_resources_title")}  {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <Divider/>
                    {
                        EducationalResources.map((value, index) => {
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
                                                onClick={() => setVideoUrl(keyword(value.tsvPrefix + "_help_video"))}>
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
                <TabPanel value={value} index={1}>
                    <Typography variant={"h5"}>{keyword("user_resources_intro")}</Typography>
                    <Typography variant="body1">{keyword("user_resources_intro_remote")}</Typography>
                    <div className={classes.root}>

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
                    <Typography variant="body1">
                        Youtube: https://www.youtube.com/embed/5wRv8boqIEc
                    </Typography>
                    <Typography variant="body1">
                        Twitter:
                        https://video.twimg.com/amplify_video/1055750649462308866/vid/640x360/yqQIZj-jHZRxl0i2.mp4
                    </Typography>
                    <Typography variant="body1">
                        iframe : https://www.youtube.com/embed/5wRv8boqIEc
                    </Typography>
                </TabPanel>
            </Box>
            <img src={youCheckImage} width={"20%"} alt={youCheckImage}/>
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
};
export default ClassRoom;