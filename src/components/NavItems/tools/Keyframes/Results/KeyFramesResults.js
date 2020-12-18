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

    const [detailed, setDetailed] = useState(true);
    const [simpleList, detailedList] = useKeyframes(props.result);
    const [findHeight, setFindHeight] = useState(false);
    const [cols, setCols] = useState(3);

    const toggleDetail = () => {
        setDetailed(!detailed);
    };
    const imageClick = (event) => { 
    };
    const zoom = (zoom) => {
        if (zoom == 1 && cols > 1) {
            setCols(cols - 1);
            console.log("in" + cols);
        };
        if (zoom == -1) {
            setCols(cols + 1);
            console.log("out" + cols);
        };
    }

    let height = 0;
    let colsWidth = 1180 / cols;
    if (simpleList) {
        var img = new Image();
        img.src = simpleList[0];
        height = (colsWidth * img.height) / img.width;
 
        if (img.width != 0 && img.height != 0 && findHeight== false) {
            setFindHeight(true);
        }

    }

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
                <Button color={"primary"} onClick={() => zoom(1)}>
                    {
                        keyword("zoom_in")
                        //"ZOOM IN"
                    }
                </Button>
                <Button color={"primary"} onClick={() => zoom(-1)}>
                    {
                        keyword("zoom_out")
                        //"ZOOM OUT"
                    }
                </Button>
                <Box m={2}/>
                {
                    detailed && findHeight &&
                    //<ImageGridList list={detailedList} height={160} onClick={(url) => ImageReverseSearch("google", url)}/>
                    <ImageGridList list={detailedList} height={height} cols={cols} handleClick={imageClick}/>
                }
                {
                    !detailed && findHeight &&
                    //<ImageGridList list={simpleList}  height={160} onClick={(url) => ImageReverseSearch("google", url)}/>
                    <ImageGridList list={simpleList}  height={height} cols={cols} handleClick={imageClick}/>
                }
            </Paper>
        </div>
    )
};
export default React.memo(KeyFramesResults);