import React from "react";

import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import SourceCredibilityDBKFDialog from "./SourceCredibilityDBKFDialog";
import Typography from "@material-ui/core/Typography";

import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const SourceCredibilityResult = (props) => {

    // central
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    // props
    const sourceCredibilityResults = props.scResultFiltered
    const Icon = props.icon
    const iconColor = props.iconColor

    return (
        <List disablePadding={true}>
            {sourceCredibilityResults ?
                sourceCredibilityResults.map((value, key) => (
                    <ListItem key={key}>
                        <ListItemAvatar>
                            <Icon fontSize={"large"} color={iconColor}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <div>
                                    <Typography variant={"body1"} component={"div"} align={"left"}  color={"textPrimary"}>
                                            {keyword("source_credibility_warning")} {value.credibility_source}
                                    </Typography>
                                    <Box mb={0.5}/>
                                </div>
                            }
                            secondary={
                                <Typography variant={"caption"} component={"div"} color={"textSecondary"}>
                                    {value.credibility_labels ?
                                        <Typography variant={"subtitle2"}> {keyword("labelled_as")} "{value.credibility_labels}" </Typography>
                                        : null
                                    }
                                    {value.credibility_description ?
                                        <Typography variant={"subtitle2"}> {keyword("commented_as")} "{value.credibility_description}" </Typography>
                                        : null
                                    }
                                    {value.credibility_evidence.length > 0 ?
                                        <ListItemSecondaryAction>
                                            <SourceCredibilityDBKFDialog evidence={value.credibility_evidence} source = {value.credibility_source}/>
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
export default SourceCredibilityResult;