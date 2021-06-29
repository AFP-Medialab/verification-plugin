import {useSelector} from "react-redux";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import React, {useEffect, useState} from "react";
import useVideoRightsTreatment from "./Hooks/useVideoRightsTreatment";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import VideoRightsResults from "./Results/VideoRightsResults";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/VideoRights.tsv";
import tsvAlltools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import {useParams} from "react-router-dom";
import {KNOWN_LINKS} from "../../Assistant/AssistantRuleBook";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as VideoRightsIcon } from '../../../NavBar/images/SVG/Video/Video_rights.svg';
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import Grid from "@material-ui/core/Grid";

const VideoRights = () => {
    const {url} = useParams();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/VideoRights.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsvAlltools);

    const resultUrl = useSelector(state => state.videoRights.url);
    const resultResult = useSelector(state => state.videoRights.result);
    const isLoading = useSelector(state => state.videoRights.loading);

    const [input, setInput] = useState(resultUrl);
    const [urlDetected, setUrlDetected] = useState(false);
    const [submitted, setSubmitted] = useState(null);
    useVideoRightsTreatment(submitted, keyword);

    const submitForm = () => {
        if (!isLoading) {
            submissionEvent(input);
            setSubmitted(input);
        }
    };

    useEffect(()=>{
        if (urlDetected){
            submitForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlDetected])

    useEffect(() => {
        if (url && url !== KNOWN_LINKS.OWN) {
            const uri = (url !== null) ? decodeURIComponent(url) : undefined;
            setInput(uri);
            setUrlDetected(true)
        }
    }, [url]);

    return (
        <div>
            <HeaderTool name={keywordAllTools("navbar_rights")} description={keywordAllTools("navbar_rights_description")} icon={<VideoRightsIcon style={{ fill: "#51A5B2" }} />} />

            <Card>
                <CardHeader
                    title={keyword("cardheader_link")}
                    className={classes.headerUpladedImage}
                />
                <div className={classes.root2}>

                    <Grid
                        container
                        direction="row"
                        spacing={3}
                        alignItems="center"
                    >

                        <Grid item xs>
                            <TextField
                                value={input}
                                id="standard-full-width"
                                label={keyword("copyright_input")}
                                placeholder={keyword("copyright_input_placeholder")}
                                fullWidth
                                disabled={isLoading}
                                variant="outlined"
                                onChange={e => setInput(e.target.value)}
                            />

                        </Grid>

                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                onClick={submitForm}
                            >
                                {keyword("button_submit")}
                            </Button>

                        </Grid>

                    </Grid>
                    
                    <Box m={3} hidden={!isLoading}/>
                    <LinearProgress hidden={!isLoading}/>

                </div>
            </Card>

            <Box m={3} />

            {
                resultResult &&
                <VideoRightsResults result={resultResult}/>
            }
        </div>
    )
};
export default VideoRights;