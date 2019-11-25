import React, {useEffect, useState} from "react";
import { useSelector} from "react-redux";
import {Paper} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import CustomTile from "../../../utility/customTitle/customTitle"
import Box from "@material-ui/core/Box";
import YoutubeResults from "./Results/YoutubeResults.js"
import TwitterResults from "./Results/TwitterResults";
import {useAnalysisWrapper} from "./Hooks/useAnalysisWrapper";
import useMyStyles from "../../../utility/MaterialUiStyles/useMyStyles"
import {useParams} from 'react-router-dom'

const Analysis = () => {
    const {url} = useParams();
    const classes = useMyStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const resultUrl = useSelector(state => state.analysis.url);
    const resultData = useSelector(state => state.analysis.result);
    const isLoading = useSelector(state => state.analysis.loading);

    const [input, setInput] = useState((resultUrl)? resultUrl : "");
    const [submittedUrl, setSubmittedUrl] = useState(undefined);
    const [reprocess, setReprocess] = useState(false);
    const reprocessToggle = () => {
        setReprocess(!reprocess);
    };
    useAnalysisWrapper(submittedUrl,reprocess);

    const submitForm = () => {
        setSubmittedUrl(input);
    };

    useEffect(() => {
        if (url !== undefined){
            const uri = decodeURIComponent(url);
            setInput(uri);
            setSubmittedUrl(uri);
        }}, [url]);

    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile>{keyword("api_title")} </CustomTile>
                <br/>
                <TextField
                    id="standard-full-width"
                    label={keyword("api_input")}
                    placeholder="URL"
                    fullWidth
                    disabled={isLoading}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <Box m={2}/>
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
                <Button
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    onClick={submitForm}
                >
                    {keyword("button_submit")}
                </Button>
                <Box m={1}/>
                <LinearProgress hidden={!isLoading}/>
            </Paper>{
                (resultData !== null && resultUrl != null && resultUrl.startsWith("https://www.youtube.com/")) ?
                <YoutubeResults report={resultData}/> : null
            }{
                (resultData !== null && resultUrl != null && resultUrl.startsWith("https://twitter.com/")) ?
                <TwitterResults report={resultData}/> : null
            }
        </div>);
};
export default Analysis;