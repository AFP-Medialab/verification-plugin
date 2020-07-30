import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";

import {Box, Button,Paper, TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import FaceIcon from "@material-ui/icons/Face";
import Typography from "@material-ui/core/Typography";

import AssistantLinkResult from "./AssistantLinkResult";
import AssistantResult from "./AssistantResult";
import AssistantTextResult from "./AssistantTextResult";
import CloseResult from "../../Shared/CloseResult/CloseResult";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import history from "../../Shared/History/History";
import {setError} from "../../../redux/actions/errorActions";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import useAssistantApi from "./useAssistantApi";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";

import {
    cleanAssistantState, setAssistantLoading, setImageVideoSelected, setInputSC,
    setInputUrl, setLinkListSC, setProcessUrl, setProcessUrlActions, setScrapedData,
    setUrlMode,
} from "../../../redux/actions/tools/assistantActions";
import {
    CONTENT_TYPE, TYPE_PATTERNS,
    matchPattern, selectCorrectActions, KNOWN_LINK_PATTERNS, KNOWN_LINKS,
} from "./AssistantRuleBook";
import LinearProgress from "@material-ui/core/LinearProgress";


const Assistant = () => {

    // styles, language, dispatch, scrapers
    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    //assistant state values
    const {url} = useParams();
    const urlMode = useSelector(state => state.assistant.urlMode);
    const imageVideoSelected = useSelector(state => state.assistant.imageVideoSelected);

    const loading = useSelector(state => state.assistant.loading)
    const inputUrl = useSelector(state => state.assistant.inputUrl);
    const inputUrlSC = useSelector(state => state.assistant.inputUrlSc);

    const imageList = useSelector(state => state.assistant.imageList);
    const videoList = useSelector(state => state.assistant.videoList);
    const text = useSelector(state => state.assistant.urlText)
    const linkList = useSelector(state => state.assistant.linkList)
    const linkListSC = useSelector(state => state.assistant.linkListSC);


    //other state values
    const [formInput, setFormInput] = useState(null);

    //refs
    const imageListRef = useRef(imageList);
    const videoListRef = useRef(videoList);
    const textRef = useRef(text)
    const linkListRef = useRef(linkList)

    // apis
    const assistantApi = useAssistantApi()


    //Check the input url for data. Figure out which url type and set required image/video lists
    const submitInputUrl = async (userInput) => {
        try {
            dispatch(setAssistantLoading(true))
            // get domain and content type
            let urlType = matchPattern(userInput, KNOWN_LINK_PATTERNS);
            let contentType = matchPattern(userInput, TYPE_PATTERNS);

            // decide whether or not to scrape page based on domain and content type
            let scrapeResult = await decideWhetherToScrape(urlType, contentType, userInput);
            setAssistantResults(urlType, contentType, userInput, scrapeResult);

            dispatch(setScrapedData(textRef.current, linkListRef.current, imageListRef.current, videoListRef.current))
            dispatch(setInputUrl(userInput));

            // if only one image/video exists, set this to be processed without an intermediate step
            handleOneMediaListResult();
            dispatch(setAssistantLoading(false))
        }
        catch (error) {
            dispatch(setError(error.message));
        }
    }


    // if there is only one image/video, set this to be processed
    const handleOneMediaListResult = () => {
        if (imageListRef.current.length === 1 && videoListRef.current.length === 0) {
            dispatch(setProcessUrl(imageListRef.current[0]))}
        else if(videoListRef.current.length === 1 && imageListRef.current.length === 0){
            dispatch(setProcessUrl(videoListRef.current[0]))}
    }


    const decideWhetherToScrape = async (urlType, contentType, userInput) => {
        let scrapeResult = null;
        switch (urlType) {
            case KNOWN_LINKS.YOUTUBE:
            case KNOWN_LINKS.LIVELEAK:
            case KNOWN_LINKS.VIMEO:
            case KNOWN_LINKS.DAILYMOTION:
                return scrapeResult;
            case KNOWN_LINKS.TIKTOK:
            case KNOWN_LINKS.INSTAGRAM:
            case KNOWN_LINKS.FACEBOOK:
            case KNOWN_LINKS.TWITTER:
                scrapeResult = await assistantApi.callAssistantScraper(urlType, userInput)
                break;
            case KNOWN_LINKS.MISC:
                if (contentType === null) {
                    scrapeResult = await assistantApi.callAssistantScraper(KNOWN_LINKS.MISC, userInput)
                }
                return scrapeResult
            default:
                throw new Error(keyword("please_give_a_correct_link"));
        }
        return scrapeResult
    }

    // handle specific urls in specific ways to populate image, video and link lists, and text
    const setAssistantResults = (urlType, contentType, userInput, scrapeResult) => {
        switch(urlType) {
            case KNOWN_LINKS.YOUTUBE:
            case KNOWN_LINKS.LIVELEAK:
            case KNOWN_LINKS.VIMEO:
            case KNOWN_LINKS.DAILYMOTION:
                videoListRef.current = [userInput];
                break;
            case KNOWN_LINKS.TIKTOK:
                videoListRef.current = [scrapeResult.videos]
                linkListRef.current = scrapeResult.links
                break;
            case KNOWN_LINKS.INSTAGRAM:
                if (scrapeResult.videos.length === 1) {videoListRef.current = [scrapeResult.videos]}
                else {imageListRef.current = [scrapeResult.images[1]]}
                textRef.current = scrapeResult.text
                linkListRef.current = scrapeResult.links
                break;
            case KNOWN_LINKS.FACEBOOK:
                if (scrapeResult.videos.length === 0) {
                    imageListRef.current = scrapeResult.images
                    imageListRef.current = imageListRef.current.filter(imageUrl => imageUrl.includes("//scontent") &&
                            !(imageUrl.includes("/cp0/")));
                }
                else {videoListRef.current = [userInput];}
                linkListRef.current = scrapeResult.links
                textRef.current = scrapeResult.text
                break;
            case KNOWN_LINKS.TWITTER:
                if (scrapeResult.videos === 0) {imageListRef.current = scrapeResult.images}
                else {videoListRef.current = [userInput]}
                textRef.current = scrapeResult.text
                linkListRef.current = scrapeResult.links
                break;
            case KNOWN_LINKS.MISC:
                if(contentType!==null) {
                    if (contentType === CONTENT_TYPE.IMAGE) imageListRef.current = [userInput];
                    else if (contentType === CONTENT_TYPE.VIDEO) videoListRef.current = [userInput];
                }
                else{
                    imageListRef.current = scrapeResult.images
                    videoListRef.current = scrapeResult.videos
                    textRef.current = scrapeResult.text
                    linkListRef.current = scrapeResult.links
                }
                break;
            default:
                throw new Error(keyword("please_give_a_correct_link"));
        }
    }


    // if the user wants to upload a file, give them tools where this is an option
    const submitUpload = (contentType) => {
        let known_link = KNOWN_LINKS.OWN;
        let actions = selectCorrectActions(contentType, known_link, known_link, "");
        dispatch(setProcessUrlActions(contentType, actions));
        dispatch(setImageVideoSelected(true));
    }

    // clean assistant state
    const cleanAssistant = () => {
        imageListRef.current = [];
        videoListRef.current = [];
        textRef.current = null;
        linkListRef.current = []

        //clean state and input
        dispatch(cleanAssistantState());
        setFormInput("");
    }

    // is a url is present in the plugin url(as a param), set it to input and process results
    useEffect(() => {
        if (url !== undefined) {
            let uri = ( url!== null) ? decodeURIComponent(url) : undefined;
            dispatch(setUrlMode(true));
            submitInputUrl(uri);
            history.push("/app/assistant/");
        }
    }, [url])

    // if the user types anything into the input box, set it as the new form input
    useEffect(() => {
        setFormInput(inputUrl)
    },[inputUrl])



    return (
        <Paper className = {classes.root}>
            <CustomTile text={keyword("assistant_title")}/>
            <Box m={3}/>

            <Grid container spacing={2}>
                <Grid item xs = {12} className={classes.newAssistantGrid}  hidden={urlMode!==null}>
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


                <Grid item xs = {12} className={classes.newAssistantGrid}  hidden={urlMode===null || urlMode===false}>
                    <Box m={5}/>
                    <CloseResult hidden={urlMode===null || urlMode===false} onClick={() => cleanAssistant()}/>

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

                    <Box m={2}/>
                    <Button variant="contained" color="primary"
                            align={"center"} onClick={() => {submitInputUrl(formInput)}}>
                        {keyword("button_submit") || ""}
                    </Button>
                </Grid>
                {loading ? <LinearProgress variant={"indeterminate"}/> : null}

                <Box m ={3}/>
                {inputUrl !== null ? <AssistantLinkResult linkList={[inputUrl]}
                                                          existingResult={inputUrlSC}
                                                          title={"Source Credibility"}
                                                          byline={"The input domain has been found as part of a credibility check"}
                                                          storageMethod={(result)=>setInputSC(result)}/> : null}
                <Box m={2}/>
                {text !== null ?  <AssistantTextResult/> : null}
                <Box m={2}/>
                {linkList.length !== 0 ? <AssistantLinkResult linkList={linkList}
                                                              existingResult={linkListSC}
                                                              title={"Link Explorer"}
                                                              byline={"The following URLs have been extracted from the page, and their domains have been checked for credibility"}
                                                              storageMethod={(result)=>setLinkListSC(result)}/> : null}
                <Box m={2}/>


                <Grid item xs = {12} className={classes.newAssistantGrid}  hidden={urlMode===null || urlMode===true}>
                    <Box m={5}/>
                    <CloseResult hidden={urlMode===null || urlMode===false} onClick={() => dispatch(cleanAssistantState())}/>
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
                    {imageList.length>0 || videoList.length>0 || imageVideoSelected === true ?  <AssistantResult/> : null}
                </Grid>
            </Grid>
        </Paper>
    )

};

export default Assistant;