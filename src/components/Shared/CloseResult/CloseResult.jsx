import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import useMyStyles from "../MaterialUiStyles/useMyStyles";

const CloseResult = (props) => {
  const classes = useMyStyles();
  return (
    <div className={classes.closeResult}>
      <CancelIcon
        color={"secondary"}
        fontSize={"medium"}
        onClick={() => props.onClick()}
      />
    </div>
  );
};
export default CloseResult;
