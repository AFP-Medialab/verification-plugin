import React from "react";

import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import TextFieldsIcon from "@material-ui/icons/TextFields";

import {useSelector} from "react-redux";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const HpTextResult = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const hpResult = useSelector(state => state.assistant.hpResult)

    return (
        hpResult != null ?
        <List disablePadding={true}>
            <ListItem>
                <ListItemAvatar>
                    <TextFieldsIcon fontSize={"large"}/>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <div>
                            <Typography variant={"body1"} color={"textPrimary"} component={"div"} align={"left"}>
                                {keyword("hp_warning")}
                            </Typography>
                            <Box mb={0.5}/>
                        </div>
                    }
                    secondary={
                        <Typography variant={"caption"} component={"div"} color={"textSecondary"}>
                            {hpResult}
                        </Typography>}
                    />
            </ListItem>
        </List> : null
    )
};
export default HpTextResult;