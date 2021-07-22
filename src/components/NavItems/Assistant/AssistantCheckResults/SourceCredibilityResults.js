import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import PublicIcon from "@material-ui/icons/Public";
import SourceCredibilityDBKFDialog from "./SourceCredibilityDBKFDialog";
import Typography from "@material-ui/core/Typography";

import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const SourceCredibilityResults = (props) => {

    const sourceCredibilityResults = props.scResultFiltered
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
                                        {keyword("source_credibility_warning")} {value.credibility_source}
                                    </Box>
                                </Typography>}
                            secondary={
                                <Typography component={"div"}>
                                    {value.credibility_labels ?
                                        <Typography> {keyword("labelled_as")} "{value.credibility_labels}" </Typography>
                                        : null
                                    }
                                    {value.credibility_description ?
                                        <Typography> {keyword("commented_as")} "{value.credibility_description}" </Typography>
                                        : null
                                    }
                                    {value.credibility_debunks.length > 0 ?
                                        <ListItemSecondaryAction>
                                            <SourceCredibilityDBKFDialog debunks={value.credibility_debunks}/>
                                        </ListItemSecondaryAction>
                                        : null
                                    }
                                </Typography>
                            }/>
                    </ListItem>)) :
                null
            }
        </List>
    )
};
export default SourceCredibilityResults;