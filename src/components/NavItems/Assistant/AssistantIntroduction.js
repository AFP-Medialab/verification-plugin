import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {Box, CardHeader} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import HelpDialog from "../../Shared/HelpDialog/HelpDialog";
import Icon from "@material-ui/core/Icon";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import LinkIcon from '@material-ui/icons/Link';
import Typography from "@material-ui/core/Typography";

import assistantIcon from "../../NavBar/images/navbar/assistant-icon-primary.svg";
import {setImageVideoSelected, setUrlMode} from "../../../redux/actions/tools/assistantActions";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";


const AssistantIntroduction = (props) => {

    // styles, language, dispatch, params
    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    //form states
    const urlMode = useSelector(state => state.assistant.urlMode);
    const imageVideoSelected = useSelector(state => state.assistant.imageVideoSelected);

    //local state
    const [useLinkHoverColour, setUseLinkHoverColour] = useState(false)
    const [useFileHoverColour, setUseFileHoverColour] = useState(false)
    const cleanAssistant = () => props.cleanAssistant()


    return (
        <Grid item xs={12} className={classes.assistantGrid}>

            <Typography variant={"h4"} color={"primary"}>
                <Icon><img className={classes.svgIcon} src={assistantIcon} alt={""}/></Icon>
                {keyword("assistant_title")}
            </Typography>

            <Box m={1}/>

            <Typography>
                {keyword("assistant_intro")}
            </Typography>

            <Box m={4}/>

            <Box boxShadow={3}>
                <Card variant={"outlined"}>
                    <CardHeader
                        className={classes.assistantCardHeader}
                        title={
                            <Typography style={{fontWeight: "bold", fontSize: 20}}>
                                {keyword("assistant_choose")}
                            </Typography>}
                        action={
                            <div style={{"display": "flex", "marginTop": 10}}>
                                {<HelpDialog
                                    title={"assistant_help_title"}
                                    paragraphs={[
                                        "assistant_help_1",
                                        "assistant_help_2",
                                        "assistant_help_3",
                                        "assistant_help_4"
                                    ]}
                                    keywordFile="components/NavItems/tools/Assistant.tsv"/>}
                            </div>
                        }
                    />
                    <CardContent>
                        <Box m={2}>
                            <Grid container spacing={5}>
                                <Grid item xs={6}>
                                    <Card variant={"outlined"}
                                          className={urlMode ? classes.assistantSelected : classes.assistantHover}
                                          onMouseOver={() => {setUseLinkHoverColour(true)}}
                                          onMouseOut={() => setUseLinkHoverColour(false)}
                                          style={{height: 250, borderWidth: 3}}
                                          onClick={() => {
                                              window.scroll({top: 400,left: 0,behavior: 'smooth'});
                                              cleanAssistant()
                                              dispatch(setUrlMode(!urlMode))
                                          }}
                                    >
                                        <Box my={3}>
                                            <Box color={"gray"}>
                                                <LinkIcon
                                                    fontSize={"large"}
                                                    style={{height: 80, width: "100%",}}
                                                    color={useLinkHoverColour || urlMode ? "primary" : "inherit"}
                                                />
                                            </Box>
                                            <Box m={1}>
                                                <Typography variant={"h6"}
                                                            style={{fontWeight: "bold"}}
                                                            align={"center"}>
                                                    {keyword("assistant_webpage_header")}
                                                </Typography>
                                            </Box>

                                            <Box mx={5}>
                                                <Typography align={"center"}>
                                                    {keyword("assistant_webpage_text")}
                                                </Typography>
                                            </Box>

                                        </Box>
                                    </Card>
                                </Grid>

                                <Grid item xs={6}>
                                    <Card variant={"outlined"}
                                          className={imageVideoSelected ? classes.assistantSelected : classes.assistantHover}
                                          style={{height: 250, borderWidth: 3}}
                                          onMouseOver={() => {setUseFileHoverColour(true)}}
                                          onMouseOut={() => setUseFileHoverColour(false)}
                                          onClick={() => {
                                              setTimeout(function () { window.scroll({ top: 520, left: 0, behavior: 'smooth' });}, 100);
                                              
                                              cleanAssistant()
                                              dispatch(setImageVideoSelected(!imageVideoSelected))
                                          }}
                                    >
                                        <Box my={3}>
                                            <Box color={"gray"}>
                                                <InsertDriveFileIcon
                                                    fontSize={"large"}
                                                    style={{height: 80, width: "100%"}}
                                                    color={useFileHoverColour || imageVideoSelected ? "primary" : "inherit"}
                                                />
                                            </Box>

                                            <Box m={1}>
                                                <Typography variant={"h6"} style={{fontWeight: "bold"}}
                                                            align={"center"}>
                                                    {keyword("assistant_file_header")}
                                                </Typography>
                                            </Box>

                                            <Box mx={5}>
                                                <Typography align={"center"}>
                                                    {keyword("assistant_file_text")}
                                                </Typography>
                                            </Box>

                                        </Box>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Grid>
    )
};

export default AssistantIntroduction;