import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {CardContent, TextField} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import FileCopyOutlined from "@material-ui/icons/FileCopy"
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import TranslateIcon from '@material-ui/icons/Translate';
import Typography from "@material-ui/core/Typography";
import {WarningOutlined} from "@material-ui/icons";

import tsv from "../../../../../LocalDictionary/components/NavItems/tools/OCR.tsv";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import {setError} from "../../../../../redux/actions/errorActions";
import {
    cleanOcr,
    loadOcrScripts,
    setOcrReprocess,
    setReprocessOpen,
    setSelectedScript
} from "../../../../../redux/actions/tools/ocrActions";



const OcrResult = () => {

    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/OCR.tsv", tsv);

    const inputUrl = useSelector(state => state.ocr.url);
    const loading = useSelector(state => state.ocr.loading);
    const reprocessLoading = useSelector(state => state.ocr.reprocessBlockLoading)
    const result = useSelector(state => state.ocr.result);
    const fullText = useSelector(state => state.ocr.fullText)
    const fail = useSelector(state => state.ocr.fail);
    const errorKey = useSelector(state => state.ocr.errorKey);
    const scripts = useSelector(state => state.ocr.scripts)
    const selectedScript = useSelector(state => state.ocr.selectedScript)
    const reprocessBlockOpen = useSelector(state => state.ocr.reprocessBlockOpen)


    const [tooltipOpen, setTooltipOpen] = useState(false)
    const [tooltipIndex, setTooltipIndex] = useState(0)
    const [reprocessBlockSelected, selectReprocessBlock] = useState(null)

    const canvasPrefix = "cropCanvas"
    const imgPrefix = "cropImage"
    const mainCanvasId = "ocrMainCanvasId"
    const mainImageId = "ocrMainImageId"

    if (!scripts) {
        dispatch(loadOcrScripts())
    }

    const handleScriptChange = (event) => {
        dispatch(setSelectedScript(event.target.value))
    };

    // draw bounding boxes on image
    const drawBoundingBoxes = (boundingBoxes) => {
        const img = document.getElementById(mainImageId)
        const canvas = document.getElementById(mainCanvasId)

        const context = canvas.getContext("2d")

        img.onload = () => {
            canvas.height = img.height
            canvas.width = img.width

            let img_scale = img.width / img.naturalWidth

            boundingBoxes.map((text, index) => {
                let boundingBox = text.bounding_box

                // the first co-ordinate is the top left hand corner
                let x = boundingBox[0][0] * img_scale;
                let y = boundingBox[0][1] * img_scale;

                // and the third is the bottom right so we can use that to work out width and height
                let w = (boundingBox[2][0] * img_scale) - x;
                let h = (boundingBox[2][1] * img_scale) - y;

                context.strokeStyle = 'lime'
                context.fillStyle = 'lime'
                context.lineWidth = 3
                context.strokeRect(x, y, w, h)

                context.strokeStyle = "red"
                context.fillStyle = "red"
                context.font = '20px serif'
                context.strokeText(index + 1, x + 3, y + 25)
                return 0
            })
        }

        img.src = inputUrl
    }


    // crop given image to display only the part in the given bounding box
    const cropImage = (img, boundingBox, index) => {
        // element 0 has top left hand coords of bounding boxes
        let x = boundingBox[0][0];
        let y = boundingBox[0][1];

        // element 2 has bottom right hand coords. hence width/height easy to do.
        let width = (boundingBox[2][0]) - x;
        let height = (boundingBox[2][1]) - y;

        // adjusting size to fit image size on UI rather than orig image size
        let scaleFactor = img.width / img.naturalWidth
        let scaledWidth = width * scaleFactor
        let scaledHeight = height * scaleFactor

        // get the canvas we should be redrawing on
        let drawingCanvas = document.getElementById(canvasPrefix + index)
        let context = drawingCanvas.getContext("2d")

        // and draw the relevant part of the image, scaled to the right size
        drawingCanvas.height = scaledHeight
        drawingCanvas.width = scaledWidth
        drawingCanvas.style.border = "3px solid lime"
        context.drawImage(img, x, y, width, height, 0, 0, scaledWidth, scaledHeight)

        img.hidden = true
    }

    // if the image (or really pixel) size changes, the bounding boxes and image crops need recalculation
    const handleImageResizing = () => {
        if (result && result.bounding_boxes.length) {
            drawBoundingBoxes(result.bounding_boxes)
            result.bounding_boxes.map((text, index) => {
                let img = document.getElementById(imgPrefix + index)
                img.hidden = false
                let bbox = text.bounding_box
                cropImage(img, bbox, index)
                return 0
            })
        }
    }

    // forward text on to google translate
    const googleTranslate = function (text) {
        let translate_url = "https://translate.google.co.uk/?sl=auto&text=" + encodeURIComponent(text) + "&op=translate"
        window.open(translate_url, "_blank")
    }


    //copy text to clipboard
    const copyText = (text) => {
        navigator.clipboard.writeText(text)
    }

    useEffect(() => {
        let error_message_key = errorKey ? errorKey : "ocr_error"
        if (fail) {
            dispatch(setError(keyword(error_message_key)));
            dispatch(cleanOcr())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fail, errorKey])

    // when the result comes in, draw the bounding boxes and add the event listener for changes to image size
    useEffect(() => {
        if (result && result.bounding_boxes.length) {
            drawBoundingBoxes(result.bounding_boxes)

            //add and remove listener on result change: react state variables don't update on native DOM listeners!
            window.addEventListener('resize', handleImageResizing);
            return () => {
                console.log("removing")
                window.removeEventListener('resize', handleImageResizing)
            };
        }
        // eslint-disable-next-line
    }, [result])


    return (
        <Grid container spacing={4}>
            <Grid item xs={6}>
                <Grid container spacing={2} direction={"column"}>
                    <Grid item xs={12}>
                        <Card variant={"outlined"}>
                            <CardHeader
                                title={keyword("image_analysed")}>
                            </CardHeader>
                            <LinearProgress hidden={!loading}/>
                            <CardContent className={classes.ocrImageCard}>
                                <div className={classes.ocrImageDiv}>
                                    <img id={mainImageId}
                                         crossOrigin={"anonymous"}
                                         className={classes.ocrImage}
                                         src={inputUrl}
                                         alt={"input for ocr"}
                                    >
                                    </img>
                                    <canvas id={mainCanvasId} className={classes.ocrImageCanvas}/>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} hidden={!fullText}>
                        <Card>
                            <CardHeader
                                title={keyword("complete_text")}>
                            </CardHeader>
                            <CardContent>
                                <Typography>
                                    {fullText}
                                </Typography>

                                <Box mt={4}>

                                    <Tooltip open={tooltipIndex === -1 && tooltipOpen}
                                             disableFocusListener
                                             disableHoverListener
                                             disableTouchListener
                                             title={keyword("tooltip_copy")}>
                                        <Button style={{"marginRight": "2%", "borderWidth": "medium", "width": "49%"}}
                                                variant={"outlined"}
                                                color={"primary"}
                                                size={"large"}
                                                onClick={() => {
                                                    setTooltipIndex(-1)
                                                    setTooltipOpen(true)
                                                    copyText(fullText)
                                                    setTimeout(() => {
                                                        setTooltipOpen(false)
                                                    }, 1000)
                                                }}>
                                            <FileCopyOutlined
                                                style={{"marginRight": "10px"}}/>{keyword("copy_to_clipboard")}
                                        </Button>
                                    </Tooltip>

                                    <Button className={classes.ocrButton}
                                            variant={"outlined"}
                                            color={"primary"}
                                            size={"large"}
                                            onClick={() => {
                                                googleTranslate(fullText)
                                            }}>
                                        <TranslateIcon style={{"marginRight": "10px"}}/>{keyword("translate")}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={6} hidden={!result}>
                <Card>
                    <CardHeader
                        title={keyword("blocks")}>
                    </CardHeader>

                    {result && result.bounding_boxes && result.bounding_boxes.length ?
                        <CardContent>
                            {result.bounding_boxes.map((ocrResult, index) => (
                                <Grid container spacing={2} key={index}>

                                    {index > 0 ?
                                        <Grid item xs={12}>
                                            <Divider/>
                                            <Box m={2}/>
                                        </Grid>
                                        :
                                        <Grid item xs={12}>
                                            <Box m={1}/>
                                        </Grid>
                                    }

                                    <Grid item xs={6}>
                                        <img id={imgPrefix + index}
                                             alt={"bounding box" + index}
                                             src={inputUrl}
                                             width={"100%"}
                                             onLoad={(imgEvent) =>
                                                 cropImage(imgEvent.target, ocrResult.bounding_box, index)}

                                        />
                                        <canvas id={canvasPrefix + index}/>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography>{ocrResult.text}</Typography>
                                    </Grid>

                                    <Grid item xs={12} className={classes.displayFlex}>
                                        <Grid item xs={6} className={classes.ocrActionAreaLeft}>
                                            <Typography variant={"subtitle1"} className={classes.fontBold}>
                                                {ocrResult.language.name}
                                                <IconButton
                                                    style={{visibility: "hidden"}}
                                                    onClick={() => {
                                                                if (index === reprocessBlockSelected) {
                                                                    dispatch(setReprocessOpen(!reprocessBlockOpen))
                                                                } else {
                                                                    dispatch(setReprocessOpen(true))
                                                                    selectReprocessBlock(index)
                                                                }
                                                            }}>
                                                    <WarningOutlined color={"primary"}/>
                                                </IconButton>
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6} className={classes.ocrActionAreaRight}>

                                            <Tooltip open={tooltipIndex === index && tooltipOpen}
                                                     className={classes.assistantTooltip}
                                                     disableFocusListener
                                                     disableHoverListener
                                                     disableTouchListener
                                                     title={keyword("tooltip_copy")}>
                                                <IconButton onClick={() => {
                                                    copyText(ocrResult.text)
                                                    setTooltipIndex(index)
                                                    setTooltipOpen(true)
                                                    setTimeout(() => {
                                                        setTooltipOpen(false)
                                                    }, 1000)
                                                }}>
                                                    <FileCopyOutlined color={"primary"}/>
                                                </IconButton>
                                            </Tooltip>
                                            <IconButton onClick={() => googleTranslate(ocrResult.text)}>
                                                <TranslateIcon color={"primary"}/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}
                                          hidden={!(index === reprocessBlockSelected && reprocessBlockOpen)}>
                                        <Card className={classes.ocrReprocessBox}>
                                            <LinearProgress hidden={!reprocessLoading}/>

                                            <Typography variant={"subtitle1"}>
                                                {keyword("reprocess_text")}
                                            </Typography>
                                            <Box m={3}/>

                                            {scripts ?
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <TextField fullWidth select variant={"outlined"}
                                                                   label={keyword("ocr_script_label")}
                                                                   value={selectedScript}
                                                                   onChange={(e) => handleScriptChange(e)}
                                                        >
                                                            {Object.keys(scripts).map(code =>
                                                                <MenuItem key={code}
                                                                          value={code}>{scripts[code]}</MenuItem>)
                                                            }
                                                        </TextField>
                                                    </Grid>

                                                    <Grid item xs={6}>
                                                        <Box m={1}/>
                                                        <Button size={"large"}
                                                                variant={"contained"}
                                                                color={"primary"}
                                                                onClick={() => dispatch(setOcrReprocess(ocrResult.bounding_box))}
                                                        >
                                                            {keyword("reprocess_button")}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                : null
                                            }
                                        </Card>
                                    </Grid>

                                </Grid>
                            ))}
                        </CardContent>
                        :
                        <CardContent>
                            <Typography variant={"h5"}>{keyword("ocr_no_text")}</Typography>
                        </CardContent>
                    }
                </Card>
            </Grid>
        </Grid>
    )
}
export default OcrResult;