import React from "react";
import {useDispatch, useSelector} from "react-redux";

import {Box, CardHeader, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";

import {submitInputUrl} from "../../../redux/actions/tools/assistantActions";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

import { submissionEvent } from "../../Shared/GoogleAnalytics/GoogleAnalytics";

const AssistantUrlSelected = (props) => {

    // styles, language, dispatch, params
    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    //form states
    const inputUrl = useSelector(state => state.assistant.inputUrl);
    const loading = useSelector(state => state.assistant.loading);

    //local state
    const formInput = props.formInput;
    const setFormInput = (value) => props.setFormInput(value);
    const cleanAssistant = () => props.cleanAssistant();

    const handleSubmissionURL = () => {
        dispatch(submitInputUrl(formInput));
        submissionEvent(formInput);
    };

    return (
        <Box my={3} boxShadow={3}>
            <Card variant={"outlined"}>
                <CardHeader
                    className={classes.assistantCardHeader}
                    title={
                        <Typography style={{fontWeight: "bold", fontSize: 20}}>
                            {keyword("assistant_give_url")}
                        </Typography>}
                />

                <LinearProgress color={"secondary"} hidden={!loading}/>

                <CardContent>
                    <Box mr={2}>
                        <Grid container>
                            <Grid item xs={10}>
                                <TextField
                                    variant="outlined"
                                    label={keyword("assistant_paste_url")}
                                    style={{margin: 8}}
                                    placeholder={""}
                                    fullWidth
                                    value={formInput || ""}
                                    onChange={e => setFormInput(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Box mt={2} ml={6}>
                                    {inputUrl === null ?
                                        <Button variant="contained" color="primary" onClick={
                                            handleSubmissionURL
                                        }>
                                            {keyword("button_analyse")}
                                        </Button> :
                                        <Button variant="contained" color="primary" onClick={() => cleanAssistant()}>
                                            {keyword("button_clean")}
                                        </Button>}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
};

export default AssistantUrlSelected;