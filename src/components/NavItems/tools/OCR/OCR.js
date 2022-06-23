import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from 'react-router-dom'

import {KNOWN_LINKS} from "../../Assistant/AssistantRuleBook";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/OCR.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

import {
    cleanOcr,
    setOcrBinaryImage,
    setOcrErrorKey,
    setOcrInput,
    setOcrResult,
    setb64InputFile
} from "../../../../redux/actions/tools/ocrActions";
import OcrResult from "./Results/OcrResult";

import {Box, Button, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import {ReactComponent as OCRIcon} from '../../../NavBar/images/SVG/Image/OCR.svg';
import Grid from "@material-ui/core/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import { submissionEvent } from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import _ from "lodash";

const OCR = () => {

    const {url} = useParams();
    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/OCR.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsv);

    const ocrInputUrl = useSelector(state => state.ocr.url);
    const selectedScript = useSelector(state => state.ocr.selectedScript)
    const result = useSelector(state => state.ocr.result);

    const [userInput, setUserInput] = useState(ocrInputUrl);


    const submitUrl = (src) => {
        submissionEvent(src);
        dispatch(setOcrInput(src, selectedScript))
    };

    const handleUploadImg = (file) => {
        if (file.size >= 4000000) {
            dispatch(setOcrErrorKey("ocr_too_big"))
            dispatch(setOcrResult(false, true, false, null))
        } else {
            let reader = new FileReader()
            let localurl = URL.createObjectURL(file)
            setUserInput(localurl)
            reader.onload = () => {
                dispatch(setOcrBinaryImage(reader.result))
            }
            reader.readAsBinaryString(file)
            let img = new Image();
            img.crossOrigin="anonymous"
            img.onload = () => {
                let canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
                dispatch(setb64InputFile(canvas.toDataURL('image/png')))
                // Get raw image data
                canvas.remove();
            };
        img.src = localurl
        }
    }

    const localImage = (src) => {
        let img = new Image();
        img.crossOrigin="anonymous"
        fetch(src).then((r) => {
            return  r.blob()
        }).then((blob) => {
            let url = URL.createObjectURL(blob)
            setUserInput(url);
            let reader = new FileReader()
            reader.readAsBinaryString(blob)
            reader.onloadend = () => {
                var base64String = reader.result;
                dispatch(setOcrBinaryImage(base64String))
                submitUrl(url)
            }
        });
        img.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            // Get raw image data
            dispatch(setb64InputFile(canvas.toDataURL('image/png')))
            canvas.remove();
        };
        img.src = src;
    };

    // store any changes to the input text box to local state
    useEffect(() => {
        if (!ocrInputUrl) {
            setUserInput(undefined)
        }
    }, [ocrInputUrl]);


    // automatically run if url param in current page url
    useEffect(() => {
        if (url && url !== KNOWN_LINKS.OWN) {
            const uri = (url !== null) ? decodeURIComponent(url) : undefined;
           
            if(!uri.startsWith("http")){
                localImage(uri)
            }
            else {
                setUserInput(uri);
                submitUrl(uri)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);


    return (
        <div>
            <HeaderTool name={keywordAllTools("navbar_ocr")} description={keywordAllTools("navbar_ocr_description")}
                        icon={<OCRIcon style={{fill: "#51A5B2"}}/>}/>

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
                                label={keyword("ocr_urlbox")}
                                placeholder={keyword("ocr_urlbox_placeholder")}
                                fullWidth
                                value={userInput || ""}
                                variant="outlined"
                                onChange={e => setUserInput(e.target.value)}
                            />
                        </Grid>

                        <Grid item>
                            {!result ?
                                <Button variant="contained" color="primary" onClick={() => {
                                                                                            if(!_.isUndefined(userInput))
                                                                                                submitUrl(userInput)
                                                                                            }}>
                                    {keyword("button_submit") || ""}
                                </Button>
                                :
                                <Button variant="contained" color="primary" onClick={() => dispatch(cleanOcr())}>
                                    {keyword("button_remove")}
                                </Button>
                            }
                        </Grid>

                    </Grid>

                    <Box m={2}/>
                    <Button startIcon={<FolderOpenIcon/>}>
                        <label htmlFor="fileInputMagnifier">
                            {keyword("button_localfile")}
                        </label>
                        <input id="fileInputMagnifier" type="file" hidden={true} onChange={e => {
                            handleUploadImg(e.target.files[0])
                        }}/>
                    </Button>
                </Box>
            </Card>

            <Box m={3}/>

            {ocrInputUrl ? <OcrResult/> : null}
        </div>
    )
};
export default OCR;