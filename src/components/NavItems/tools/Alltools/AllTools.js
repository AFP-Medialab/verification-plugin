import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, {useState} from "react";
import HelpIcon from '@material-ui/icons/Help';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import Iframe from "react-iframe";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import history from "../../../Shared/History/History";
import Typography from "@material-ui/core/Typography";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

const AllTools = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsv);
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
                                <Grid item key={key}>
                                    <Grid>
                                        <Grid item onClick={() => handleClick(value.path)}>
                                            <img
                                                style={{
                                                    cursor: "pointer",
                                                    maxWidth: 60,
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