import React, {useEffect, useState } from "react";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import YoutubeResults from "./Results/YoutubeResults.js"
import TwitterResults from "./Results/TwitterResults";
import {useAnalysisWrapper} from "./Hooks/useAnalysisWrapper";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles"
import Iframe from "react-iframe";
import useGenerateApiUrl from "./Hooks/useGenerateApiUrl";
import FacebookResults from "./Results/FacebookResults";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
import tsvAllTools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import {cleanAnalysisState,setAnalysisLoading, setAnalysisResult} from "../../../../redux/actions/tools/analysisActions";
import {useParams} from "react-router-dom";
import {KNOWN_LINKS} from "../../Assistant/AssistantRuleBook";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as AnalysisIcon } from '../../../NavBar/images/SVG/Video/Video_analysis.svg';
import Grid from "@material-ui/core/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import styles from "./Results/layout.module.css";
import Alert from '@material-ui/lab/Alert';
import _ from "lodash";


const Analysis = () => {

    const caa_analysis_url = process.env.REACT_APP_CAA_ANALYSIS_URL
    const {url} = useParams();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Analysis.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsvAllTools);
    const dispatch = useDispatch();

    const resultUrl = useSelector(state => state.analysis.url);
    const resultData = useSelector(state => state.analysis.result);
    const isLoading = useSelector(state => state.analysis.loading);

    const [input, setInput] = useState((resultUrl) ? resultUrl : "");
    const [urlDetected, setUrlDetected] = useState(false)
    const [submittedUrl, setSubmittedUrl] = useState(undefined);
    const [reprocess, setReprocess] = useState(false);
    const serviceUrl = caa_analysis_url+"videos";
    const [finalUrl, showFacebookIframe] = useGenerateApiUrl(serviceUrl, submittedUrl, reprocess);
    useAnalysisWrapper(setAnalysisLoading, setAnalysisResult, serviceUrl, finalUrl, submittedUrl, keyword, isLoading);
    
    var [warning, setWarning] = useState(false);
    
    const reprocessToggle = () => {
        setReprocess(!reprocess);
    };
    
    const submitForm = () => {
        submissionEvent(input.trim());
        setSubmittedUrl(input.trim());
        dispatch(cleanAnalysisState());
    };
    useEffect(() => {
        if(_.isEmpty(resultUrl))
            setInput(resultUrl)
    }, [resultUrl])
  
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

            <HeaderTool name={keywordAllTools("navbar_analysis_video")} description={keywordAllTools("navbar_analysis_description")} icon={<AnalysisIcon style={{ fill: "#51A5B2" }} />}/>

            <Card>
                <CardHeader
                    title={keyword("video_card_header")}
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
                                label={keyword("api_input")}
                                placeholder={keyword("api_input_placeholder")}
                                fullWidth
                                disabled={isLoading}
                                value={input}
                                variant="outlined"
                                onChange={e => {
                                    setInput(e.target.value)
                                    const regex = /fb.watch\//g;
                                    //const regex1 = /www.facebook.com\/watch\//g;
                                    var found = e.target.value.match(regex);
                                    //var found1 =e.target.value.match(regex1);
                                    //if(found!==null || found1!==null ){
                                    if(found!==null){
                                        setWarning(true)
                                    }
                                    else{
                                        setWarning(false)
                                    }                                    
                                }
                                }
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
                        url={"https://mever.iti.gr/plugin_login_fb"}
                        allow="fullscreen"
                        height="400"
                        width="100%"
                    />
                </Box>
            }
            {
                (resultData  && resultData.platform.startsWith("youtube")) ?
                    <YoutubeResults report={resultData}/> : null
            }
            {
                (resultData  && resultData.platform.startsWith("twitter")) ?
                    <TwitterResults report={resultData}/> : null
            }
            {
                (resultData  && resultData.platform.startsWith("facebook")) ?
                    <FacebookResults report={resultData}/> : null
            }
            
            {
                    warning===true &&
                    <Alert className={styles.margin1} variant="outlined" severity="warning">{keyword("facebook_tip")}</Alert>
            }
                
        </div>);
};
export default React.memo(Analysis);