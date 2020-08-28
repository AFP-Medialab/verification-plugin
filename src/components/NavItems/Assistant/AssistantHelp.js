import React, {useState} from 'react';

import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Transition from "react-transition-group/Transition";
import {HelpOutline} from "@material-ui/icons";

import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const AssistantHelp = () => {

    const [open, setOpen] = useState(false);
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <HelpOutline onClick={handleClickOpen}/>
            <Dialog fullScreen TransitionComponent={Transition} open={open}>
                <DialogTitle>
                    <Typography variant={"h4"}>
                        <IconButton onClick={handleClose}><CloseIcon/></IconButton>
                        {keyword("assistant_help_title")}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        {<div className={"content"}
                              dangerouslySetInnerHTML={{__html: keyword("assistant_help_1")}}></div>}
                    </Typography>
                    <Typography gutterBottom>
                        {<div className={"content"}
                              dangerouslySetInnerHTML={{__html: keyword("assistant_help_2")}}></div>}
                    </Typography>
                    <Typography gutterBottom>
                        {<div className={"content"}
                              dangerouslySetInnerHTML={{__html: keyword("assistant_help_3")}}></div>}
                    </Typography>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AssistantHelp;