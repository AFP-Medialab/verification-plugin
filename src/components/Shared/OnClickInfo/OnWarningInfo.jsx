import useMyStyles from "../MaterialUiStyles/useMyStyles";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import Linkify from 'react-linkify';

const tsv = "/localDictionary/components/Shared/OnWarningInfo.tsv";

const OnWarningInfo = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/Shared/OnWarningInfo.tsv", tsv)

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(props.trueClick ? true : false);
    }, [props.keyword, props.trueClick]);
    

    const handleClick = () => {
        setChecked((prev) => !prev);
    };

    const componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
    );

    return (
        <div>
            <WarningRoundedIcon fontSize={"large"} onClick={handleClick}/>
            {
                checked === true &&
                <div className={classes.onClickInfo}>
                    <Typography variant={"body2"}><Linkify componentDecorator={componentDecorator}>{keyword(props.keyword)}</Linkify></Typography>
                </div>
            }
        </div>
    )
};
export default OnWarningInfo;