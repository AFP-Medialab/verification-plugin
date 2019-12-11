import useMyStyles from "../MaterialUiStyles/useMyStyles";
import {useSelector} from "react-redux";
import React from "react";
import Typography from "@material-ui/core/Typography";
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';

const OnClickInfo = () => {
    const classes = useMyStyles();

    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    return (
        <div className={classes.onClickInfo}>
            <WbIncandescentIcon fontSize={"large"}/>
            <Typography variant={"body2"}>{keyword("keyframes_tip")}</Typography>
        </div>
    )
};
export default OnClickInfo;