import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CustomTile from "../customTitle/customTitle";
import {Image} from "@material-ui/icons";
import europeImage from "./images/logo_EUh2020_horizontal.png"
import itiImage from "./images/iti.jpg"
import afpImage from "./images/Logo-AFP-384.png"
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {toggleHumanRightsCheckBox, toggleUnlockExplanationCheckBox} from "../../redux/actions"

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

const About = () => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const humanRights = useSelector(state => state.humanRightsCheckBox);
    const interactiveExplanation = useSelector(state => state.interactiveExplanation);
    const dispatch = useDispatch();

    const content = () => {
        let res = [];
        let cpt = 1;
        while (keyword("about_" + cpt) !== undefined){
            res.push(keyword("about_" + cpt))
            cpt++;
        }
        return res;
    };

    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Box justifyContent="center" display="flex" flexDirection="column" align={"center"} >
                <CustomTile> {keyword("about_title")}  </CustomTile>
                <br/>

                {
                    content().map((value, key) => {
                        return (
                            <div className={"content"} key={key} dangerouslySetInnerHTML={{__html: value}}></div>
                        )
                    })
                }
            </Box>
            <img className={classes.media} src={afpImage}/>
            <Box m={1}/>
            <img className={classes.media} src={itiImage}/>
            <img className={classes.media} src={europeImage}/>
            <Box m={1}/>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={humanRights}
                        onChange={() => dispatch(toggleHumanRightsCheckBox())}
                        value="checkedBox"
                        color="primary"
                    />
                }
                label={keyword("about_human_rights")}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={interactiveExplanation}
                        onChange={() => dispatch(toggleUnlockExplanationCheckBox())}
                        value="checkedBox"
                        color="primary"
                    />
                }
                label={keyword("quiz_unlock_explanations")}
            />
        </Paper>
    );
};
export default About;