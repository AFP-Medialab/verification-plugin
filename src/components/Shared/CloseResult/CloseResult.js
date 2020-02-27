import CancelIcon from '@material-ui/icons/Cancel';
import React from "react";
import useMyStyles from "../MaterialUiStyles/useMyStyles";

const CloseResult = (props) => {
    const classes = useMyStyles();
    return (
        <div className={classes.closeResult}>
            <CancelIcon
                color={"secondary"}
                fontSize={"default"}
                onClick={() => props.onClick()}
            />
        </div>
    )
};
export default CloseResult;