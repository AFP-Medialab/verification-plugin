import useMyStyles from "../MaterialUiStyles/useMyStyles";
import React from "react";
import Typography from "@material-ui/core/Typography";
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/Shared/OnClickInfo.tsv";

const OnClickInfo = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/Shared/OnClickInfo.tsv", tsv);

    return (
        <div className={classes.onClickInfo}>
            <WbIncandescentIcon fontSize={"large"}/>
            <Typography variant={"body2"}>{keyword(props.keyword)}</Typography>
        </div>
    )
};
export default OnClickInfo;