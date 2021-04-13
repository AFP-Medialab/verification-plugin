import {Paper} from "@material-ui/core";
import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import useGetImages from "./Hooks/useGetImages";
import LinearProgress from "@material-ui/core/LinearProgress";
import ForensicResults from "./Results/ForensicResult";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import {useParams} from 'react-router-dom'
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Forensic.tsv";
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import LocalFile from "../Forensic/LocalFile/LocalFile";
import {KNOWN_LINKS} from "../../Assistant/AssistantRuleBook";

const Forensic = () => {
    const {url} = useParams();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Forensic.tsv", tsv);

    // state used to toggle localFile view
    const [localFile, setLocalFile] = useState(false);
    const toggleLocal = () => {
        setLocalFile(!localFile);
    };

    const resultUrl = useSelector(state => state.forensic.url);
    const resultData = useSelector(state => state.forensic.result);
    const isLoading = useSelector(state => state.forensic.loading);
    const gifAnimationState = useSelector(state => state.forensic.gifAnimation);

    //console.log(gifAnimationState);

    const [input, setInput] = useState(resultUrl);
    const [image, setImage] = useState("");
    const [urlDetected, setUrlDetected] = useState(false)
    const [loaded, setLoaded] = useState(false);

    useGetImages(image);

    
    const submitUrl = () => {
        if (input && input !== "") {
            setLoaded(true);
            submissionEvent(input);
            setImage(input);
        }
    };

    useEffect(() => {
        if (url) {
            if (url === KNOWN_LINKS.OWN) {
                setLocalFile(true)
            } else {
                const uri = decodeURIComponent(url);
                setInput(uri)
            }
        }
        setUrlDetected(true)

    }, [url]);

    useEffect(() => {
        if (urlDetected){
            submitUrl()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlDetected])

    useEffect(() => {
        setImage("")
    }, [image]);

    return (
        <div>
            
            <Paper className={classes.root} style={{ display: loaded ? "none" : "block" }}>
                
                <CustomTile text={keyword("forensic_title")}/>
                <Box m={1}/>
                <Box display={localFile ? "none" : "block"}>
                    <Button variant="contained" color="primary" onClick={toggleLocal}>
                        {keyword("button_localfile")}
                    </Button>
                    <Box m={2}/>
                    <TextField
                        value={input}
                        id="standard-full-width"
                        label={keyword("forensic_input")}
                        style={{margin: 8}}
                        placeholder={""}
                        fullWidth
                        disabled={isLoading}
                        onChange={e => {
                            setInput(e.target.value)
                        }}
                    />
                    <Box m={2}/>
                    <Button variant="contained" color="primary" onClick={submitUrl} disabled={isLoading}>
                        {keyword("button_submit")}
                    </Button>
                    <Box m={2}/>
                    <LinearProgress hidden={!isLoading}/>
                </Box>
                <Box display={!localFile ? "none" : "block"}>
                    <Button variant="contained" color="primary" onClick={toggleLocal}>
                        {keyword("forensic_card_back")}
                    </Button>
                    <LocalFile/>
                </Box>
            </Paper>
            {
                resultData &&
                <ForensicResults 
                    result={resultData}
                    url={resultUrl}
                    loaded={loaded}
                    gifAnimation={gifAnimationState}
                    />
            }
        </div>
    );
};
export default Forensic;