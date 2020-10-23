import React from "react";
import {useSelector} from "react-redux";

import Card from "@material-ui/core/Card";
import {CardHeader} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import Link from "@material-ui/core/Link";
import LinkIcon from "@material-ui/icons/Link";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

const AssistantLinkResult = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    const linkList = useSelector(state=>state.assistant.linkList)

    return (
        <Grid item xs={12}>
            <Card>
                <CardHeader
                    className={classes.assistantCardHeader}
                    title={<Typography variant={"h5"}> {keyword("extracted_urls")} Extracted URLs </Typography>}
                />
                <CardContent
                    style={{"maxHeight": 300, "wordBreak": "break-word", "overflowY": 'auto', "overflowX": "hidden"}}>
                    {linkList != null ?
                        <List>
                            {linkList.map((urlEntity, key) => (
                                <ListItem key={key}>
                                    <ListItemIcon>
                                        <LinkIcon/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Link color={"inherit"} href={urlEntity}>{urlEntity}</Link>}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        : null}
                </CardContent>
            </Card>
        </Grid>
    )
}
export default AssistantLinkResult;

