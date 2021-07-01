import React from "react";
import {useSelector} from "react-redux";
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/Tutorial.tsv";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";

import popUpEn from "./images/popUpImage/popUp_EN.png";
import popUpFr from "./images/popUpImage/popUp_FR.png";
import popUpEs from "./images/popUpImage/popUp_ES.png";
import popUpEl from "./images/popUpImage/popUp_EL.png";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Accordion from "@material-ui/core/Accordion";


// from https://material-ui.com/customization/default-theme/
// used typography body 2 style
const dangerousDivStyle = {
    textAlign: "justify",
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    fontWeight: 40,
    fontSize: "1rem",
    lineHeight: 1.5,
    letterSpacing: "0.00938em"
};

const Tutorial = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/Tutorial.tsv", tsv);
    const language = useSelector(state => state.language);

    let popImg;
    switch (language) {
        case "fr":
            popImg = popUpFr;
            break;
        case "es":
            popImg = popUpEs;
            break;
        case "el":
            popImg = popUpEl;
        default:
            popImg = popUpEn;
            break;
    }


    return (
        <Paper className={classes.root}>
            <Box justifyContent="center" display="flex" flexDirection="column">
                <CustomTile text={keyword("tuto_title")}/>
                <Box m={1}/>
                <Typography variant="h3">{keyword("tuto_h_1")}</Typography>
                <Box m={2}/>
                <Box item={"true"}>
                    <img src={popImg} alt={""} className={classes.InteractiveMedia}/>
                </Box>
                <Box m={1}/>
                <div className={"content"} style={dangerousDivStyle}
                     dangerouslySetInnerHTML={{__html: keyword("tuto_1")}}></div>
                <div className={"content"} style={dangerousDivStyle}
                     dangerouslySetInnerHTML={{__html: keyword("tuto_2")}}></div>

                <Typography variant="body1">{keyword("tuto_3")}</Typography>
                <Box m={1}/>
                <Typography variant="h3">{keyword("tuto_h_2")}</Typography>
                <Box m={1}/>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>
                            {
                                keyword("analysis_title")
                            }
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={"content"} style={dangerousDivStyle}
                             dangerouslySetInnerHTML={{__html: keyword("tuto_4")}}></div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>
                            {
                                keyword("keyframes_title")
                            }
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={"content"} style={dangerousDivStyle}
                             dangerouslySetInnerHTML={{__html: keyword("tuto_5")}}></div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>
                            {
                                keyword("youtube_title")
                            }
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={"content"} style={dangerousDivStyle}
                             dangerouslySetInnerHTML={{__html: keyword("tuto_6")}}></div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>
                            {
                                keyword("twitter_title")
                            }
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={"content"} style={dangerousDivStyle}
                             dangerouslySetInnerHTML={{__html: keyword("tuto_7")}}></div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>
                            {
                                keyword("magnifier_title")
                            }
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={"content"} style={dangerousDivStyle}
                             dangerouslySetInnerHTML={{__html: keyword("tuto_8")}}></div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>
                            {
                                keyword("metadata_title")
                            }
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={"content"} style={dangerousDivStyle}
                             dangerouslySetInnerHTML={{__html: keyword("tuto_9")}}></div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>
                            {
                                keyword("copyright_title")
                            }
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={"content"} style={dangerousDivStyle}
                             dangerouslySetInnerHTML={{__html: keyword("tuto_10")}}></div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>
                            {
                                keyword("forensic_title")
                            }
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={"content"} style={dangerousDivStyle}
                             dangerouslySetInnerHTML={{__html: keyword("tuto_11")}}></div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>
                            {
                                keyword("twitter_sna_title")
                            }
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={"content"} style={dangerousDivStyle}
                             dangerouslySetInnerHTML={{__html: keyword("tuto_13")}}></div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>
                            {
                                keyword("contextual_menu_title")
                            }
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={"content"} style={dangerousDivStyle}
                             dangerouslySetInnerHTML={{__html: keyword("tuto_12")}}></div>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Paper>
    );
};
export default Tutorial;