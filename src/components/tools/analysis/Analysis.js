import React from "react";
import {useSelector} from "react-redux";
import {Paper} from "@material-ui/core";

import makeStyles from "@material-ui/core/styles/makeStyles";
import CustomTile from "../../customTitle/customTitle"
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import videoUrl from "../../tutorial/images/VideoURLmenu.png";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import {green} from "@material-ui/core/colors";
import clsx from "clsx";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },
    textFiledError: {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: theme.palette.error.main,
            },
            '&:hover fieldset': {
                borderColor: 'yellow',
            },
        },
    },
    textFiledChanged: {},
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

const Analysis = () => {
        const dictionary = useSelector(state => state.dictionary);
        const lang = useSelector(state => state.language);
        const keyword = (key) => {
            return (dictionary !== null) ? dictionary[lang][key] : "";
        };

        const classes = useStyles();

        const [reprocess, setReprocess] = React.useState(false);
        const reprocessToggle = () => {
            setReprocess(!reprocess);
        };

        const [url, setUrl] = React.useState(true);
        const urlChange = (val) => {
            setUrl(val)
        };
        const timer = React.useRef();

        const submitForm = () => {
            if (!loading) {
                setSuccess(false);
                setLoading(true);

                //encode video to avoid & problem arguments
                let video_url = url.replace("&", "%26");
                // detect if its a facebook video
                let is_facebook_url = video_url.split("facebook.com").length === 2;
                // construct the url for request
                let analysis_url = "https://caa.iti.gr/verify_videoV3?url=" + video_url + "&twtimeline=0";
                if (reprocess)
                    analysis_url += "&reprocess=1";

                timer.current = setTimeout(() => {
                    setSuccess(true);
                    setLoading(false);
                }, 2000);
            }
        };

        const [loading, setLoading] = React.useState(false);
        const [success, setSuccess] = React.useState(false);


        return (
            <div>
                <Paper className={classes.root}>
                    <CustomTile> {keyword("api_title")}  </CustomTile>
                    <br/>
                    <TextField
                        error={!url}
                        id="standard-full-width"
                        label={keyword("api_input")}
                        style={{margin: 8}}
                        placeholder="URL"
                        helperText=""
                        fullWidth
                        onChange={() => urlChange(true)}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={reprocess}
                                onChange={reprocessToggle}
                                value="checkedBox"
                                color="primary"
                            />
                        }
                        label={keyword("api_repro")}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        onClick={submitForm}
                    >
                        {keyword("button_submit")}
                    </Button>
                    {loading && <LinearProgress/>}

                </Paper>
                <div>
                    {
                        success && <Paper className={classes.root}>
                            <span>hello</span>
                        </Paper>
                    }
                </div>
            </div>);
};
export default Analysis;