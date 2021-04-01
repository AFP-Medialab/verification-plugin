import React from "react";
import {useDispatch, useSelector} from "react-redux";

import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import {Box, CardHeader, TextField} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";

import {submitInputUrl} from "../../../redux/actions/tools/assistantActions";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const AssistantUrlSelected = (props) => {

    // styles, language, dispatch, params
    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    //form states
    const inputUrl = useSelector(state => state.assistant.inputUrl);
    const loading = useSelector(state => state.assistant.loading)

    //local state
    const formInput = props.formInput
    const setFormInput = (value) => props.setFormInput(value)
    const cleanAssistant = () => props.cleanAssistant()

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
                        <TextField
                            id="standard-full-width"
                            variant="outlined"
                            label={keyword("assistant_paste_url")}
                            style={{margin: 8}}
                            placeholder={""}
                            fullWidth
                            value={formInput || ""}
                            onChange={e => setFormInput(e.target.value)}
                            InputProps={{
                                endAdornment: inputUrl ?
                                    <InputAdornment>
                                        <IconButton
                                            color={"secondary"}
                                            fontSize={"default"}
                                            onClick={() => cleanAssistant()}>
                                            <CancelIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                    :
                                    <InputAdornment variant={"filled"}>
                                        <IconButton color={"secondary"} onClick={() => {
                                            dispatch(submitInputUrl(formInput))
                                        }}>
                                            <ArrowForwardIcon/>
                                        </IconButton>
                                    </InputAdornment>
                            }}
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
};

export default AssistantUrlSelected;