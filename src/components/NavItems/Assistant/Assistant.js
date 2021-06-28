import React, {useEffect, useState} from "react";

import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";

import {Box, Paper} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";

import AssistantAssurances from "./AssistantScrapeResults/AssistantAssurances";
import AssistantCheckStatus from "./AssistantCheckResults/AssistantCheckStatus";
import AssistantFileSelected from "./AssistantFileSelected";
import AssistantIntroduction from "./AssistantIntroduction";
import AssistantLinkResult from "./AssistantScrapeResults/AssistantLinkResult";
import AssistantMediaResult from "./AssistantScrapeResults/AssistantMediaResult";
import AssistantNEResult from "./AssistantCheckResults/AssistantNEResult";
import AssistantTextResult from "./AssistantScrapeResults/AssistantTextResult";
import AssistantUrlSelected from "./AssistantUrlSelected";
import AssistantWarnings from "./AssistantScrapeResults/AssistantWarnings";

import {cleanAssistantState, setUrlMode, submitInputUrl} from "../../../redux/actions/tools/assistantActions";
import history from "../../Shared/History/History";
import {setError} from "../../../redux/actions/errorActions";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";


/*
* todo:
*  - fix video type bug
*  - check if any states now redundant
*  - check if any styles now redundant
*
* */

const Assistant = () => {

    // styles, language, dispatch, params
    const {url} = useParams();
    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    //form states
    const inputUrl = useSelector(state => state.assistant.inputUrl);
    const urlMode = useSelector(state => state.assistant.urlMode);
    const imageVideoSelected = useSelector(state => state.assistant.imageVideoSelected);

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
    const inputUrlFactCheckers = useSelector(state => state.assistant.inputUrlFactCheckers)

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

    // clean assistant
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
        <Paper>
            <Paper className={classes.root}>
                {/* introduction */}
                <AssistantIntroduction cleanAssistant={cleanAssistant}/>

                {/* url entry field */}
                {urlMode ?
                    <AssistantUrlSelected formInput={formInput}
                                          setFormInput={setFormInput}
                                          cleanAssistant={cleanAssistant}/>
                    : null
                }

                {/* local file selection field */}
                {imageVideoSelected ?
                    <AssistantFileSelected/> :
                    null
                }

                {/* warnings and api status checks */}
                <Grid item xs={12} className={classes.assistantGrid}
                      hidden={urlMode === null || urlMode === false}>

                    <Grid item xs={12}>
                        {inputUrlFactCheckers ?
                            <AssistantAssurances/> : null
                        }
                    </Grid>

                    <Grid item xs={12}>
                        {dbkfTextMatch || dbkfImageResult || inputUrlSourceCred || dbkfVideoMatch || hpResult ?
                            <AssistantWarnings/> : null
                        }
                    </Grid>

                    <Grid item xs={12}>
                        {hpFailState || scFailState || dbkfTextFailState || dbkfMediaFailState || neFailState ?
                            <AssistantCheckStatus/> : null
                        }
                    </Grid>
                </Grid>
            </Paper>

            <Box m={3}/>

            {/* media results */}
            <Paper className={classes.root}
                   hidden={
                       (!urlMode) ||
                       (urlMode && inputUrl === null) ||
                       (urlMode && inputUrl !== null && (!imageList.length && !videoList.length))}>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h5"} align={"left"}>{keyword("url_media")}</Typography>
                        <Divider/>
                        <Box m={2}/>
                    </Grid>

                    {imageList.length > 0 || videoList.length > 0 || imageVideoSelected ?
                        <Grid item xs={12}>
                            <AssistantMediaResult/>
                        </Grid>
                        : null
                    }
                </Grid>
            </Paper>

            <Box m={3}/>

            {/* text results */}
            <Paper className={classes.root}
                   hidden={linkList.length === 0 && text === null && neResult === null}>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h5"} align={"left"}>{keyword("url_text")}</Typography>
                        <Divider/>
                        <Box m={2}/>
                    </Grid>

                    {text ?
                        <Grid item xs={12}>
                            <AssistantTextResult/>
                        </Grid> : null
                    }

                    {neResult ?
                        <Grid item xs={12}>
                            <AssistantNEResult/>
                        </Grid> : null
                    }

                    {linkList.length !== 0 ?
                        <Grid item xs={5}>
                            <AssistantLinkResult/>
                        </Grid> : null
                    }
                </Grid>
            </Paper>
        </Paper>
    )
};

export default Assistant;