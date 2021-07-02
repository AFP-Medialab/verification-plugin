import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LocalFile from "./LocalFile/LocalFile";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Divider from '@material-ui/core/Divider';
import KeyFramesResults from "./Results/KeyFramesResults";
import {useKeyframeWrapper} from "./Hooks/useKeyframeWrapper";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import {useParams} from 'react-router-dom'
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Keyframes.tsv";
import tsvAllTools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import {KNOWN_LINKS} from "../../Assistant/AssistantRuleBook";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as KeframesIcon } from '../../../NavBar/images/SVG/Video/Keyframes.svg';
import Grid from "@material-ui/core/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import LinkIcon from '@material-ui/icons/Link';
import FileIcon from '@material-ui/icons/InsertDriveFile';

const Keyframes = () => {
    const {url} = useParams();

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Keyframes.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsvAllTools);

    // state used to toggle localFile view
    const [localFile, setLocalFile] = useState(false);

    /*
    const toggleLocal = () => {
        setLocalFile(!localFile);
    };
    */

    const resultUrl = useSelector(state => state.keyframes.url);
    const resultData = useSelector(state => state.keyframes.result);
    const isLoading = useSelector(state => state.keyframes.loading);
    const message = useSelector(state => state.keyframes.message);
    const video_id = useSelector(state => state.keyframes.video_id);

    // State used to load images
    const [input, setInput] = useState((resultUrl) ? resultUrl : "");
    const [submittedUrl, setSubmittedUrl] = useState(undefined);
    const [urlDetected, setUrlDetected] = useState(false)
    useKeyframeWrapper(submittedUrl, keyword);

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
            setUrlDetected(true)
        }
        
    }, [url]);

    useEffect(() => {
        setSubmittedUrl(undefined)
    }, [submittedUrl]);




    const [classButtonURL, setClassButtonURL] = useState(null);
    const [classButtonLocal, setClassButtonLocal] = useState(null);

    const [classIconURL, setClassIconURL] = useState(classes.bigButtonIconSelectted);
    const [classIconLocal, setClassIconLocal] = useState(classes.bigButtonIcon);

    const [showURL, setShowURL] = useState(true);
    const [showLocal, setShowLocal] = useState(false);

    if (showURL && !showLocal && classButtonURL !== classes.bigButtonDivSelectted && classButtonLocal !== classes.bigButtonDiv) {
        setClassButtonURL(classes.bigButtonDivSelectted);
        setClassButtonLocal(classes.bigButtonDiv);
    }


    const clickURL = () => {
        setClassButtonURL(classes.bigButtonDivSelectted);
        setClassIconURL(classes.bigButtonIconSelectted);

        setClassButtonLocal(classes.bigButtonDiv);
        setClassIconLocal(classes.bigButtonIcon);

        setShowURL(true);
        setShowLocal(false);

        setLocalFile(false);
    }

    const clickLocal = () => {
        setClassButtonURL(classes.bigButtonDiv);
        setClassIconURL(classes.bigButtonIcon);

        setClassButtonLocal(classes.bigButtonDivSelectted);
        setClassIconLocal(classes.bigButtonIconSelectted);

        setShowURL(false);
        setShowLocal(true);

        setLocalFile(true);
    }


    return (
        <div>
            <HeaderTool name={keywordAllTools("navbar_keyframes")} description={keywordAllTools("navbar_keyframes_description")} icon={<KeframesIcon style={{ fill: "#51A5B2" }} />}/>

            <Card>
                <CardHeader
                    title={keyword("cardheader_source")}
                    className={classes.headerUpladedImage}
                />

                <Box p={3}>


                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={6}>

                            <Box p={3} className={classButtonURL} onClick={clickURL}>
                                <Grid
                                    container
                                    direction="row"
                                    alignItems="center"

                                >
                                    <Grid item>
                                        <Box ml={1} mr={2}>
                                            <LinkIcon className={classIconURL} />
                                        </Box>

                                    </Grid>

                                    <Grid item>
                                        <Grid
                                            container
                                            direction="column"
                                            justify="flex-start"
                                            alignItems="flex-start"
                                        >
                                            <Grid item>
                                                <Typography variant="body1" style={{ fontWeight: 600 }}>{keyword("linkmode_title")}</Typography>
                                            </Grid>

                                            <Box mt={1} />

                                            <Grid item>
                                                <Typography variant="body1">{keyword("linkmode_description")}</Typography>
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Box>

                        </Grid>


                        <Grid item xs={6}>

                            <Box p={3} className={classButtonLocal} onClick={clickLocal}>
                                <Grid
                                    container
                                    direction="row"
                                    alignItems="center"

                                >
                                    <Grid item>
                                        <Box ml={1} mr={2}>
                                            <FileIcon className={classIconLocal} />
                                        </Box>

                                    </Grid>

                                    <Grid item>
                                        <Grid
                                            container
                                            direction="column"
                                            justify="flex-start"
                                            alignItems="flex-start"
                                        >
                                            <Grid item>
                                                <Typography variant="body1" style={{ fontWeight: 600 }}>{keyword("filemode_title")}</Typography>
                                            </Grid>

                                            <Box mt={1} />

                                            <Grid item>
                                                <Typography variant="body1">{keyword("filemode_description")}</Typography>
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Box>

                        </Grid>

                    </Grid>

                    <Box mt={4} mb={4}>
                        <Divider />
                    </Box>

                
                    <Box m={1}/>
                    <Box display={localFile ? "none" : "block"}>

                        <Grid container
                            direction="row"
                            spacing={3}
                            alignItems="center"
                        >

                            <Grid item xs>
                                <TextField
                                    id="standard-full-width"
                                    label={keyword("keyframes_input")}
                                    placeholder={keyword("keyframes_input_placeholder")}
                                    fullWidth
                                    disabled={isLoading}
                                    value={input}
                                    variant="outlined"
                                    onChange={e => setInput(e.target.value)}
                                />

                            </Grid>

                            <Grid item>
                                <Button variant="contained" color="primary" onClick={submitUrl} disabled={isLoading}>
                                    {keyword("button_submit")}
                                </Button>

                            </Grid>

                        </Grid>

                        
                        <Box m={3} hidden={!isLoading}/>
                        <LinearProgress hidden={!isLoading}/>
                        <Typography variant="body1" hidden={!isLoading}>
                            {message}
                        </Typography>
                    </Box>
                    <Box display={!localFile ? "none" : "block"}>
                        <LocalFile/>
                    </Box>
                </Box>
            </Card>

            <Box m={3} />
                {
                    resultData &&
                    <KeyFramesResults result={resultData}/>
                }
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