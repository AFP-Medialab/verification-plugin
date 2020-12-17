import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {Box, Button, Paper, TextField} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import LinearProgress from "@material-ui/core/LinearProgress";
import {setError} from "../../../redux/actions/errorActions";
import Switch from "@material-ui/core/Switch";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import Typography from "@material-ui/core/Typography";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";

import AssistantWarnings from "./AssistantScrapeResults/AssistantWarnings";
import AssistantLinkResult from "./AssistantScrapeResults/AssistantLinkResult";
import HelpDialog from "../../Shared/HelpDialog/HelpDialog";
import AssistantMediaResult from "./AssistantScrapeResults/AssistantMediaResult";
import AssistantTextResult from "./AssistantScrapeResults/AssistantTextResult";
import history from "../../Shared/History/History";

import useAssistantApi from "./AssistantApiHandlers/useAssistantApi";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";

import {
    cleanAssistantState,
    setAssistantLoading,
    setImageVideoSelected,
    setInputUrl,
    setProcessUrlActions,
    setScrapedData,
    setUrlMode,
} from "../../../redux/actions/tools/assistantActions";

import {
    CONTENT_TYPE,
    KNOWN_LINK_PATTERNS,
    KNOWN_LINKS,
    matchPattern,
    selectCorrectActions,
    TYPE_PATTERNS,
} from "./AssistantRuleBook";
import AssistantNEResult from "./AssistantCheckResults/AssistantNEResult";
import AssistantCheckStatus from "./AssistantCheckResults/AssistantCheckStatus";

