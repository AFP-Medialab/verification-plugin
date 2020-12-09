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

const HelpDialog = (props) => {

    const [open, setOpen] = useState(false);

    // a list of keywords found in a tsv file. pass in tsv labels and tsv file location
    const paragraphs = props.paragraphs
    const keywordFile = props.keywordFile
    const keyword = useLoadLanguage(keywordFile, tsv);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <HelpOutline onClick={handleClickOpen}/>
            <Dialog maxWidth={"xl"} TransitionComponent={Transition} open={open}>
                <DialogTitle>
                    <Typography variant={"h4"}>
                        <IconButton onClick={handleClose}><CloseIcon/></IconButton>
                        {keyword("assistant_help_title")}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    {paragraphs.map((text, index) => (
                        <Typography gutterBottom key={index}>
                            {<div className={"content"}
                                  dangerouslySetInnerHTML={{__html: keyword(text)}}></div>}
                        </Typography>
                    ))}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HelpDialog;