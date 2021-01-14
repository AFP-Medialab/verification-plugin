import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import history from "../../../../Shared/History/History";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";

import {cleanOcr} from "../../../../../redux/actions/tools/ocrActions";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/OCR.tsv";

const OcrResult = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/OCR.tsv", tsv);

    const inputUrl = useSelector(state => state.ocr.url);
    const loading = useSelector(state => state.ocr.loading);
    const result = useSelector(state => state.ocr.result);
    const dispatch = useDispatch();

    return (
        <Paper className={classes.root}>
            <CloseResult onClick={() => {
                dispatch(cleanOcr())
                history.push("/app/tools/ocr");
            }}/>
            <Grid container justify={"center"}>
                <Card variant={"outlined"} style={{"width": "50%"}}>
                    <CardMedia>
                        <LinearProgress hidden={!loading}/>
                        <img src={inputUrl} height={"100%"} alt={inputUrl} width={"100%"}/>
                    </CardMedia>
                    <Divider variant={"middle"}/>
                    {result ?
                        <CardActions style={{justifyContent: 'center'}}>
                            <Typography variant={"h5"}>
                                {result === "ocr_no_text" ? keyword("ocr_no_text") : result}
                            </Typography>
                        </CardActions> :
                        null
                    }
                </Card>
            </Grid>
            <Grid>
                <OnClickInfo keyword={"ocr_tip"}/>
            </Grid>
        </Paper>
    )
}

export default OcrResult;