import CancelIcon from '@material-ui/icons/Cancel';
import React from "react";
import useMyStyles from "../utility/MaterialUiStyles/useMyStyles";
import Grid from "@material-ui/core/Grid";

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