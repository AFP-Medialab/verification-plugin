import useMyStyles from "../MaterialUiStyles/useMyStyles";
import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/Shared/OnClickInfo.tsv";
import Linkify from 'react-linkify';

const OnClickInfo = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/Shared/OnClickInfo.tsv", tsv);

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(false);
    }, [props.keyword]);

    const handleClick = () => {
        setChecked((prev) => !prev);
    };

    return (
        <div>
            <WbIncandescentIcon fontSize={"large"} onClick={handleClick}/>
            {
                checked === true &&
                <div className={classes.onClickInfo}>
                    <Typography variant={"body2"}><Linkify>{keyword(props.keyword)}</Linkify></Typography>
                </div>
            }
        </div>
    )
};
export default OnClickInfo;