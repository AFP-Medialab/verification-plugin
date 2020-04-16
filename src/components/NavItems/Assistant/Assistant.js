import "react-devtools";
import {useParams} from 'react-router-dom'
import React, {useEffect, useState} from "react";
import {Paper, Box, TextField, Button} from "@material-ui/core";
import FaceIcon from "@material-ui/icons/Face";
import Typography from "@material-ui/core/Typography";
import {useDispatch, useSelector} from "react-redux";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import {submissionEvent} from "../../Shared/GoogleAnalytics/GoogleAnalytics";
import 'tui-image-editor/dist/tui-image-editor.css'

import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import AssistantResult from "./AssistantResult";
import {cleanAssistantState, setAssistantResult} from "../../../redux/actions/tools/assistantActions";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

import analysisIconOff from "../../NavBar/images/tools/video_logoOff.png";
import keyframesIconOff from "../../NavBar/images/tools/keyframesOff.png";
import thumbnailsIconOff from "../../NavBar/images/tools/youtubeOff.png";
import twitterSearchIconOff from "../../NavBar/images/tools/twitterOff.png";
import magnifierIconOff from "../../NavBar/images/tools/magnifierOff.png";
import metadataIconOff from "../../NavBar/images/tools/metadataOff.png";
import videoRightsIconOff from "../../NavBar/images/tools/copyrightOff.png";
import forensicIconOff from "../../NavBar/images/tools/forensic_logoOff.png";
import twitterSnaIconOff from "../../NavBar/images/tools/twitter-sna-off.png";
import {setError} from "../../../redux/actions/errorActions";
import CloseResult from "../../Shared/CloseResult/CloseResult";

