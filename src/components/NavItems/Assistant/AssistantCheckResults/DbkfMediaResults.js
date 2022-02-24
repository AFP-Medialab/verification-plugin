import React from "react";

import Box from "@material-ui/core/Box";
import {DuoOutlined} from "@material-ui/icons";
import ImageIconOutlined from "@material-ui/icons/Image";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

import {useSelector} from "react-redux";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const DbkfMediaResults = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    const dbkfImageMatch = useSelector(state => state.assistant.dbkfImageMatch)
    const dbkfVideoMatch = useSelector(state => state.assistant.dbkfVideoMatch)

    return (
        <List disablePadding={true}>
            {dbkfImageMatch ?
                dbkfImageMatch.map((value, key) => (
                    <ListItem key={key}>
                        <ListItemAvatar>
                            <ImageIconOutlined fontSize={"large"}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <div>
                                    <Typography variant={"body1"} color={"textPrimary"} component={"div"} align={"left"}>
                                        {keyword("dbkf_image_warning") + parseFloat(value.similarity).toFixed(2)}
                                    </Typography>
                                    <Box mb={0.5}/>
                                </div>
                            }
                            secondary={
                                <Typography variant={"caption"} component={"div"} color={"textSecondary"}>
                                    <a href={value.claimUrl} key={key} target="_blank"
                                       rel="noopener noreferrer">
                                        {value.claimUrl}
                                    </a>
                                </Typography>
                            }/>
                    </ListItem>
                ))
                : null}

            {dbkfVideoMatch ?
                dbkfVideoMatch.map((value, key) => (
                    <ListItem key={key}>
                        <ListItemAvatar>
                            <DuoOutlined fontSize={"large"}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <div>
                                    <Typography variant={"body1"} color={"textPrimary"} component={"div"} align={"left"}>
                                        {keyword("dbkf_video_warning") + parseFloat(value.similarity).toFixed(2)}
                                    </Typography>
                                    <Box mb={0.5}/>
                                </div>
                            }
                            secondary={
                                <Typography variant={"caption"} component={"div"} color={"textSecondary"}>
                                    <a href={value.claimUrl} key={key} target="_blank"
                                       rel="noopener noreferrer">
                                        {value.claimUrl}
                                    </a>
                                </Typography>
                            }/>
                    </ListItem>
                ))
                : null}
        </List>)
}


export default DbkfMediaResults;