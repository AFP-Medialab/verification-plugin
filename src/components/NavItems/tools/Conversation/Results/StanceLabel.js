import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Conversation.tsv";

import {default as CommentIcon} from "../images/Comment";
import {default as SupportIcon} from "../images/Support";
import {default as QueryIcon} from "../images/Query";
import {default as DenyIcon} from "../images/Deny";
import Typography from "@material-ui/core/Typography";

const StanceLabel = ({type}) => {
    
    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsv);

    const style = {
        fill: "black",
        height: "1.2em",
        width: "1.2em",
        verticalAlign:"middle",
        marginRight: "10px"
    }

    switch (type) {
        case "support":
            style["fill"] = "rgb(124, 179, 66)";
            return (<span style={{display: "inline-block", fontSize: "14px", fontWeight: "600", paddingTop: "12px", paddingBottom: "12px"}}><SupportIcon style={style}/>{keyword("stance_support")}</span>)
        case "deny":
            style["fill"] = "rgb(229, 57, 53)";
            return (<span style={{ display: "inline-block", fontSize: "14px", fontWeight: "600", paddingTop: "12px", paddingBottom: "12px"}}><DenyIcon style={style} /> {keyword("stance_deny")}</span>)
        case "query":
            style["fill"] = "rgb(255, 179, 0)";
            return (<span style={{ display: "inline-block", fontSize: "14px", fontWeight: "600", paddingTop: "12px", paddingBottom: "12px"}}><QueryIcon style={style} /> {keyword("stance_query")}</span>)
        case "comment":
            style["fill"] = "rgb(3, 155, 229)";
            return (<span style={{ display: "inline-block", fontSize: "14px", fontWeight: "600", paddingTop: "12px", paddingBottom: "12px"}}><CommentIcon style={style} /> {keyword("stance_comment")}</span>)
        default:
             // this should really never happen but we need to
            // return something just in case
            return ""
    }
}

export default StanceLabel;