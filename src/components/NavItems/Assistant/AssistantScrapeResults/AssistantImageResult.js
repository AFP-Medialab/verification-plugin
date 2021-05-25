import React from "react";
import {useSelector} from "react-redux";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ImageIcon from "@material-ui/icons/Image";
import {IconButton} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import Tooltip from "@material-ui/core/Tooltip";


const AssistantImageResult = () => {

    const processUrl = useSelector(state => state.assistant.processUrl);

    const copyUrl = () => {
        navigator.clipboard.writeText(processUrl)
    }

    return (
        <Card variant={"outlined"}>
            <CardMedia>
                <img src={processUrl} height={"100%"} alt={processUrl} width={"100%"}/>
            </CardMedia>
            <CardActions>
                <ImageIcon color={"action"}/>
                <Link href={processUrl} target={"_blank"} color={"textSecondary"} variant={"subtitle2"}>
                    {processUrl.length>60 ? processUrl.substring(0,60) + "...": processUrl}
                </Link>
                <Tooltip title={"Copy link"}>
                    <IconButton style={{"marginLeft":"auto"}} onClick={()=>{copyUrl()}}>
                        <FileCopyIcon color={"action"}/>
                        </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
}
export default AssistantImageResult;