import React, {useState, useEffect} from "react";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector} from "react-redux";
import ImageGridList from "../../../ImageGridList/ImageGridList";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import {useKeyframes} from "../../../Hooks/usekeyframes";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },
}));

const KeyFramesResults = (props) => {
    const classes = useStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const [detailed, setDetailed] = useState(false);
    const [simpleList, detailedList] = useKeyframes(props.result, [props.result]);
    const [usedList, setUsedList] = useState(simpleList);

    const toggleDetail = () => {
        setDetailed(!detailed);
    };

    useEffect(() => {
        console.log("detail change");
        if (detailed)
            setUsedList(detailedList);
        else
            setUsedList(simpleList);
    }, [detailed, detailedList, simpleList]);

    return (
        <div>
            <Paper className={classes.root}>
                <Typography variant={"h5"}>
                    {keyword("keyframes_content_title")}
                </Typography>
                <Typography variant={"body1"}>
                    {keyword("keyframes_tip")}
                </Typography>
                <Box m={2}/>
                <Divider/>
                <Box m={2}/>
                <Button color={"primary"} onClick={() => toggleDetail()}>
                    {
                        detailed ? keyword("keyframe_title_get_detail")
                            : keyword("keyframe_title_get_simple")
                    }
                </Button>
                <Box m={2}/>
                {
                    usedList !== [] &&
                    <ImageGridList list={usedList}/>
                }
            </Paper>
        </div>
    )
};
export default KeyFramesResults;