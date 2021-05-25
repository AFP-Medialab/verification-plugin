import {Paper, Box, TextField, Button, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import {useDispatch, useSelector} from "react-redux";
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageResult from "./Results/ImageResult";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import {useParams} from 'react-router-dom'
import {setMagnifierResult} from "../../../../redux/actions/tools/magnifierActions";
import {setError} from "../../../../redux/actions/errorActions";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Magnifier.tsv";
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import {KNOWN_LINKS} from "../../Assistant/AssistantRuleBook";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as MagnifierIcon } from '../../../NavBar/images/SVG/Image/Magnifier.svg';
import Grid from "@material-ui/core/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";

const Magnifier = () => {
    const {url} = useParams();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Magnifier.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsv);


    const resultUrl = useSelector(state => state.magnifier.url);
    const resultResult = useSelector(state => state.magnifier.result);
    const dispatch = useDispatch();

    const [input, setInput] = useState(resultUrl);

    const getErrorText = (error) => {
        if (keyword(error) !== "")
            return keyword(error);
        return keyword("please_give_a_correct_link");
    };


    const submitUrl = (src) => {
        submissionEvent(src);
        let img = new Image();
        img.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);

            // Get raw image data
            dispatch(setMagnifierResult(input, canvas.toDataURL('image/png'), false, false));
            canvas.remove();
        };
        img.onerror = (error) => {
            dispatch(setError(getErrorText(error)));
        };
        img.src = src;
    };

    useEffect(() => {
        if (url) {
            if(url !== KNOWN_LINKS.OWN) {
                const uri = (url !== null) ? decodeURIComponent(url) : undefined;
                setInput(uri);
                submitUrl(uri)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);


    return (
        <div>
            <HeaderTool name={keywordAllTools("navbar_magnifier")} description={keywordAllTools("navbar_magnifier_description")} icon={<MagnifierIcon style={{ fill: "#51A5B2" }} />} />

            <Card>
                <CardHeader
                    title={keyword("cardheader_source")}
                    className={classes.headerUpladedImage}
                />
                <Box p={3}>


                    <Grid
                        container
                        direction="row"
                        spacing={3}
                        alignItems="center"
                    >
                        <Grid item xs>
                            <TextField
                                id="standard-full-width"
                                label={keyword("magnifier_urlbox")}
                                placeholder={keyword("magnifier_urlbox_placeholder")}
                                fullWidth
                                value={input}
                                variant="outlined"
                                onChange={e => setInput(e.target.value)}
                            />

                        </Grid>

                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => submitUrl(input)}>
                                {keyword("button_submit") || ""}
                            </Button>
                        </Grid>


                    </Grid>
            
                    <Box m={2}/>

                    
                    <Button startIcon={<FolderOpenIcon />}>
                        <label htmlFor="fileInputMagnifier">
                            {keyword("button_localfile")}
                        </label>
                        <input id="fileInputMagnifier" type="file" hidden={true} onChange={e => {
                            setInput(URL.createObjectURL(e.target.files[0]))
                        }}/>
                    </Button>
                        
                </Box>
            </Card>

            <Box m={3} />

            {
                resultResult && resultResult !== "" &&
                <ImageResult/>
            }
        </div>
    )
};
export default Magnifier;