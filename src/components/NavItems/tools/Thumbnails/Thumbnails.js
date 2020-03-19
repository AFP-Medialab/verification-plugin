import {Paper} from "@material-ui/core";
import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import React, {useCallback} from "react";
import ImageReverseSearch from "../ImageReverseSearch";
import ImageGridList from "../../../Shared/ImageGridList/ImageGridList";
import {useDispatch, useSelector} from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import {useInput} from "../../../../Hooks/useInput";
import {cleanThumbnailsState, setThumbnailsResult} from "../../../../redux/actions/tools/thumbnailsActions"
import {setError} from "../../../../redux/actions/errorActions"
import CloseResult from "../../../Shared/CloseResult/CloseResult";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Thumbnails.tsv";
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import OnClickInfo from "../../../Shared/OnClickInfo/OnClickInfo";

const Thumbnails = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Thumbnails.tsv", tsv);

    const resultUrl = useSelector(state => state.thumbnails.url);
    const resultData = useSelector(state => state.thumbnails.result);
    const dispatch = useDispatch();

    const input = useInput(resultUrl);
    const [selectedValue, setSelectedValue] = React.useState({
        'google': true,
        'bing': false,
        'tineye': false,
        'yandex': false,
        'openTabs': true,
        'reddit': false,

    });

    const handleChange = event => {
        setSelectedValue({
            ...selectedValue,
            [event.target.value]: event.target.checked
        });
    };

    const searchEngines = [
        {
            title: "bing",
            text: "Bing"
        },
        {
            title: "google",
            text: "Google"
        },
        {
            title: "tineye",
            text: "Tineye"
        },
        {
            title: "yandex",
            text: "Yandex"
        },
        {
            title: "reddit",
            text: "Reddit"
        },
    ];

    const getYtIdFromUrlString = (url) => {
        let id = "";
        let start_url = "https://www.youtube.com";
        let start_url_short = "https://youtu.be";
        if (url.startsWith(start_url)) {
            let path = url.substring(start_url.length);
            if (path.match(/\/watch\?/)) {
                id = url.match(/v=([^&]+)/)[1];
            } else if (path.match(/\/v\//) || url.match(/\/embed\/(.*)/)) {
                id = url.substring(url.lastIndexOf("/") + 1);
            }
        } else if (url.startsWith(start_url_short)) {
            id = url.substring(url.lastIndexOf("/") + 1);
        }
        return id;
    };

    const get_images = (url) => {
        let video_id = getYtIdFromUrlString(url);
        let img_url = "http://img.youtube.com/vi/%s/%d.jpg";
        let img_arr = [];
        for (let count = 0; count < 4; count++) {
            img_arr.push(img_url.replace("%s", video_id).replace("%d", count));
        }
        return img_arr;
    };

    const isYtUrl = (url) => {
        let start_url = "https://www.youtube.com/";
        let start_url_short = "https://youtu.be/";
        return url.startsWith(start_url) || url.startsWith(start_url_short);
    };

    const submitForm = () => {
        let url = input.value.replace("?rel=0", "");
        if (url !== null && url !== "" && isYtUrl(url)) {
            submissionEvent(url);
            dispatch(setThumbnailsResult(url, get_images(url), false, false));


        } else
            dispatch(setError("Please use a valid Youtube Url (add to tsv)"));
    };

    const imageClick = (event) => {
        imageClickUrl(event.target.src);
    };

    const imageClickUrl = (url) => {
        if (selectedValue.google)
            ImageReverseSearch("google", [url]);
        if (selectedValue.yandex)
            ImageReverseSearch("yandex", [url]);
        if (selectedValue.bing)
            ImageReverseSearch("bing", [url]);
        if (selectedValue.tineye)
            ImageReverseSearch("tineye", [url]);
        if (selectedValue.reddit)
            ImageReverseSearch("reddit", [url]);
    };
    useCallback(() => {
        if (selectedValue.openTabs)
            resultData.map(value => imageClickUrl(value))
        console.log(resultData);
    }, [imageClick, imageClickUrl, resultData, selectedValue.openTabs]);
    /*useEffect(() => {
        
        if (selectedValue.openTabs)
            resultData.map(value => imageClickUrl(value))
        
    }, [resultUrl, imageClickUrl, resultData, selectedValue.openTabs]);*/

    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile text={keyword("youtube_title")}/>
                <br/>
                <TextField
                    id="standard-full-width"
                    label={keyword("api_input")}
                    placeholder={keyword("youtube_input")}
                    fullWidth
                    {...input}
                />
                <Box m={2}/>
                <FormControl component="fieldset">
                    <FormGroup row>
                        {
                            searchEngines.map((item, key) => {
                                return (
                                    <FormControlLabel
                                        key={key}
                                        control={
                                            <Checkbox
                                                checked={selectedValue[item.title]}
                                                value={item.title}
                                                onChange={e => handleChange(e)}
                                                color="primary"
                                            />
                                        }
                                        label={item.text}
                                        labelPlacement="end"
                                    />
                                );
                            })
                        }
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedValue["openTabs"]}
                                    value={"openTabs"}
                                    onChange={e => handleChange(e)}
                                    color="primary"
                                />
                            }
                            label={keyword("openTabs")}
                            labelPlacement="end"
                        />
                    </FormGroup>
                </FormControl>
                <Box m={2}/>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={submitForm}
                >
                    {keyword("button_submit")}
                </Button>
            </Paper>

            {
                resultData && resultData.length !== 0 &&
                <Paper className={classes.root}>
                    <CloseResult onClick={() => dispatch(cleanThumbnailsState())}/>
                    <OnClickInfo keyword={"thumbnails_tip"}/>
                    <Box m={2}/>
                    <ImageGridList list={resultData} handleClick={imageClick} height={160}/>
                </Paper>
            }
        </div>);
};
export default Thumbnails;