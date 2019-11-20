import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tab from "@material-ui/core/Tab";
import HelpIcon from '@material-ui/icons/Help';
import IconButton from "@material-ui/core/IconButton";
import CardContent from "@material-ui/core/CardContent";
import Badge from "@material-ui/core/Badge";
import CardActions from "@material-ui/core/CardActions";

import ModalVideo from 'react-modal-video'
import {useStaticState} from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Iframe from "react-iframe";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import history from "../../../utility/History/History";

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
            <Grid container justify="center" spacing={2}>
                {
                    tools.map((value, key) => {
                        if (key !== 0)
                            return (
                                <Box key={key} m={3}>
                                    <Paper className={classes.card}>
                                        <Tab label={keyword(value.title)} className={classes.card}
                                             icon={value.icon}
                                             onClick={() => handleClick(value.path)}/>
                                        <IconButton aria-label="settings" className={classes.expand} size={"small"}
                                                    onClick={() => setVideoUrl(keyword(value.tsvPrefix + "_help_video"))}
                                                    >
                                            <HelpIcon/>
                                        </IconButton>
                                    </Paper>
                                </Box>
                            )
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