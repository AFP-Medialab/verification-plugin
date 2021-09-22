import React, {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import history from "../../../../Shared/History/History";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";

import {cleanOcr} from "../../../../../redux/actions/tools/ocrActions";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/OCR.tsv";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import GTranslateIcon from '@material-ui/icons/GTranslate';
import TableBody from "@material-ui/core/TableBody";

const OcrResult = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/OCR.tsv", tsv);

    const inputUrl = useSelector(state => state.ocr.url);
    const loading = useSelector(state => state.ocr.loading);
    const result = useSelector(state => state.ocr.result);
    const dispatch = useDispatch();
    const canvas_ref = useRef();
    const card_ref = useRef();


    const reversesearchYandex = function (url) {
        let search_url = "https://yandex.com/images/search?rpt=imageview&from=tabbar&url=" + url;
        if (url !== "") {
            window.open(search_url);
        }
    };

    const reversesearchBing = function (url) {
        let search_url = "https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIIRP&sbisrc=ImgDropper&q=imgurl:" + url;
        if (url !== "") {
            window.open(search_url);
        }
    };

    const googleTranslate = function (text) {
        let translate_url = "https://translate.google.co.uk/?sl=auto&text=" + encodeURIComponent(text)  +"&op=translate"
        window.open(translate_url, "_blank")
    }

    const generateImageCanvas = () => {
        const canvas = canvas_ref.current
        const context = canvas.getContext('2d')
        let img = new Image()

        img.onload = () => {
            let img_width = (card_ref.current.offsetWidth/2)
            let img_scale = img_width/img.width
            let img_height = Math.ceil(img.height * img_scale)
            
            img.width = img_width
            img.height = img_height

            canvas.width = img_width
            canvas.height = img_height

            context.drawImage(img, 0, 0, img_width, img_height)

            context.strokeStyle = 'red'
            context.lineWidth = 3
            context.fillStyle = 'black'
            context.font = 'bold 20px serif'

            if (result && result.length) {
                result.map((text, index) => {
                    let bounding_box = text.bounding_box
                    // we are assuming that the first co-ordinate is the top left hand corner
                    let x = bounding_box[0][0] * img_scale ;
                    let y = bounding_box[0][1] * img_scale;

                    // and the third is the bottom right so we can use that to work out width and height
                    let w = (bounding_box[2][0] * img_scale) - x;
                    let h = (bounding_box[2][1] * img_scale) - y;


                    context.strokeRect(x, y, w, h)
                    context.strokeText(index + 1, x + 3, y + 25)
                    context.fillText(index + 1, x + 3, y + 25)
                    return context
                })
            }
        }
        img.src = inputUrl
    }

    window.addEventListener("resize", generateImageCanvas)

    // rebuild image with bounding boxes if result changes
    useEffect(() => {
        generateImageCanvas()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result, inputUrl])


    return (
        <Card>
            <CardHeader
                title={keyword("cardheader_results")}
                className={classes.headerUpladedImage}
            />

            <div className={classes.root2}>
                <CloseResult onClick={() => {
                    dispatch(cleanOcr())
                    history.push("/app/tools/ocr");
                }}/>
                <Grid container justifyContent={"center"}>
                    <Card ref={card_ref} variant={"outlined"} style={{"width": "60%"}}>
                        <CardMedia>
                            <LinearProgress hidden={!loading}/>
                            <canvas ref={canvas_ref}/>
                        </CardMedia>
                        <Divider variant={"middle"}/>
                        {result  ?
                            result.bounding_boxes.length ?
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{fontWeight: "bold"}} align="left">{keyword("table_box")}</TableCell>
                                                <TableCell style={{fontWeight: "bold"}} align="left">{keyword("table_text")}</TableCell>
                                                <TableCell style={{fontWeight: "bold"}} align="left">{keyword("table_language")} {keyword("table_confidence")}</TableCell>
                                                <TableCell style={{fontWeight: "bold"}} align="left">{keyword("table_script")} {keyword("table_confidence")}</TableCell>
                                                <TableCell style={{fontWeight: "bold"}} align="left">{keyword("table_translate")}</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {result.bounding_boxes.map((ocrResult, index) => (
                                                <TableRow key={index}>
                                                    <TableCell align="left">{index + 1}</TableCell>
                                                    <TableCell align="left">{ocrResult.text}</TableCell>
                                                    <TableCell align="left">
                                                        {ocrResult.language.name} ({(ocrResult.language.probability * 100).toFixed(2)})
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {(ocrResult.script.name)} ({(ocrResult.script.probability * 100).toFixed(2)})
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <IconButton onClick={()=>googleTranslate(ocrResult.text)}>
                                                            <GTranslateIcon color={"action"}/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                :<Typography variant={"h5"}>{keyword("ocr_no_text")}</Typography>
                            :null
                        }
                    </Card>
                </Grid>
                <Box m={2}/>
                <Grid>
                    <OnClickInfo keyword={"ocr_tip"}/>
                </Grid>
                <Box m={2}/>
                <Grid container justifyContent="center" spacing={5} alignContent={"center"}>
                    <Grid item>
                        <Button variant="contained" color={"primary"} onClick={() => reversesearchYandex(inputUrl)}>
                            {keyword("ocr_search_yandex")}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color={"primary"} onClick={() => reversesearchBing(inputUrl)}>
                            {keyword("ocr_search_bing")}
                        </Button>
                    </Grid>
                </Grid>

            </div>

        </Card>
    )
}
export default OcrResult;