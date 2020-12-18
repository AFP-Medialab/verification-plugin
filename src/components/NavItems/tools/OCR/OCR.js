import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from 'react-router-dom'

import {Box, Button, Paper, TextField, Typography} from "@material-ui/core";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import {KNOWN_LINKS} from "../../Assistant/AssistantRuleBook";
import {setError} from "../../../../redux/actions/errorActions";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/OCR.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

import {setOcrB64Img, setOcrInput} from "../../../../redux/actions/tools/ocrActions";
import OcrResult from "./Results/OcrResult";

const OCR = () => {

    const {url} = useParams();
    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/OCR.tsv", tsv);

    const ocrInputUrl = useSelector(state => state.ocr.url);
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
            canvas.getContext('2d').drawImage(uploadedImg, 0, 0);

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
        if (fail) {
            dispatch(setError(keyword("ocr_error")));
        }
    }, [fail])

    useEffect(() => {
        if (url && url !== KNOWN_LINKS.OWN) {
                const uri = (url !== null) ? decodeURIComponent(url) : undefined;
                setUserInput(uri);
                submitUrl(uri)
        }
    }, [url]);


    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile text={keyword("ocr_title")}/>
                <Box m={1}/>
                <TextField
                    id="standard-full-width"
                    label={keyword("ocr_urlbox")}
                    style={{margin: 8}}
                    placeholder={""}
                    fullWidth
                    value={userInput || ""}
                    onChange={e => setUserInput(e.target.value)}
                />
                <Button>
                    <label htmlFor="fileInputMagnifier">
                        <FolderOpenIcon/>
                        <Typography variant={"subtitle2"}>{keyword("button_localfile")}</Typography>
                    </label>
                    <input id="fileInputMagnifier" type="file" hidden={true} onChange={e => {
                        uploadImg(URL.createObjectURL(e.target.files[0]))
                    }}/>
                </Button>
                <Box m={2}/>
                <Button variant="contained" color="primary" onClick={() => submitUrl(userInput)}>
                    {keyword("button_submit") || ""}
                </Button>
            </Paper>

            {ocrInputUrl && !fail ? <OcrResult/> : null}

        </div>
    )
};
export default OCR;