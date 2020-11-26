import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {useSelector} from "react-redux";
import List from "@material-ui/core/List";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const HpTextResult = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const hpResult = useSelector(state => state.assistant.hpResult)

    return (
        <List>
            <ListItem>
                <ListItemAvatar>
                    <Avatar variant={"square"}><TextFieldsIcon fontSize={"large"}/> </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography component={"div"} align={"left"}>
                            <Box fontWeight="fontWeightBold">
                                {keyword("hp_warning")}
                            </Box>
                        </Typography>}
                    secondary={hpResult}
                />
            </ListItem>
        </List>
    )
};
export default HpTextResult;