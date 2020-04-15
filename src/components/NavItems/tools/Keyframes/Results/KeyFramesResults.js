import React, {useState} from "react";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useDispatch} from "react-redux";
import ImageGridList from "../../../../Shared/ImageGridList/ImageGridList";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import {useKeyframes} from "../Hooks/usekeyframes";
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import {cleanKeyframesState} from "../../../../../redux/actions/tools/keyframesActions";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Keyframes.tsv";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },
}));

const KeyFramesResults = (props) => {
    const classes = useStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Keyframes.tsv", tsv);
    const dispatch = useDispatch();

    const [detailed, setDetailed] = useState(false);
    const [simpleList, detailedList] = useKeyframes(props.result);

    const toggleDetail = () => {
        setDetailed(!detailed);
    };
    const imageClick = (event) => { 
    };

    return (
        <div>
            <Paper className={classes.root}>
                <CloseResult onClick={() => dispatch(cleanKeyframesState())}/>
                <Typography variant={"h5"}>
                    {keyword("keyframes_content_title")}
                </Typography>
                <OnClickInfo keyword={"keyframes_tip"}/>
                <Box m={2}/>
                <Divider/>
                <Box m={2}/>
                <Button color={"primary"} onClick={() => toggleDetail()}>
                    {
                        !detailed ? keyword("keyframe_title_get_detail")
                            : keyword("keyframe_title_get_simple")
                    }
                </Button>
                <Box m={2}/>
                {
                    detailed &&
                    //<ImageGridList list={detailedList} height={160} onClick={(url) => ImageReverseSearch("google", url)}/>
                    <ImageGridList list={detailedList} height={160} handleClick={imageClick}/>
                }
                {
                    !detailed &&
                    //<ImageGridList list={simpleList}  height={160} onClick={(url) => ImageReverseSearch("google", url)}/>
                    <ImageGridList list={simpleList}  height={160} handleClick={imageClick}/>
                }
            </Paper>
        </div>
    )
};
export default React.memo(KeyFramesResults);