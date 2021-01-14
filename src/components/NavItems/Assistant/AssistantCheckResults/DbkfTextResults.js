import React from "react";

import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import Typography from "@material-ui/core/Typography";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import {useSelector} from "react-redux";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";

const DbkfTextResults = () => {

    const uiUrl = process.env.REACT_APP_DBKF_UI
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const dbkfTextMatch = useSelector(state => state.assistant.dbkfTextMatch)

    return (
        <List disablePadding={true}>
            {dbkfTextMatch ?
                dbkfTextMatch.map((value, key) => (
                    <ListItem key={key}>
                        <ListItemAvatar>
                            <Avatar variant={"square"}><TextFieldsIcon fontSize={"large"}/> </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography component={"div"} align={"left"}>
                                    <Box fontWeight="fontWeightBold">
                                        {keyword("dbkf_text_warning")}
                                    </Box>
                                </Typography>}
                            secondary={
                                <a href={uiUrl + value.claimUrl} key={key} target="_blank"
                                   rel="noopener noreferrer">
                                    {value.text}
                                </a>
                            }/>
                    </ListItem>
                )) : null
            }
        </List>
    )
};
export default DbkfTextResults;