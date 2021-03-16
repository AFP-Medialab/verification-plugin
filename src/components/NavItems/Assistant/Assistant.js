import React, {useEffect, useState} from "react";
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
import useLoadLanguage from "../../../Hooks/useLoadLanguage";

import {cleanAssistantState, setUrlMode, submitInputUrl, submitUpload} from "../../../redux/actions/tools/assistantActions";

import {CONTENT_TYPE,} from "./AssistantRuleBook";
import AssistantNEResult from "./AssistantCheckResults/AssistantNEResult";
import AssistantCheckStatus from "./AssistantCheckResults/AssistantCheckStatus";
import {setError} from "../../../redux/actions/errorActions";

const Assistant = () => {

    // styles, language, dispatch, params
    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const {url} = useParams();

    //form states
    const inputUrl = useSelector(state => state.assistant.inputUrl);
    const urlMode = useSelector(state => state.assistant.urlMode);
    const imageVideoSelected = useSelector(state => state.assistant.imageVideoSelected);
    const loading = useSelector(state => state.assistant.loading)

    //result states
    const imageList = useSelector(state => state.assistant.imageList);
    const videoList = useSelector(state => state.assistant.videoList);
    const text = useSelector(state => state.assistant.urlText)
    const linkList = useSelector(state => state.assistant.linkList)
    const errorKey = useSelector(state => state.assistant.errorKey);

    //third party check states
    const neResult = useSelector(state => state.assistant.neResultCategory);
    const hpResult = useSelector(state => state.assistant.hpResult)
    const inputUrlSourceCred = useSelector(state => state.assistant.inputUrlSourceCredibility)
    const dbkfTextMatch = useSelector(state => state.assistant.dbkfTextMatch);
    const dbkfImageResult = useSelector(state => state.assistant.dbkfImageMatch);
    const dbkfVideoMatch = useSelector(state => state.assistant.dbkfVideoMatch);

    //third party fail states
    const hpFailState = useSelector(state => state.assistant.hpFail)
    const scFailState = useSelector(state => state.assistant.inputSCFail)
    const dbkfTextFailState = useSelector(state => state.assistant.dbkfTextMatchFail)
    const dbkfMediaFailState = useSelector(state => state.assistant.dbkfMediaMatchFail)
    const neFailState = useSelector(state => state.assistant.neFail)
    // const mtFailState = useSelector(state => state.assistant.mtFail)

    //local state
    const [formInput, setFormInput] = useState(inputUrl);

    // clean assistant state
    const cleanAssistant = () => {
        dispatch(cleanAssistantState());
        setFormInput("");
    }

    // set correct error message
    useEffect(() => {
        if (errorKey) {
            errorKey.startsWith("assistant_error") ?
                dispatch(setError(keyword(errorKey))) :
                dispatch(setError(errorKey))
            cleanAssistant()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorKey])

    // if a url is present in the plugin url(as a param), set it to input
    useEffect(() => {
        if (url !== undefined) {
            let uri = (url !== null) ? decodeURIComponent(url) : undefined;
            dispatch(setUrlMode(true));
            setFormInput(uri)
            dispatch(submitInputUrl(uri))
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
                            <Typography style={{display: 'flex', alignItems: 'center'}}
                                        component={"span"}
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
                                        <IconButton color={"secondary"} onClick={() => {dispatch(submitInputUrl(formInput))}}>
                                            <ArrowForwardIcon/>
                                        </IconButton>
                                    </InputAdornment>
                        }}
                    />
                    <Box m={3}/>
                    <LinearProgress hidden={!loading}/>

                    <Grid item xs={12}>
                        {dbkfTextMatch || dbkfImageResult || inputUrlSourceCred || dbkfVideoMatch || hpResult ?
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
                            <Typography component={"span"}
                                        variant={"h6"}
                            >
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
                                        }}
                                    />}
                                label={keyword("mode_label")}
                            />
                        </Grid>
                    </Grid>

                    <Box m={2}/>

                    <Button className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={() => {dispatch(submitUpload(CONTENT_TYPE.VIDEO))}}>
                        {keyword("upload_video") || ""}
                    </Button>

                    <Button className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={() => {dispatch(submitUpload(CONTENT_TYPE.IMAGE))}}>
                        {keyword("upload_image") || ""}
                    </Button>
                </Grid>
            </Paper>

            <Box m={2}/>

            <Paper className={classes.assistantRoot}
                   hidden={
                       (urlMode && inputUrl === null) ||
                       (urlMode && inputUrl !== null && (!imageList.length && !videoList.length)) ||
                       ((!urlMode && !imageVideoSelected))}
            >
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
                {<HelpDialog title={"assistant_help_title"}
                             paragraphs={["assistant_help_1", "assistant_help_2", "assistant_help_3", "assistant_help_4"]}
                             keywordFile="components/NavItems/tools/Assistant.tsv"/>
                }
            </Grid>

            <Box m={4}/>

            <Paper className={classes.assistantRoot}
                   hidden={linkList.length === 0 && text === null && neResult === null}>
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
        </div>
    )
};

export default Assistant;