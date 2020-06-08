import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";

import {Box, Button, Paper, TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import FaceIcon from "@material-ui/icons/Face";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import AssistantResult from "./AssistantResult";
import AuthenticationCard from "../../Shared/Authentication/AuthenticationCard";
import Card from "@material-ui/core/Card";
import CloseResult from "../../Shared/CloseResult/CloseResult";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import Divider from "@material-ui/core/Divider";
import ImageGridList from "../../Shared/ImageGridList/ImageGridList";
import InfoIcon from "@material-ui/icons/Info";
import VideoGridList from "../../Shared/VideoGridList/VideoGridList";
import {setError} from "../../../redux/actions/errorActions";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import useTwitterApi from "../../Scrapers/Twitter/useTwitterApi";

import {
    cleanAssistantState, setImageList, setImageVideoSelected,
    setInputUrl,
    setMediaLists,
    setProcessUrl,
    setProcessUrlActions,
    setRequireLogin,
    setUrlMode, setVideoList
}
    from "../../../redux/actions/tools/assistantActions";
import {
    CONTENT_TYPE,
    DOMAIN,
    DOMAIN_PATTERNS,
    matchPattern,
    SCRAPER,
    SCRAPERS,
    selectCorrectActions,
    TYPE_PATTERNS
}
    from "./AssistantRuleBook";
import history from "../../Shared/History/History";

const Assistant = () => {

    // styles, language, dispatch, scrapers
    const classes = useMyStyles();
    const dispatch = useDispatch();
    const twitterApi = useTwitterApi();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    //assistant state values
    const {url} = useParams();
    const urlMode = useSelector(state=>state.assistant.urlMode);
    const imageVideoSelected = useSelector(state=>state.assistant.imageVideoSelected);
    const requireLogIn = useSelector(state=>state.assistant.requireLogIn);
    const inputUrl = useSelector(state=>state.assistant.inputUrl);
    const processUrl = useSelector(state=>state.assistant.processUrl);
    const imageList = useSelector(state=>state.assistant.imageList);
    const videoList = useSelector(state=>state.assistant.videoList);

    //other state values
    const [formInput, setFormInput] = useState(null);
    const userAuthenticated = useSelector(state => state.userSession.userAuthenticated)
    const twitterRequestLoading = useSelector(state => state.twitter.twitterRequestLoading);


    const validateUrl = (userInput) => {
        //https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
        let urlRegex = "(http(s)?:\/\/.)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)";
        if (!userInput.match(urlRegex)) throw new Error(keyword("please_give_a_correct_link"))
    }

    // given a direct user input, scrape or set the correct image/video list
    const submitInputUrl = async (userInput) => {
        try {
            validateUrl(userInput);
            let updatedInput = await handleScraping(userInput);
            let contentType = matchPattern(updatedInput, TYPE_PATTERNS);

            if(contentType == CONTENT_TYPE.IMAGE){dispatch(setImageList([updatedInput]))}
            else if(contentType == CONTENT_TYPE.VIDEO){dispatch(setVideoList([updatedInput]))}
            else {dispatch(setProcessUrl(""))}
            dispatch(setInputUrl(userInput));
        }
        catch(error){
            dispatch(setError(error.message));
        }
    }

    // if the user wants to upload a file, give them tools where this is an option
    const submitUpload = (contentType) => {
        //todo: fix video bug
        let domain = DOMAIN.OWN;
        let actions = selectCorrectActions(domain, contentType, "");
        dispatch(setProcessUrlActions(contentType, actions));
        dispatch(setImageVideoSelected(true));
    }

    // select the correct media to process, then load actions possible
    const submitMediaToProcess = (url) =>{
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
    const handleScraping = async (userInput) => {
        let scraperToUse = SCRAPERS.find(scraper=>((userInput.match(scraper.patterns))!=null));
        if(scraperToUse != undefined && scraperToUse.key == SCRAPER.TWITTER) {
            if (scraperToUse.requireLogIn && !userAuthenticated) {
                dispatch(setRequireLogin(true));
                throw new Error("twitter_error_login");
            }
            else {
                dispatch(setRequireLogin(false));
                let scrapedMedia = await twitterApi.getTweet(userInput);
                if(scrapedMedia != null) {
                    if (scrapedMedia.imageUrl!=null) return scrapedMedia.imageUrl;
                    else if (scrapedMedia.videoUrl!=null) return scrapedMedia.videoUrl;
                    else {throw new Error("twitter_error_media")}
                }
            }
        }
        return userInput;
    }

    /* check for image/video lists which may have come from popup.js
    *  todo: rethink confusing logic (if null vals, this was from context menu. if non null vals, these were scraper.)
    *  probably better to stop mixing content menu and scraper button menu use of url altogether
    * */
    const checkForMediaLists = () => {
        let urlImageList = window.localStorage.getItem("imageList");
        let urlVideoList = window.localStorage.getItem("videoList");

        if(urlImageList == null && urlVideoList == null) {
            return;
        }

        if (urlImageList != "" || urlVideoList != ""){
            urlImageList = urlImageList!="" ? urlImageList.split(",") : [];
            urlVideoList = urlVideoList!="" ? urlVideoList.split(",") : [];
            dispatch(setMediaLists(urlImageList, urlVideoList));
        }
        else {
            dispatch(setProcessUrl(""));
        }
    }

    // clean assistant state
    const cleanAssistant = () => {
        window.localStorage.removeItem("imageList");
        window.localStorage.removeItem("videoList");
        dispatch(cleanAssistantState());
        setFormInput("");
    }

    // set the input to either the current url param, or whatever the assistant state value is
    useEffect(() => {
        if (url !== undefined) {
            checkForMediaLists();
            let uri = ( url!== null) ? decodeURIComponent(url) : undefined;
            dispatch(setUrlMode(true));
            dispatch(setInputUrl(uri));
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
            {requireLogIn==true ? <AuthenticationCard/> : null}


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
                        value={formInput}
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

                <Grid container ={2}>
                    <Grid item xs = {12} className={classes.newAssistantGrid} hidden={imageList.length == 0 && videoList.length==0}>
                        <Box m={2}/>
                        <Typography component={"span"} className={classes.twitterHeading}>
                            Input URL: {inputUrl}
                        </Typography>
                        <Box m={1}/>
                        <Typography> The media from this URL is shown below. Please select one to see which tools can be used. </Typography>
                        <Box m={3}/>
                    </Grid>

                    <Grid item xs = {6} className={classes.newAssistantGrid} hidden={imageList.length == 0}>
                        <Card>
                            <Typography component={"span"} className={classes.twitterHeading}>
                                <InfoIcon className={classes.twitterIcon}/> Images
                                <Divider variant={"middle"}/>
                            </Typography>
                            <Box m={2}/>
                            <ImageGridList list={imageList} height={60} cols={5} handleClick={(event)=>{submitMediaToProcess(event.target.src)}}/>
                        </Card>
                    </Grid>

                    <Grid item xs = {6} className={classes.newAssistantGrid} hidden={videoList.length == 0}>
                        <Card>
                            <Typography component={"span"} className={classes.twitterHeading}>
                                <InfoIcon className={classes.twitterIcon}/> Videos
                                <Divider variant={"middle"}/>
                            </Typography>
                            <Box m={2}/>
                            <VideoGridList list={videoList} handleClick={(vidLink)=>{submitMediaToProcess(vidLink)}}/>
                        </Card>
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