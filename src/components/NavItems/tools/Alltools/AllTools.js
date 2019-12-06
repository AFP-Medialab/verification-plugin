import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tab from "@material-ui/core/Tab";
import HelpIcon from '@material-ui/icons/Help';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import Iframe from "react-iframe";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import history from "../../../utility/History/History";
import Icon from "@material-ui/core/Icon";
import classRoomIcon from "../../../NavBar/images/navbar/classroom-off.png";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {Image} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 20,
        textAlign: "center",
    },
    card: {
        paddingRight: 0,
    },

    expand: {
        float: "right",
    },
}));


const AllTools = (props) => {
    const classes = useStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };
    const tools = props.tools;

    const [videoUrl, setVideoUrl] = useState(null);

    const handleClick = (path) => {
        history.push("/app/tools/" + path)
    };


    return (
        <Paper className={classes.root}>
            <Grid container justify="center" spacing={10}>
                {
                    tools.map((value, key) => {
                        if (key !== 0)
                            return (
                                <Grid item>
                                    <Grid justify="center">
                                        <Grid item onClick={() => handleClick(value.path)}>
                                            <img
                                                style={{
                                                    maxWidth: 100,
                                                    height: "auto"
                                                }}
                                                src={value.icon}
                                                alt={value.icon}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Grid>
                                                <Typography variant={"body1"}>
                                                    {keyword(value.title)}
                                                    <IconButton
                                                        aria-label="settings"
                                                        size={"small"}
                                                        onClick={() => setVideoUrl(keyword(value.tsvPrefix + "_help_video"))}
                                                    >
                                                        <HelpIcon/>
                                                    </IconButton>
                                                </Typography>

                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            );
                        return null;
                    })
                }
            </Grid>
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
export default AllTools;