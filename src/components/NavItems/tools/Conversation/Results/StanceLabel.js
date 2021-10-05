import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Conversation.tsv";

import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';

import {default as CommentIcon} from "../images/CommentOutlined";

const StanceLabel = ({type}) => {
    
    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsv);

    const style = {
        fill: "black",
        height: "1.2em",
        width: "1.2em",
        verticalAlign:"middle"
    }

    switch (type) {
        case "support":
            style["fill"] = "rgb(124, 179, 66)";
            return (<span><CheckCircleOutlinedIcon style={style}/> {keyword("stance_support")}</span>)
        case "deny":
            style["fill"] = "rgb(229, 57, 53)";
            return (<span><CancelOutlinedIcon style={style} /> {keyword("stance_deny")}</span>)
        case "query":
            style["fill"] = "rgb(255, 179, 0)";
            return (<span><HelpOutlineOutlinedIcon style={style} /> {keyword("stance_query")}</span>)
        case "comment":
            style["fill"] = "rgb(3, 155, 229)";
            return (<span><CommentIcon style={style} /> {keyword("stance_comment")}</span>)
        default:
             // this should really never happen but we need to
            // return something just in case
            return ""
    }
}

export default StanceLabel;