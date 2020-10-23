import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

import history from "../../../Shared/History/History";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Divider from "@material-ui/core/Divider";
import {CONTENT_TYPE, KNOWN_LINK_PATTERNS, matchPattern, selectCorrectActions} from "../AssistantRuleBook";
import {
    setDbkfImageMatchDetails,
    setDbkfVideoMatchDetails,
    setOcrDetails,
    setProcessUrlActions
} from "../../../../redux/actions/tools/assistantActions";
import {setError} from "../../../../redux/actions/errorActions";
import useDBKFApi from "../AssistantApiHandlers/useDBKFApi";
import useOcrService from "../AssistantApiHandlers/useOcrService";


const AssistantProcessUrlActions = () => {

    const dispatch = useDispatch();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    const inputUrl = useSelector(state => state.assistant.inputUrl);
    const processUrl = useSelector(state => state.assistant.processUrl);
    const contentType = useSelector(state => state.assistant.processUrlType);

    const processUrlActions = useSelector(state => state.assistant.processUrlActions);
    const ocrDone = useSelector(state => state.assistant.ocrDone);
    const dbkfMediaMatchDone = useSelector(state => state.assistant.dbkfMediaMatchDone);

    const dbkfSimilarityApi = useDBKFApi();
    const ocrApi = useOcrService();


    const handleClick = (path, resultUrl) => {
        if (resultUrl != null) {
            history.push("/app/" + path + "/" + encodeURIComponent(resultUrl))
        } else {
            history.push("/app/" + path + "/" + contentType)
        }
    };

    const similaritySearch = (searchEndpoint, stateStorageFunction) => {
        dispatch(stateStorageFunction(null, true, false))

        searchEndpoint().then(result => {
            if (result[1].length !== 0) {
                dispatch(stateStorageFunction(result[1], false, true))
            } else {
                dispatch(stateStorageFunction(null, false, true))
            }
        }).catch(() => {
            dispatch(setError(keyword("dbkf_error")));
            dispatch(stateStorageFunction(null, false, true))
        })
    }


    // if the processUrl changes, load any actions that can be taken on this new url
    useEffect(() => {
        if (processUrl !== null) {
            let knownInputLink = matchPattern(inputUrl, KNOWN_LINK_PATTERNS);
            let knownProcessLink = matchPattern(processUrl, KNOWN_LINK_PATTERNS);

            let actions = selectCorrectActions(contentType, knownInputLink, knownProcessLink, processUrl);
            dispatch(setProcessUrlActions(actions))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processUrl]);


    // also run the similarity search
    useEffect(() => {
        if (contentType === CONTENT_TYPE.IMAGE && !dbkfMediaMatchDone) {
            similaritySearch(
                () => dbkfSimilarityApi.callImageSimilarityEndpoint(processUrl),
                (result, loading, done) => setDbkfImageMatchDetails(result, loading, done))
        } else if (contentType === CONTENT_TYPE.VIDEO && !dbkfMediaMatchDone) {
            similaritySearch(
                () => dbkfSimilarityApi.callVideoSimilarityEndpoint(processUrl),
                (result, loading, done) => setDbkfVideoMatchDetails(result, loading, done))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processUrl]);


    // andddd run the OCR check
    useEffect(() => {
        if (contentType === CONTENT_TYPE.IMAGE && !ocrDone) {

            dispatch(setOcrDetails(null, true, false))

            ocrApi.callOcrService(processUrl).then(result => {
                if (result.length !== 0) {
                    dispatch(setOcrDetails(result, false, true))
                } else dispatch(setOcrDetails(null, false, true))
            }).catch(() => {
                dispatch(setOcrDetails(null, false, true))
                dispatch(setError(keyword("ocr_error")));
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processUrl])


    return (
        processUrlActions.length > 0 ?
            <div>
                <Box p={2}>
                    <Typography variant={"h5"}>{keyword("things_you_can_do_header")}</Typography>
                    <Typography variant={"subtitle2"}>{keyword("things_you_can_do")}</Typography>
                </Box>
                <Divider variant={"middle"}/>
                <List>
                    {processUrlActions.map((action, index) => {
                        return (
                            <Box m={2} key={index}>
                                <Card className={classes.assistantCards} variant={"outlined"}
                                      style={{}}>
                                    <ListItem
                                        onClick={() => handleClick(action.path, action.useInputUrl ? inputUrl : processUrl)}>
                                        <ListItemAvatar>
                                            <Avatar variant={"square"} src={action.icon}/>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography component={"span"}>
                                                    <Box fontWeight="fontWeightBold">
                                                        {keyword(action.title)}
                                                    </Box>
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography color={"textSecondary"} component={"span"}>
                                                    <Box fontStyle="italic">{keyword(action.text)}</Box>
                                                </Typography>
                                            }/>
                                    </ListItem>
                                </Card>
                            </Box>
                        )
                    })}
                </List>
            </div>
            : null
    );
};
export default AssistantProcessUrlActions;