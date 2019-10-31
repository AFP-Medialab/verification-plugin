import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import LocalFile from "./LocalFile/LocalFile";
import CustomTile from "../../customTitle/customTitle";
import MySnackbar from "../../MySnackbar/MySnackbar";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Divider from '@material-ui/core/Divider';
import KeyFramesResults from "./Results/KeyFramesResults";
import {useKeyframeWrapper} from "./Hooks/useKeyframeWrapper";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },
    textFiledError: {
        MuiInput: {
            underline: {
                borderBottom: theme.palette.error.main,
            },
            '&:hover fieldset': {
                borderBottom: 'yellow',
            },
        },
    },
    grow: {
        flexGrow: 1,
    },
}));

const Keyframes = () => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const classes = useStyles();

    // state used to toggle localFile view
    const [localFile, setLocalFile] = useState(false);
    const toggleLocal = () => {
        setLocalFile(!localFile);
    };

    // State used to load images
    const [errors, setErrors] = useState(null);
    const [urlRef, setUrlRef] = React.useState(null);
    const [submittedUrl, setSubmittedUrl] = useState(undefined);
    const [data, error, isLoading, message] = useKeyframeWrapper(submittedUrl);

    const getErrorText = (error) => {
        if (keyword(error) !== undefined)
            return keyword(error);
        return keyword("keyframes_error_default")
    };

    const submitUrl = () => {
        setSubmittedUrl(urlRef.value);
    };

    useEffect(() => {
        if (error !== undefined)
            setErrors(error);
    }, [error]);

    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile> {keyword("keyframes_title")}  </CustomTile>
                <Box m={1}/>
                <Box display={localFile ? "none" : "block"}>
                    <Button variant="contained" color="primary" onClick={toggleLocal}>
                        {keyword("button_localfile")}
                    </Button>
                    <Box m={2}/>
                    <Divider/>
                    <TextField
                        inputRef={ref => setUrlRef(ref)}
                        id="standard-full-width"
                        label={keyword("keyframes_input")}
                        style={{margin: 8}}
                        placeholder="URL"
                        fullWidth
                        disabled={isLoading}
                    />
                    <Box m={2}/>
                    <Button variant="contained" color="primary" onClick={submitUrl} disabled={isLoading}>
                        {keyword("button_submit")}
                    </Button>
                    <Box m={1}/>
                    <LinearProgress hidden={!isLoading}/>
                    <Typography variant="body1" hidden={!isLoading}>
                        {message}
                    </Typography>
                </Box>
                <Box display={!localFile ? "none" : "block"}>
                    <Button variant="contained" color="primary" onClick={toggleLocal}>
                        {keyword("forensic_card_back")}
                    </Button>
                    <LocalFile/>
                </Box>
            </Paper>
            <div>
                {
                    data &&
                    <KeyFramesResults result={data}/>
                }
            </div>
            <div>
                {
                    errors && <MySnackbar variant="error" message={getErrorText(errors)} onClick={() => setErrors(null)}/>
                }
            </div>
        </div>
    );
};
export default React.memo(Keyframes);