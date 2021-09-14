import React from "react";
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
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";


const OcrResult = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/OCR.tsv", tsv);

    const inputUrl = useSelector(state => state.ocr.url);
    const loading = useSelector(state => state.ocr.loading);
    const result = useSelector(state => state.ocr.result);
    const dispatch = useDispatch();

    const reversesearchYandex = function(url){
        let search_url = "https://yandex.com/images/search?rpt=imageview&from=tabbar&url=" + url;
        if (url !== "") {
            window.open(search_url);
        }
    };
    
    const reversesearchBing = function(url){
        let search_url = "https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIIRP&sbisrc=ImgDropper&q=imgurl:" + url;
        if (url !== "") {
            window.open(search_url);
        }
    };

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
                    <Card variant={"outlined"} style={{"width": "50%"}}>
                        <CardMedia>
                            <LinearProgress hidden={!loading}/>
                            <img crossOrigin={"anonymous"} src={inputUrl} height={"100%"} alt={inputUrl} width={"100%"}/>
                        </CardMedia>
                        <Divider variant={"middle"}/>
                        {result ?
                            result.length ?
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{fontWeight: "bold"}} align="left">Box</TableCell>
                                                <TableCell style={{fontWeight: "bold"}} align="left">Text</TableCell>
                                                <TableCell style={{fontWeight: "bold"}} align="left">Language</TableCell>
                                                <TableCell style={{fontWeight: "bold"}} align="left">Confidence(%)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {result.map((ocrResult, index) => (
                                                <TableRow key={index}>
                                                    <TableCell align="left">{index + 1}</TableCell>
                                                    <TableCell align="left">{ocrResult.text}</TableCell>
                                                    <TableCell align="left">{ocrResult.language.name}</TableCell>
                                                    <TableCell align="left">{(ocrResult.language.probability * 100).toFixed(2)}</TableCell>
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
                <Box m={2} />
                <Grid>
                    <OnClickInfo keyword={"ocr_tip"}/>
                </Grid>
                <Box m={2} />
                <Grid container justifyContent="center" spacing={5}
                                                alignContent={"center"}>
                        <Grid item>
                        <Button variant="contained" color={"primary"} onClick={() => reversesearchYandex(inputUrl)}>
                            {
                                keyword("ocr_search_yandex")
                            }
                        </Button>
                        </Grid>
                        <Grid item>
                        <Button variant="contained" color={"primary"} onClick={() => reversesearchBing(inputUrl)}>
                            {
                                keyword("ocr_search_bing")
                            }
                        </Button>
                        </Grid>
                    </Grid>

            </div>

        </Card>
    )
}

export default OcrResult;