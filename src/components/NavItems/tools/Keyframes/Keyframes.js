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
import {KNOWN_LINKS} from "../../Assistant/AssistantRuleBook";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as AnalysisIcon } from '../../../NavBar/images/SVG/Video/Keyframes.svg';
import Grid from "@material-ui/core/Grid";

const Keyframes = (props) => {
    const {url} = useParams();

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Keyframes.tsv", tsv);
    const keyword2 = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsv);

    // state used to toggle localFile view
    const [localFile, setLocalFile] = useState(false);
    const toggleLocal = () => {
        setLocalFile(!localFile);
    };

    const resultUrl = useSelector(state => state.keyframes.url);
    const resultData = useSelector(state => state.keyframes.result);
    const isLoading = useSelector(state => state.keyframes.loading);
    const message = useSelector(state => state.keyframes.message);
    const video_id = useSelector(state => state.keyframes.video_id);

    // State used to load images
    const [input, setInput] = useState((resultUrl) ? resultUrl : "");
    const [submittedUrl, setSubmittedUrl] = useState(undefined);
    const [urlDetected, setUrlDetected] = useState(false)
    useKeyframeWrapper(submittedUrl);

    //human right
    const downloadShubshots = useSelector(state => state.humanRightsCheckBox)
    //download subshots results
    const downloadAction = () => {
        let downloadlink = "http://multimedia2.iti.gr/video_analysis/keyframes/" + video_id + "/Subshots";
        fetch(downloadlink).then(
            response => {
                response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
                    a.href = url;
                    a.click()});
            });

    }

    const submitUrl = () => {
        submissionEvent(input);
        setSubmittedUrl(input);
    };

    useEffect(()=>{
        if (urlDetected) {
            submitUrl()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlDetected])


    useEffect(() => {
        if (url) {
            if (url === KNOWN_LINKS.OWN) {
                setLocalFile(true)
            } else {
                const uri = decodeURIComponent(url);
                setInput(uri)
            }
        }
        setUrlDetected(true)
    }, [url]);

    useEffect(() => {
        setSubmittedUrl(undefined)
    }, [submittedUrl]);

    return (
        <div>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
            >

                <AnalysisIcon style={{ fill: "#51A5B2" }} />
                <Typography variant="h4" color={'primary'}>
                    {keyword2("navbar_keyframes")}
                </Typography>

            </Grid>

            <Box ml={1}>
                <Typography variant="body1">
                    {keyword2("navbar_keyframes_description")}
                </Typography>
            </Box>
            <Box m={3} />


            <Card>
                <CardHeader
                    title={
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center">

                            <span>Link of the video</span>

                        </Grid>
                    }
                    className={classes.headerUpladedImage}
                />

                <div className={classes.root2}>
                
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
                </div>
            </Card>
            <div>
                {
                    resultData &&
                    <KeyFramesResults result={resultData}/>
                }
            </div>
            <div>
                {
                    (resultData && downloadShubshots) ? 
                    <Button color="primary" onClick={downloadAction}>
                        {keyword("keyframes_download_subshots")}
                    </Button> : <div/>
                }            
            </div>
        </div>
    );
};
export default React.memo(Keyframes);