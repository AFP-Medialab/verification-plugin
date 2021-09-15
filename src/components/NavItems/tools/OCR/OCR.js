import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from 'react-router-dom'

import {Box, Button, TextField} from "@material-ui/core";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

import {KNOWN_LINKS} from "../../Assistant/AssistantRuleBook";
import {setError} from "../../../../redux/actions/errorActions";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/OCR.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

import {cleanOcr, setOcrB64Img, setOcrInput} from "../../../../redux/actions/tools/ocrActions";
import OcrResult from "./Results/OcrResult";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as OCRIcon } from '../../../NavBar/images/SVG/Image/OCR.svg';
import Grid from "@material-ui/core/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";

//todo: scale image, fix incorrect image size check and move away from img-b64-img
const OCR = () => {

    const {url} = useParams();
    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/OCR.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsv);

    const ocrInputUrl = useSelector(state => state.ocr.url);
    const errorKey = useSelector(state => state.ocr.errorKey);
    const fail = useSelector(state => state.ocr.fail);

    const [userInput, setUserInput] = useState(ocrInputUrl);

    const submitUrl = (src) => {
        dispatch(setOcrInput(src))
    };

    const uploadImg = (localFile) => {
        let uploadedImg = new Image();

        uploadedImg.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = uploadedImg.naturalWidth
            canvas.height = uploadedImg.naturalHeight

            let canvas_context = canvas.getContext("2d")
            // canvas_context.scale(0.75, 0.75)
            canvas_context.drawImage(uploadedImg, 0, 0);
            // canvas.getContext('2d').drawImage(uploadedImg, 0, 0);

            dispatch(setOcrB64Img(canvas.toDataURL('image/png')))
            canvas.remove();
        };

        uploadedImg.onerror = () => {
            dispatch(setError(keyword("ocr_error")));
        };

        uploadedImg.src = localFile;
        setUserInput(localFile)
    }

    useEffect(() => {
        if (!ocrInputUrl) {
            setUserInput(undefined)
        }
    }, [ocrInputUrl]);

    useEffect(() => {
        let error_message_key = errorKey ? errorKey : "ocr_error"
        if (fail) {
            dispatch(setError(keyword(error_message_key)));
            dispatch(cleanOcr())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fail, errorKey])

    useEffect(() => {
        if (url && url !== KNOWN_LINKS.OWN) {
                const uri = (url !== null) ? decodeURIComponent(url) : undefined;
                setUserInput(uri);
                submitUrl(uri)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);


    return (
        <div>
            <HeaderTool name={keywordAllTools("navbar_ocr")} description={keywordAllTools("navbar_ocr_description")} icon={<OCRIcon style={{ fill: "#51A5B2" }} />} />

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
                            <Button variant="contained" color="primary" onClick={() => submitUrl(userInput)}>
                                {keyword("button_submit") || ""}
                            </Button>

                        </Grid>

                    </Grid>

                    <Box m={2} />
                    
                    <Button startIcon={<FolderOpenIcon />} >
                        <label htmlFor="fileInputMagnifier">
                            {keyword("button_localfile")}
                        </label>
                        <input id="fileInputMagnifier" type="file" hidden={true} onChange={e => {
                            uploadImg(URL.createObjectURL(e.target.files[0]))
                        }}/>
                    </Button>
                    

                </Box>
            </Card>

            <Box m={3} />

            {ocrInputUrl && !fail ? <OcrResult/> : null}
        </div>
    )
};
export default OCR;