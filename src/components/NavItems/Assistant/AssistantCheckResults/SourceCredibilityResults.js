import React from "react";
import {useSelector} from "react-redux";

import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import PublicIcon from "@material-ui/icons/Public";
import Typography from "@material-ui/core/Typography";

import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const SourceCredibilityResults = () => {

    const sourceCredibilityResults = useSelector(state => state.assistant.inputUrlSourceCredibility)
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    return (
        <List disablePadding={true}>
            {sourceCredibilityResults ?
                sourceCredibilityResults.map((value, key) => (
                    <ListItem key={key}>
                        <ListItemAvatar>
                            <Avatar variant={"square"}><PublicIcon fontSize={"large"}/> </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography component={"div"} align={"left"}>
                                    <Box fontWeight="fontWeightBold">
                                        {keyword("source_credibility_warning")}
                                    </Box>
                                </Typography>}
                            secondary={
                                <Typography>
                                    "{value.credibility_labels}" {keyword("according_to")} {value.credibility_source}
                                </Typography>}/>
                    </ListItem>))  :
                null
            }
        </List>
        )};
export default SourceCredibilityResults;