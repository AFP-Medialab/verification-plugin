import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import TwitterResults from "./Results/TwitterResults";
import {useAnalysisWrapper} from "../Analysis/Hooks/useAnalysisWrapper";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles"
import Iframe from "react-iframe";
import useGenerateApiUrl from "../Analysis/Hooks/useGenerateApiUrl";
import FacebookResults from "./Results/FacebookResults";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
import tsvAlltools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import {cleanAnalysisState, setAnalysisLoading, setAnalysisResult} from "../../../../redux/actions/tools/image_analysisActions";
import {useParams} from "react-router-dom";
import {KNOWN_LINKS} from "../../Assistant/AssistantRuleBook";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as AnalysisIconImage } from "../../../NavBar/images/SVG/Image/Image_analysis.svg"

import Grid from "@material-ui/core/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";

const Analysis = () => {
    const caa_analysis_url = process.env.REACT_APP_CAA_ANALYSIS_URL
    const {url} = useParams();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Analysis.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsvAlltools);
    const dispatch = useDispatch();

    const resultUrl = useSelector(state => state.analysisImage.url);
    const resultData = useSelector(state => state.analysisImage.result);
    const isLoading = useSelector(state => state.analysisImage.loading);
    const imageFB = useSelector(state => state.analysisImage.image);


    const [input, setInput] = useState((resultUrl) ? resultUrl : "");
    const [urlDetected, setUrlDetected] = useState(false)
    const [submittedUrl, setSubmittedUrl] = useState(undefined); 
    const [reprocess, setReprocess] = useState(false);
    const serviceUrl = caa_analysis_url+"images";

    const [finalUrl, showFacebookIframe] = useGenerateApiUrl(serviceUrl, submittedUrl, reprocess);
    useAnalysisWrapper(setAnalysisLoading, setAnalysisResult, serviceUrl, finalUrl, submittedUrl, keyword);

    const reprocessToggle = () => {
        setReprocess(!reprocess);
    };

    const submitForm = () => {
        submissionEvent(input.trim());
        setSubmittedUrl(input.trim());
        dispatch(cleanAnalysisState());
    };
    
    useEffect(() => {     
        if (finalUrl !== undefined) {
            setSubmittedUrl(undefined);
        }
    }, [finalUrl]);

    useEffect(()=>{
        if (urlDetected) {
            submitForm()
        }
        // eslint-disable-next-line
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

            <HeaderTool name={keywordAllTools("navbar_analysis_image")} description={keywordAllTools("navbar_analysis_image_description")} icon={<AnalysisIconImage style={{ fill: "#51A5B2" }} />}/>

            <Card>
                
                <CardHeader
                    title={keyword("image_card_header")}
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
                                id="standard-full-width"
                                label={keyword("api_input_image")}
                                placeholder={keyword("api_input_placeholder")}
                                fullWidth
                                disabled={isLoading}
                                value={input}
                                variant="outlined"
                                onChange={e => setInput(e.target.value)}
                            />
                            
                        </Grid>

                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={reprocess}
                                        onChange={reprocessToggle}
                                        disabled={isLoading}
                                        value="checkedBox"
                                        color="primary"
                                    />
                                }
                                label={keyword("api_repro")}
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

                        

                        <Box m={1}/>
                        
                    </Grid>
                </div>
                <LinearProgress hidden={!isLoading} />
            </Card>
            <Box m={3} />

            {
                showFacebookIframe &&
                <Box m={4}>
                    <Iframe
                        frameBorder="0"
                        url={"https://caa.iti.gr/plugin_login_fb"}
                        allow="fullscreen"
                        height="400"
                        width="100%"
                    />
                </Box>
            }
            
            {
                //(resultData !== null && resultUrl != null && resultUrl.startsWith("https://twitter.com/")) ?
                (resultData  && resultData.platform.startsWith("twitter")) ?
                    <TwitterResults report={resultData}/> : null
            }
            {
                //(resultData !== null && resultUrl != null && resultUrl.startsWith("https://www.facebook.com/")) ?
                (resultData  && resultData.platform.startsWith("facebook")) ?
                    <FacebookResults report={resultData} image={imageFB}/> : null
            }
             
        </div>);
};
export default React.memo(Analysis);