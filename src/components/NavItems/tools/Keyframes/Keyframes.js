import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LocalFile from "./LocalFile/LocalFile";
import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Divider from '@material-ui/core/Divider';
import KeyFramesResults from "./Results/KeyFramesResults";
import {useKeyframeWrapper} from "./Hooks/useKeyframeWrapper";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import {useParams} from 'react-router-dom'
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Keyframes.tsv";
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";

const Keyframes = (props) => {
    const {url} = useParams();

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Keyframes.tsv", tsv);

    // state used to toggle localFile view
    const [localFile, setLocalFile] = useState(false);
    const toggleLocal = () => {
        setLocalFile(!localFile);
    };

    const resultUrl = useSelector(state => state.keyframes.url);
    const resultData = useSelector(state => state.keyframes.result);
    const isLoading = useSelector(state => state.keyframes.loading);
    const message = useSelector(state => state.keyframes.message);

    // State used to load images
    const [input, setInput] = useState((resultUrl) ? resultUrl : "");
    const [submittedUrl, setSubmittedUrl] = useState(undefined);
    useKeyframeWrapper(submittedUrl);

    const submitUrl = () => {
        submissionEvent(input);
        setSubmittedUrl(input);
    };

    useEffect(() => {
        const uri = (url !== undefined) ? decodeURIComponent(url) : undefined;
        if (uri !== undefined) {
            setInput(uri);
            setSubmittedUrl(uri);
        }
    }, [url]);

    useEffect(() => {
        setSubmittedUrl(undefined)
    }, [submittedUrl]);

    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile text={keyword("keyframes_title")}/>
                <Box m={1}/>
                <Box display={localFile ? "none" : "block"}>
                    <Button variant="contained" color="primary" onClick={toggleLocal}>
                        {keyword("button_localfile")}
                    </Button>
                    <Box m={2}/>
                    <Divider/>
                    <TextField
                        id="standard-full-width"
                        label={keyword("keyframes_input")}
                        style={{margin: 8}}
                        placeholder="URL"
                        fullWidth
                        disabled={isLoading}
                        value={input}
                        onChange={e => setInput(e.target.value)}
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
                    resultData &&
                    <KeyFramesResults result={resultData}/>
                }
            </div>
        </div>
    );
};
export default React.memo(Keyframes);