/*
* TODO: figure out weird navbar issue with translations
*  try new tab/get all images and videos
*  fix issue where not all redirects set url on state
*  change
* */
const Assistant = () => {

    const {url} = useParams();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    const resultUrl = useSelector(state => state.assistant.url);
    const resultData = useSelector(state => state.assistant.result);
    const resultProcessUrl = useSelector(state => state.assistant.processUrl);
    const dispatch = useDispatch();

    const [input, setInput] = useState(resultUrl);
    const [urlToBeProcessed, setProcessUrl] = useState(resultProcessUrl);

    const getErrorText = (error) => {
        if (keyword(error) !== "")
            return keyword(error);
        return keyword("please_give_a_correct_link");
    };

    const submitUrl = (src) => {
        submissionEvent(src);
        try {
            let content_type = matchPattern(src, ctypePatterns);
            let domain = matchPattern(src, domainPatterns);
            let actions = loadActions(domain, content_type, src);

            dispatch(setAssistantResult(src, actions, urlToBeProcessed));
        }
        catch(error){
            dispatch((setError(getErrorText(error))));
        }
    };

    const submitUpload = (type) => {
        let content_type = type;
        let domain = DOMAIN.OWN;

        let actions = loadActions(domain, content_type, null);
        dispatch(setAssistantResult("", actions, urlToBeProcessed));
    }

    const matchPattern = (to_match, patternArray) => {
        let match = null;
        outer: for (let i = 0; i < patternArray.length; i++) {
            const patterns = patternArray[i].patterns;
            for (let j = 0; j < patterns.length; j++) {
                const pattern = patterns[j];
                if (to_match.match(pattern)) {
                    match = patternArray[i].key;
                    break outer;
                }
            }
        }
        return match;
    }

    const loadActions = (domainEnum, cTypeEnum, url) => {
        let possibleActions = [];
        for (let i = 0; i < drawerItems.length; i++) {
            let currentAction = drawerItems[i];
            //check if the domains are matching
            const domains = currentAction.domains;
            if (domains.includes(domainEnum)) {
                const ctypes = currentAction.ctypes;
                //const restrictions = currentAction.type_restriction;
                if (ctypes.includes(CTYPE.ALL) || ctypes.includes(cTypeEnum)) {
                    //if (restrictions.size == 0 || (url.match(restrictions))) {
                        possibleActions.push(currentAction);
                    //}
                }
            }
        }
        return possibleActions;
    }


    useEffect(() => {
        if (url !== undefined) {
            const uri = (url !== null) ? decodeURIComponent(url) : undefined;
            setInput(uri);
            submitUrl(uri)
        }
    }, [url]);

    const CTYPE = Object.freeze({
        VIDEO: "Video",
        IMAGE: "Image",
        PDF: "PDF",
        AUDIO: "Audio",
        TEXT: "Text",
        ALL: "All"
    });

    const DOMAIN = Object.freeze({
        FACEBOOK: { type: "FACEBOOK", name: "Facebook"},
        YOUTUBE: { type: "YOUTUBE", name: "Youtube"},
        TWITTER: { type: "TWITTER", name: "Twitter"},
        OWN: { type: "OWN", name: "Own"},
        ALL: { type: "ALL", name: "website"}
    });

    const ctypePatterns = [
        {
            key: CTYPE.VIDEO,
            patterns: [/(mp4|webm|avi|mov|wmv|ogv|mpg|flv|mkv)(\?.*)?$/i,
                /(facebook\.com\/.*\/videos\/)/,/(twitter\.com\/.*\/video)/,
                /((y2u|youtube|youtu\.be).*(?!\')[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw](?=))/]
        },
        {
            key: CTYPE.IMAGE,
            patterns: [
                /(jpg|jpeg|png|gif|svg)(\?.*)?$/i,
                /(facebook\.com\/.*\/photos\/)/,
                /(pbs\.twimg\.com\/)/, /(twitter\.com\/.*\/photo)/,
                /(i\.ytimg\.com)/]
        },
        {
            key: CTYPE.PDF,
            patterns: [/^.*\.pdf(\?.*)?(\#.*)?/]
        },
        {
            key: CTYPE.AUDIO,
            patterns: [/(mp3|wav|m4a)(\?.*)?$/i]
        }
    ];

    const domainPatterns = [
        {
            key: DOMAIN.FACEBOOK,
            patterns: ["^(https?:/{2})?(www.)?facebook.com|fbcdn.net"]
        },
        {
            key: DOMAIN.YOUTUBE,
            patterns: ["^(https?:/{2})?(www.)?youtube|youtu.be|i\.ytimg"]
        },
        {
            key: DOMAIN.TWITTER,
            patterns: ["^(https?:/{2})?(www.)?twitter.com|twimg.com"]
        },
        {
            key: DOMAIN.ALL,
            patterns: ["https?:/{2}(www.)?[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_+.~#?&//=]*)"]
        }
    ];


    const drawerItems = [
        {
            title: "navbar_analysis",
            icon: analysisIconOff,
            domains: new Array(DOMAIN.YOUTUBE, DOMAIN.FACEBOOK, DOMAIN.TWITTER),
            ctypes: [CTYPE.VIDEO],
            type_restriction: [],
            text: "analysis_text",
            tsvPrefix: "api",
            path: "tools/analysis",
        },
        {
            title: "navbar_keyframes",
            icon:  keyframesIconOff,
            domains: new Array(DOMAIN.YOUTUBE, DOMAIN.FACEBOOK, DOMAIN.TWITTER, DOMAIN.OWN),
            ctypes: [CTYPE.VIDEO],
            type_restriction: [],
            text: "keyframes_text",
            tsvPrefix: "keyframes",
            path: "tools/keyframes",
        },
        {
            title: "navbar_thumbnails",
            icon: thumbnailsIconOff,
            domains: new Array(DOMAIN.YOUTUBE),
            ctypes: [CTYPE.VIDEO],
            type_restriction: [],
            text: "thumbnails_text",
            tsvPrefix: "thumbnails",
            path: "tools/thumbnails",
        },
        {
            title: "navbar_twitter",
            icon: twitterSearchIconOff,
            domains: new Array(DOMAIN.TWITTER),
            ctypes: [CTYPE.TEXT],
            type_restriction: [],
            text: "twitter_text",
            tsvPrefix: "twitter",
            path: "tools/twitter",
        },
        {
            title: "navbar_magnifier",
            icon: magnifierIconOff,
            domains: new Array(DOMAIN.ALL, DOMAIN.OWN),
            ctypes: [CTYPE.IMAGE],
            type_restriction: [],
            text: "magnifier_text",
            tsvPrefix: "magnifier",
            path: "tools/magnifier",
        },
        {
            title: "navbar_metadata",
            icon: metadataIconOff,
            domains: new Array(DOMAIN.ALL, DOMAIN.OWN),
            ctypes: [CTYPE.IMAGE, CTYPE.VIDEO],
            type_restriction: [/(jpg|jpeg|mp4|mp4v)(\?.*)?$/i],
            text: "metadata_text",
            tsvPrefix: "metadata",
            path: "tools/metadata",
        },
        {
            title: "navbar_rights",
            icon:  videoRightsIconOff,
            domains: new Array(DOMAIN.YOUTUBE, DOMAIN.FACEBOOK, DOMAIN.TWITTER),
            ctypes: [CTYPE.VIDEO],
            type_restriction: [],
            text: "rights_text",
            tsvPrefix: "copyright",
            path: "tools/copyright",
        },
        {
            title: "navbar_forensic",
            icon: forensicIconOff,
            domains: new Array(DOMAIN.ALL, DOMAIN.OWN),
            ctypes: [CTYPE.IMAGE],
            type_restriction: [],
            text: "forensic_text",
            tsvPrefix: "forensic",
            path: "tools/forensic",
        },
        {
            title: "navbar_twitter_sna",
            domains: new Array(),
            ctypes: [],
            type_restriction: [],
            text: "sna_text",
            icon:  twitterSnaIconOff,
            tsvPrefix: "twitter_sna",
            path: "tools/twitterSna"
        },
    ];


    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile text={keyword("assistant_title")}/>
                <Box m={5}/>

                <div className={classes.assistantText} hidden={urlToBeProcessed!=null}>
                    <Typography variant={"h6"} >
                        <FaceIcon fontSize={"small"}/> {keyword("assistant_real_intro")}
                    </Typography>
                    <Box m={2}/>
                    <Button className={classes.button} variant = "contained" color="primary" onClick={() => setProcessUrl(true)}>
                        {keyword("process_url") || ""}
                    </Button>
                    <Button className={classes.button} variant="contained" color="primary"  onClick={() => setProcessUrl(false)}>
                        {keyword("submit_own_file") || ""}
                    </Button>
                </div>

                    { (urlToBeProcessed!=null) ?
                        (urlToBeProcessed) ?
                            (<div className={classes.assistantText} hidden={false}>
                                <CloseResult onClick={() => {setProcessUrl(null); dispatch(cleanAssistantState());}}/>
                                <Typography variant={"h6"} >
                                    <FaceIcon fontSize={"small"}/> {keyword("assistant_intro")}
                                </Typography>
                                <Box m={2}/>
                                <TextField
                                    id="standard-full-width"
                                    label={keyword("assistant_urlbox")}
                                    style={{margin: 8}}
                                    placeholder={""}
                                    fullWidth
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                />
                                <Box m={2}/>
                                <Button variant="contained" color="primary" align={"center"} onClick={() => submitUrl(input)}>
                                    {keyword("button_submit") || ""}
                                </Button>
                            </div>)
                            :
                            ( <div className={classes.assistantText}>
                                <CloseResult onClick={() => {setProcessUrl(null); dispatch(cleanAssistantState());}}/>
                                <Typography variant={"h6"} >
                                    <FaceIcon fontSize={"small"}/> {keyword("upload_type_question")}
                                </Typography>
                                <Box m={2}/>
                                <Button className={classes.button} variant="contained" color="primary" onClick={() => submitUpload(CTYPE.VIDEO)}>
                                    {keyword("upload_video") || ""}
                                </Button>
                                <Button className={classes.button} variant="contained" color="primary"  onClick={() => submitUpload(CTYPE.IMAGE)}>
                                    {keyword("upload_image") || ""}
                                </Button>
                            </div>)
                        : null
                    }
            </Paper>
            {(resultData) ? (<AssistantResult result={resultData} image={resultUrl}/>) : null}
        </div>
    )
};
export default Assistant;