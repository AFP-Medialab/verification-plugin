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
import CloseResult from "../../Shared/CloseResult/CloseResult";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import {setError} from "../../../redux/actions/errorActions";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import useTwitterApi from "../../Scrapers/Twitter/useTwitterApi";

import {cleanAssistantState, setProcessUrlActions, setRequireLogin, setUrlMode}
    from "../../../redux/actions/tools/assistantActions";
import {ASSISTANT_ACTIONS, CONTENT_TYPE, DOMAIN, DOMAIN_PATTERNS, SCRAPER, SCRAPERS, TYPE_PATTERNS}
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
    const requireLogIn = useSelector(state=>state.assistant.requireLogIn);
    const inputUrl = useSelector(state=>state.assistant.inputUrl);
    const processUrl = useSelector(state=>state.assistant.processUrl);
    const imageList = useSelector(state=>state.assistant.imageList);
    const videoList = useSelector(state=>state.assistant.videoList);
    const processUrlActions = useSelector(state=>state.assistant.processUrlActions)

    //other state values
    const [formInput, setFormInput] = useState(null);
    const userAuthenticated = useSelector(state => state.userSession.userAuthenticated)
    const twitterRequestLoading = useSelector(state => state.twitter.twitterRequestLoading);

    const submitUrl = async (userInput) => {
        try {
            let updatedInput = await checkForScrapers(userInput);
            let contentType = matchPattern(updatedInput, TYPE_PATTERNS);
            let domain = matchPattern(updatedInput, DOMAIN_PATTERNS);

            let actions = loadActions(domain, contentType, updatedInput);
            dispatch(setProcessUrlActions(userInput, updatedInput, contentType, actions))
        }
        catch(error){
            dispatch(setError(error.message));
        }
    }

    const submitUpload = (contentType) => {
        let domain = DOMAIN.OWN;
        let inputUrl = "";
        let updatedInput = "";
        let actions = loadActions(domain, contentType, inputUrl);
        dispatch(setProcessUrlActions(inputUrl, updatedInput, contentType, actions))
    }

    const matchPattern = (toMatch, matchObject) => {
        // find the record where from the regex patterns in said record, one of them matches "toMatch"
        let match = matchObject.find(record=>record.patterns.some((rgxpattern)=>toMatch.match(rgxpattern)!=null));
        return match !=null ? match.key : null;
    }

    const loadActions = (domain, contentType, url) => {
        let possibleActions =
        ASSISTANT_ACTIONS.filter(action=>
            action.domains.includes(domain) &&
            (action.ctypes.includes(contentType) || action.ctypes==CONTENT_TYPE.ALL) &&
            (action.type_restriction.size==0 || url.match(action.type_restriction[0])));

        return possibleActions;
    }

    const checkForScrapers = async (userInput) => {
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

    const cleanAssistant = () => {
        history.push("/app/assistant/");
        dispatch(cleanAssistantState());
        setFormInput("");
    }

    // set the input to either the current url param, or whatever the assistant state value is
    useEffect(() => {
        if (url !== undefined) {
            dispatch(setUrlMode(true));
            let uri = ( url!== null) ? decodeURIComponent(url) : undefined;
            setFormInput(uri);
            submitUrl(uri);
        }
        else {
            setFormInput(inputUrl);
        }
    }, [url, inputUrl])

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
                    <Button variant="contained" color="primary" align={"center"} onClick={() => {submitUrl(formInput)}}>
                        {keyword("button_submit") || ""}
                    </Button>
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
                    {processUrl!=null ?  <AssistantResult/> : null}
                </Grid>
            </Grid>
        </Paper>
    )

};

export default Assistant;