const Assistant = () => {

    // styles, language, dispatch, params
    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const {url} = useParams();

    //form states
    const urlMode = useSelector(state => state.assistant.urlMode);
    const imageVideoSelected = useSelector(state => state.assistant.imageVideoSelected);
    const loading = useSelector(state => state.assistant.loading)
    const inputUrl = useSelector(state => state.assistant.inputUrl);

    //url states
    const imageList = useSelector(state => state.assistant.imageList);
    const videoList = useSelector(state => state.assistant.videoList);
    const text = useSelector(state => state.assistant.urlText)
    const textLang = useSelector(state => state.assistant.textLang)
    const linkList = useSelector(state => state.assistant.linkList)

    // media processing states
    const ocrResult = useSelector(state => state.assistant.ocrResult);
    const neResult = useSelector(state => state.assistant.neResultCategory);

    //url warning states
    const hpResult = useSelector(state => state.assistant.hpResult)
    const inputUrlSourceCred = useSelector(state => state.assistant.inputUrlSourceCredibility)
    const dbkfTextMatch = useSelector(state => state.assistant.dbkfTextMatch);
    const dbkfImageResult = useSelector(state => state.assistant.dbkfImageMatch);
    const dbkfVideoMatch = useSelector(state => state.assistant.dbkfVideoMatch);

    // url fail states
    const hpFailState = useSelector(state => state.assistant.hpFail)
    const scFailState = useSelector(state => state.assistant.inputSCFail)
    const dbkfTextFailState = useSelector(state => state.assistant.dbkfTextMatchFail)
    const dbkfMediaFailState = useSelector(state => state.assistant.dbkfMediaMatchFail)
    const neFailState = useSelector(state => state.assistant.neFail)

    //other state values
    const [formInput, setFormInput] = useState(inputUrl);

    //refs
    const imageListRef = useRef(imageList);
    const videoListRef = useRef(videoList);
    const textRef = useRef(text)
    const linkListRef = useRef(linkList)
    const textLangRef = useRef(textLang)

    // apis
    const assistantApi = useAssistantApi()


    //Check the input url for data. Figure out which url type and set required image/video lists
    const submitInputUrl = async (userInput) => {
        try {
            dispatch(cleanAssistantState());
            dispatch(setAssistantLoading(true))

            // get domain and content type
            let urlType = matchPattern(userInput, KNOWN_LINK_PATTERNS)
            let contentType = matchPattern(userInput, TYPE_PATTERNS)

            // decide whether or not to scrape page based on domain and content type, scrape, filter results
            let scrapeResult = await decideWhetherToScrape(urlType, contentType, userInput)
            setAssistantResults(urlType, contentType, userInput, scrapeResult)

            dispatch(setInputUrl(userInput));
            dispatch(setScrapedData(textRef.current, textLangRef.current, linkListRef.current, imageListRef.current, videoListRef.current))


            dispatch(setAssistantLoading(false))
        } catch (error) {
            dispatch(setAssistantLoading(false))
            dispatch(setError(error.message));
        }
    }


    // remove urls from main text
    const removeUrlsFromText = (text) => {
        if (text !== null) {
            let urlRegex = new RegExp("(http(s)?://.)?(www\\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_+.~#?&//=]*)", "g");
            return text.replace(urlRegex, "")
        }
        return text
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
                    scrapeResult = await assistantApi.callAssistantScraper(urlType, userInput)
                }
                return scrapeResult
            default:
                throw new Error(keyword("please_give_a_correct_link"));
        }
        return scrapeResult
    }

    // handle specific urls in specific ways to populate image, video and link lists, and text
    const setAssistantResults = (urlType, contentType, userInput, scrapeResult) => {
        switch (urlType) {
            case KNOWN_LINKS.YOUTUBE:
            case KNOWN_LINKS.LIVELEAK:
            case KNOWN_LINKS.VIMEO:
            case KNOWN_LINKS.DAILYMOTION:
                videoListRef.current = [userInput];
                break;
            case KNOWN_LINKS.TIKTOK:
                textRef.current = scrapeResult.text
                videoListRef.current = [scrapeResult.videos]
                textLangRef.current = scrapeResult.lang
                linkListRef.current = scrapeResult.links
                break;
            case KNOWN_LINKS.INSTAGRAM:
                if (scrapeResult.videos.length === 1) {
                    videoListRef.current = [scrapeResult.videos[0]]
                } else {
                    imageListRef.current = [scrapeResult.images[1]]
                }
                textRef.current = scrapeResult.text
                textLangRef.current = scrapeResult.lang
                linkListRef.current = scrapeResult.links
                break;
            case KNOWN_LINKS.FACEBOOK:
                if (scrapeResult.videos.length === 0) {
                    imageListRef.current = scrapeResult.images
                    imageListRef.current = imageListRef.current.filter(imageUrl => imageUrl.includes("//scontent") &&
                        !(imageUrl.includes("/cp0/")));
                } else {
                    videoListRef.current = scrapeResult.videos;
                }
                linkListRef.current = scrapeResult.links
                textRef.current = scrapeResult.text
                textLangRef.current = scrapeResult.lang
                break;
            case KNOWN_LINKS.TWITTER:
                if (scrapeResult.images.length > 0) {
                    imageListRef.current = scrapeResult.images
                }
                if (scrapeResult.videos.length > 0) {
                    videoListRef.current = scrapeResult.videos
                }
                textRef.current = scrapeResult.text
                linkListRef.current = scrapeResult.links
                textLangRef.current = scrapeResult.lang
                break;
            case KNOWN_LINKS.MISC:
                if (contentType !== null) {
                    if (contentType === CONTENT_TYPE.IMAGE) imageListRef.current = [userInput];
                    else if (contentType === CONTENT_TYPE.VIDEO) videoListRef.current = [userInput];
                } else {
                    imageListRef.current = scrapeResult.images
                    videoListRef.current = scrapeResult.videos
                    textRef.current = scrapeResult.text
                    textLangRef.current = scrapeResult.lang
                    linkListRef.current = scrapeResult.links
                }
                break;
            default:
                throw new Error(keyword("please_give_a_correct_link"));
        }
        textRef.current = removeUrlsFromText(textRef.current);
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

    // if a url is present in the plugin url(as a param), set it to input and process results
    useEffect(() => {
        if (url !== undefined) {
            let uri = (url !== null) ? decodeURIComponent(url) : undefined;
            dispatch(setUrlMode(true));
            setFormInput(uri)
            submitInputUrl(uri);
            history.push("/app/assistant/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])


    return (
        <div>
            <Paper className={classes.root}>
                <Grid item xs={12}/>
                    <CustomTile text={keyword("assistant_title")}/>
                <Grid/>
                <Box m={5}/>

                <Grid item xs={12} className={classes.assistantGrid} hidden={urlMode === null || urlMode === false}>
                    <Box m={3}/>

                    <Grid container>
                        <Grid item xs={10}>
                            <Typography style={{display: 'flex', alignItems: 'center'}} component={"span"}
                                        variant={"h6"}>
                                <Box p={1}/>{keyword("enter_url")}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} align={"right"}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={urlMode}
                                        onChange={() => {
                                            cleanAssistant()
                                            dispatch(setUrlMode(false))
                                        }}
                                    />}
                                label={keyword("mode_label")}
                            />
                        </Grid>
                    </Grid>

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
                        InputProps={{
                            endAdornment:
                                inputUrl ?
                                    <InputAdornment>
                                        <IconButton
                                            color={"secondary"}
                                            fontSize={"default"}
                                            onClick={() => cleanAssistant()}>
                                            <CancelIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                     :
                                    <InputAdornment variant={"filled"}>
                                        <IconButton color={"secondary"} onClick={() => {
                                            submitInputUrl(formInput)
                                        }}>
                                            <ArrowForwardIcon/>
                                        </IconButton>
                                    </InputAdornment>

                        }}
                    />
                    <Box m={3}/>
                    <LinearProgress hidden={!loading}/>

                    <Grid item xs={12}>
                        {dbkfTextMatch  || dbkfImageResult  || inputUrlSourceCred  || dbkfVideoMatch  || hpResult ?
                            <AssistantWarnings/> : null
                        }
                        <Box m={2}/>
                    </Grid>

                    <Grid item xs={12}>
                        {hpFailState || scFailState || dbkfTextFailState || dbkfMediaFailState || neFailState ?
                            <AssistantCheckStatus/> : null
                        }
                    </Grid>

                </Grid>

                <Grid item xs={12} className={classes.assistantGrid} hidden={urlMode === null || urlMode === true}>
                    <Grid container>
                        <Grid item xs={10}>
                            <Typography component={"span"} variant={"h6"}>
                                <Box p={1}/>{keyword("upload_type_question")}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} align={"right"}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={urlMode}
                                        onChange={() => {
                                            cleanAssistant()
                                            dispatch(setUrlMode(true))
                                        }
                                        }
                                    />}
                                label={keyword("mode_label")}
                            />
                        </Grid>
                    </Grid>

                    <Box m={2}/>

                    <Button className={classes.button} variant="contained" color="primary" onClick={() => {
                        submitUpload(CONTENT_TYPE.VIDEO)
                    }}>
                        {keyword("upload_video") || ""}
                    </Button>

                    <Button className={classes.button} variant="contained" color="primary" onClick={() => {
                        submitUpload(CONTENT_TYPE.IMAGE)
                    }}>
                        {keyword("upload_image") || ""}
                    </Button>
                </Grid>

            </Paper>

            <Box m={2}/>

            <Paper className={classes.assistantRoot}
                   hidden = {linkList.length === 0 && text === null && neResult === null}>
                <Box m={2}/>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h5"} align={"left"}>{keyword("url_text")}</Typography>
                        <Divider/>
                        <Box m={2}/>
                    </Grid>

                    {text ?
                        <Grid item xs={12}>
                            <AssistantTextResult/>
                            <Box m={2}/>
                        </Grid>
                        : null
                    }

                    {neResult ?
                        <Grid item xs={7}>
                            <AssistantNEResult/>
                        </Grid> : null
                    }

                    {linkList.length !== 0 ?
                        <Grid item xs={5}>
                            <AssistantLinkResult/>
                        </Grid> : null
                    }
                </Grid>

                <Box m={2}/>

            </Paper>

            <Box m={4}/>

            <Paper className={classes.assistantRoot}
                   hidden={(urlMode && inputUrl === null) || (!urlMode && !imageVideoSelected) && ocrResult === null}>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h5"} align={"left"}>{keyword("url_media")}</Typography>
                        <Divider/>
                        <Box m={2}/>
                    </Grid>


                    {imageList.length > 0 || videoList.length > 0 || imageVideoSelected ?
                        <Grid item xs={12}><AssistantMediaResult/></Grid>
                        : null
                    }
                </Grid>
            </Paper>

            <Box m={2}/>

            <Grid item xs={12} align={"right"}>
                {<HelpDialog paragraphs={["assistant_help_1", "assistant_help_2", "assistant_help_3"]}
                             keywordFile="components/NavItems/tools/Assistant.tsv"/>
                }
            </Grid>
        </div>
    )

};

export default Assistant;