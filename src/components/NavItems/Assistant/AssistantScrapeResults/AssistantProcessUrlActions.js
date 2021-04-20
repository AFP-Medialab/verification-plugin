import React from "react";
import {useSelector} from "react-redux";

import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

import history from "../../../Shared/History/History";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Divider from "@material-ui/core/Divider";
import {KNOWN_LINKS} from "../AssistantRuleBook";

const AssistantProcessUrlActions = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    const inputUrl = useSelector(state => state.assistant.inputUrl);
    const processUrl = useSelector(state => state.assistant.processUrl);
    const contentType = useSelector(state => state.assistant.processUrlType);
    const processUrlActions = useSelector(state => state.assistant.processUrlActions);

    const handleClick = (path, resultUrl) => {
        if (resultUrl != null) {
            history.push("/app/" + path + "/" + encodeURIComponent(resultUrl) + "/" + contentType)
        } else {
            history.push("/app/" + path + "/" + KNOWN_LINKS.OWN + "/" + contentType)
        }
    };

    return (
        processUrlActions.length > 0 ?
            <div>
                <Typography align={"left"} variant={"h5"}>{keyword("things_you_can_do_header")}</Typography>
                <Typography align={"left"} variant={"subtitle2"}>{keyword("things_you_can_do")}</Typography>
                <Divider/>
                <List>
                    {processUrlActions.map((action, index) => {
                        return (
                            <Box m={2} key={index} >
                                <Card className={classes.assistantHover} variant={"outlined"}>
                                    <ListItem
                                        onClick={() => handleClick(action.path, action.useInputUrl ? inputUrl : processUrl)}>
                                        <ListItemAvatar>
                                            <Avatar variant={"square"} src={action.icon}/>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography component={"span"}>
                                                    <Box fontWeight="fontWeightBold">
                                                        {keyword(action.title)}
                                                    </Box>
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography color={"textSecondary"} component={"span"}>
                                                    <Box fontStyle="italic">{keyword(action.text)}</Box>
                                                </Typography>
                                            }/>
                                    </ListItem>
                                </Card>
                            </Box>
                        )
                    })}
                </List>
            </div>
            : null
    );
};
export default AssistantProcessUrlActions;