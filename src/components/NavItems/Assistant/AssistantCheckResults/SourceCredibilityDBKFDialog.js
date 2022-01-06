import React, {useState} from 'react';

import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Link from "@material-ui/core/Link";
import LaunchIcon from '@material-ui/icons/Launch';
import Transition from "react-transition-group/Transition";
import Typography from '@material-ui/core/Typography';
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const SourceCredibilityDBKFDialog = (props) => {

    //central
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const [open, setOpen] = useState(false);

    // props
    const source = props.source
    const evidence = props.evidence

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <LaunchIcon onClick={handleClickOpen}/>
            <Dialog onClose={handleClose} maxWidth={"lg"} TransitionComponent={Transition} open={open}>
                <DialogTitle>
                    <Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon/>
                        </IconButton>
                        {keyword("source_cred_popup_header")} {source}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <List>
                        {evidence.map((result, index) =>
                            <ListItem key={index}>
                                <ListItemIcon><ArrowRightIcon/></ListItemIcon>
                                <Typography>
                                    <Link target="_blank" href={result}>{result}</Link>
                                </Typography>
                            </ListItem>
                        )}
                    </List>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default SourceCredibilityDBKFDialog;