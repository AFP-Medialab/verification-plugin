import React from "react";
import {useSelector} from "react-redux";
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CustomTile from "../../utility/customTitle/customTitle";
import videoUrl from "./images/VideoURLmenu.png";
import insta from "./images/InstagramDemo.png";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        textAlign: "center",

    },
    card: {
        maxWidth: "300px",
        textAlign: "center",
    },
    media: {
        height: "auto",
        width: "auto",
        maxWidth: "60%",
    },
}));

const Tutorial = () => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Box justifyContent="center" display="flex" flexDirection="column">
                <CustomTile> {keyword("tuto_title")}  </CustomTile>
                <br/>
                <Typography variant="h3">{keyword("tuto_h_1")}</Typography>
                <Box item={"true"}>
                    <img src={videoUrl} alt={""}/>
                </Box>
                <Typography variant="body1">{keyword("tuto_1")}</Typography>

                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_2")}}></div>
                <Typography variant="body1">{keyword("tuto_3")}</Typography>

                <Box item={"true"}>
                    <img src={insta} alt={""}  className={classes.media}/>
                </Box>
                <h2>{keyword("tuto_h_2")}</h2>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_4")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_5")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_6")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_7")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_8")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_9")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_10")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_11")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_12")}}></div>
            </Box>
        </Paper>
    );
};
export default Tutorial;