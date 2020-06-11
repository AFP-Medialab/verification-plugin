import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";

import {Box, Button, ExpansionPanel, ExpansionPanelDetails, Paper, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import DuoIcon from '@material-ui/icons/Duo';
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import ImageIcon from '@material-ui/icons/Image';
import FaceIcon from "@material-ui/icons/Face";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import WarningIcon from '@material-ui/icons/Warning';

import AssistantResult from "./AssistantResult";
import AuthenticationCard from "../../Shared/Authentication/AuthenticationCard";
import CloseResult from "../../Shared/CloseResult/CloseResult";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import ImageGridList from "../../Shared/ImageGridList/ImageGridList";
import VideoGridList from "../../Shared/VideoGridList/VideoGridList";
import {setError} from "../../../redux/actions/errorActions";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import useTwitterApi from "../../Scrapers/Twitter/useTwitterApi";

import {
    cleanAssistantState, setImageVideoSelected,
    setInputUrl, setMediaLists, setProcessUrl, setProcessUrlActions,
    setRequireLogin, setUrlMode,
} from "../../../redux/actions/tools/assistantActions";
import {
    CONTENT_TYPE, DOMAIN, DOMAIN_PATTERNS, SCRAPER, SCRAPERS, TYPE_PATTERNS,
    matchPattern, selectCorrectActions,
} from "./AssistantRuleBook";
import history from "../../Shared/History/History";

const Assistant = () => {

    // styles, language, dispatch, scrapers
    const classes = useMyStyles();
    const dispatch = useDispatch();
    const twitterApi = useTwitterApi();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    //assistant state values
    const {url} = useParams();
    const urlMode = useSelector(state => state.assistant.urlMode);
    const imageVideoSelected = useSelector(state => state.assistant.imageVideoSelected);
    const requireLogIn = useSelector(state => state.assistant.requireLogIn);
    const inputUrl = useSelector(state => state.assistant.inputUrl);
    const processUrl = useSelector(state => state.assistant.processUrl);
    const imageList = useSelector(state => state.assistant.imageList);
    const videoList = useSelector(state => state.assistant.videoList);

    //other state values
    const [formInput, setFormInput] = useState(null);
    const userAuthenticated = useSelector(state => state.userSession.userAuthenticated)
    const twitterRequestLoading = useSelector(state => state.twitter.twitterRequestLoading);

    //refs
    const imageListRef = useRef([]);
    const videoListRef = useRef([]);

    const validateUrl = (userInput) => {
        //https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
        let urlRegex = "(http(s)?:\/\/.)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)";
        if (!userInput.match(urlRegex)) throw new Error(keyword("please_give_a_correct_link"))
    }

    // check the input url for data. create new image/video lists or add to existing
    const submitInputUrl = async (userInput) => {
        try {
            validateUrl(userInput);

            let updatedInput = await handleInternalScraping(userInput);
            let contentType = matchPattern(updatedInput, TYPE_PATTERNS);

            if (contentType == CONTENT_TYPE.IMAGE) {imageListRef.current.unshift(updatedInput);}
            else if (contentType == CONTENT_TYPE.VIDEO) {videoListRef.current.unshift(updatedInput);}

            dispatch(setMediaLists(imageListRef.current, videoListRef.current));
            dispatch(setInputUrl(userInput));
        }
        catch (error) {
            dispatch(setError(error.message));
        }
    }

    // if the user wants to upload a file, give them tools where this is an option
    const submitUpload = (contentType) => {
        let domain = DOMAIN.OWN;
        let actions = selectCorrectActions(domain, contentType, "");
        dispatch(setProcessUrlActions(contentType, actions));
        dispatch(setImageVideoSelected(true));
    }

    // select the correct media to process, then load actions possible
    const submitMediaToProcess = (url) => {
        dispatch(setProcessUrl(url));
        loadProcessUrlActions();
    }

    // load possible actions for selected media url
    const loadProcessUrlActions = () => {
        let contentType = matchPattern(processUrl, TYPE_PATTERNS);
        let domain = matchPattern(processUrl, DOMAIN_PATTERNS);
        let actions = selectCorrectActions(domain, contentType, processUrl);
        dispatch(setProcessUrlActions(contentType, actions))
    }

    // handle case of user giving a very specific type of twitter link
    const handleInternalScraping = async (userInput) => {
        let scraperToUse = SCRAPERS.find(scraper => ((userInput.match(scraper.patterns)) != null));
        if (scraperToUse != undefined && scraperToUse.key == SCRAPER.TWITTER) {
            if (scraperToUse.requireLogIn && !userAuthenticated) {
                dispatch(setRequireLogin(true));
            } else {
                dispatch(setRequireLogin(false));
                let scrapedMedia = await twitterApi.getTweet(userInput);
                if (scrapedMedia != null) {
                    if (scrapedMedia.imageUrl != null) return scrapedMedia.imageUrl;
                    else if (scrapedMedia.videoUrl != null) return scrapedMedia.videoUrl;
                }
            }
        }
        return userInput;
    }

    // check if the browser has any stored media lists. these are generated by popup.js.
    const checkForMediaLists = () => {
        let urlImageList = window.localStorage.getItem("imageList");
        let urlVideoList = window.localStorage.getItem("videoList");

        if (urlImageList == null && urlVideoList == null) {
            return;
        }

        if (urlImageList != "" || urlVideoList != "") {
            imageListRef.current = urlImageList != "" ? urlImageList.split(",") : [];
            videoListRef.current = urlVideoList != "" ? urlVideoList.split(",") : [];
        }
    }

    // clean assistant state
    const cleanAssistant = () => {
        //clean stored browser vars and refs
        window.localStorage.removeItem("imageList");
        window.localStorage.removeItem("videoList");
        imageListRef.current = [];
        videoListRef.current = [];

        //clean state and input
        dispatch(cleanAssistantState());
        setFormInput("");
    }

    // set the input to either the current url param, or whatever the assistant state value is
    // note: img/vid lists updated twice. due to stale closure(state values from prev render always used), refs set up
    useEffect(() => {
        if (url !== undefined) {
            checkForMediaLists();
            let uri = ( url!== null) ? decodeURIComponent(url) : undefined;
            dispatch(setUrlMode(true));
            submitInputUrl(uri);
            history.push("/app/assistant/");
        }
        else {setFormInput(inputUrl);}
    }, [url, inputUrl])

    useEffect(() => {
        if (processUrl!=null){loadProcessUrlActions();}
    }, [processUrl]);

    return (
        <Paper className = {classes.root}>
            <CustomTile text={keyword("assistant_title")}/>
            <Box m={3}/>

            <Grid container spacing={2}>
                <Grid item xs = {12} className={classes.newAssistantGrid}  hidden={urlMode!=null}>
                    <Typography component={"span"} variant={"h6"} >
                        <FaceIcon fontSize={"small"}/> {keyword("assistant_real_intro")}
                    </Typography>
                    <Box m={2}/>
                    <Button className={classes.button} variant = "contained" color="primary" onClick={() =>dispatch(setUrlMode(true))}>
                        {keyword("process_url") || ""}
                    </Button>
                    <Button className={classes.button} variant="contained" color="primary"  onClick={() => dispatch(setUrlMode(false))}>
                        {keyword("submit_own_file") || ""}
                    </Button>
                </Grid>


                <Grid item xs = {12} className={classes.newAssistantGrid}  hidden={urlMode==null || urlMode==false}>
                    <Box m={5}/>
                    <CloseResult hidden={urlMode==null || urlMode==false} onClick={() => cleanAssistant()}/>

                    <Typography component={"span"} variant={"h6"} >
                        <FaceIcon fontSize={"small"}/> {keyword("assistant_intro")}
                    </Typography>

                    <Box m={2}/>
                    <TextField
                        id="standard-full-width"
                        variant="outlined"
                        label={keyword("assistant_urlbox")}
                        style={{margin: 8}}
                        placeholder={""}
                        fullWidth
                        value={formInput || ""}
                        onChange={e => setFormInput(e.target.value)}
                    />

                    <Typography  component={"span"} hidden={!twitterRequestLoading}>
                        <LinearProgress color={"secondary"}/>
                        {keyword("extracting_tweet_media")}
                        <Box m={3}/>
                    </Typography>

                    <Box m={2}/>
                    <Button variant="contained" color="primary" align={"center"} onClick={() => {submitInputUrl(formInput)}}>
                        {keyword("button_submit") || ""}
                    </Button>
                </Grid>

                <Grid container spacing={2}>
                    {/* for demo purposes only!*/}
                    <Grid item xs = {12} className={classes.newAssistantGrid} hidden={requireLogIn!=true}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<WarningIcon className={classes.twitterIcon}/>}>
                                <Typography> Warnings present for URL </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                Our dedicated scrapers may be able to pick up more media.
                                Please log in and try again to ensure all media has been picked up.
                                <AuthenticationCard/>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>

                    <Grid item xs = {12} className={classes.newAssistantGrid} hidden={imageList.length == 0 && videoList.length==0}>
                        <Box m={5}/>
                        <Typography component={"span"} className={classes.twitterHeading}>
                            Input URL: {inputUrl}
                        </Typography>
                        <Box m={1}/>
                        <Typography> The media from this URL is shown below. Please select one to see which tools can be used. </Typography>
                    </Grid>


                    <Grid item xs = {6} className={classes.newAssistantGrid} hidden={imageList.length == 0}>
                        <Card>
                            <Typography component={"span"} className={classes.twitterHeading}>
                                <ImageIcon className={classes.twitterIcon}/> Images
                                <Divider variant={"middle"}/>
                            </Typography>
                            <Box m={2}/>
                            <ImageGridList list={imageList} height={60} cols={5} handleClick={(event)=>{submitMediaToProcess(event.target.src)}}/>
                        </Card>
                    </Grid>

                    <Grid item xs = {6} className={classes.newAssistantGrid} hidden={videoList.length == 0}>
                        <Card>
                            <Typography component={"span"} className={classes.twitterHeading}>
                                <DuoIcon className={classes.twitterIcon}/> Videos
                                <Divider variant={"middle"}/>
                            </Typography>
                            <Box m={2}/>
                            <VideoGridList list={videoList} handleClick={(vidLink)=>{submitMediaToProcess(vidLink)}}/>
                        </Card>
                    </Grid>

                    <Grid item xs={12} hidden={inputUrl==null||(inputUrl!=null && imageList.length!=0 || videoList.length!=0)}>
                        <Card><CardContent className={classes.assistantText}>
                            <Typography variant={"h6"} align={"left"}>
                                <FaceIcon size={"small"}/> {keyword("assistant_error")}
                            </Typography>
                        </CardContent></Card>
                    </Grid>

                </Grid>

                <Grid item xs = {12} className={classes.newAssistantGrid}  hidden={urlMode==null || urlMode==true}>
                    <Box m={5}/>
                    <CloseResult hidden={urlMode==null || urlMode==false} onClick={() => dispatch(cleanAssistantState())}/>
                    <Typography component={"span"} variant={"h6"} >
                        <FaceIcon fontSize={"small"}/> {keyword("upload_type_question")}
                    </Typography>
                    <Box m={2}/>
                    <Button className={classes.button} variant="contained" color="primary" onClick={()=>{submitUpload(CONTENT_TYPE.VIDEO)}}>
                        {keyword("upload_video") || ""}
                    </Button>
                    <Button className={classes.button} variant="contained" color="primary" onClick={()=>{submitUpload(CONTENT_TYPE.IMAGE)}}>
                        {keyword("upload_image") || ""}
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    {processUrl!=null || imageVideoSelected == true ?  <AssistantResult/> : null}
                </Grid>
            </Grid>
        </Paper>
    )

};

export default Assistant;