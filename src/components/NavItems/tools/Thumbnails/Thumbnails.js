import {Paper} from "@material-ui/core";
import CustomTile from "../../../utility/customTitle/customTitle";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import React from "react";
import ImageReverseSearch from "../ImageReverseSearch";
import ImageGridList from "../../../utility/ImageGridList/ImageGridList";
import {useDispatch, useSelector} from "react-redux";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import useMyStyles from "../../../utility/MaterialUiStyles/useMyStyles";
import {useInput} from "../../../Hooks/useInput";
import {cleanThumbnailsState, setThumbnailsResult} from "../../../../redux/actions/tools/thumbnailsActions"
import {setError} from "../../../../redux/actions/errorActions"
import CloseResult from "../../../CloseResult/CloseResult";
import {cleanMetadataState} from "../../../../redux/actions/tools/metadataActions";


const Thumbnails = () => {
    const classes = useMyStyles();

    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const resultUrl = useSelector(state => state.thumbnails.url);
    const resultData = useSelector(state => state.thumbnails.result);
    const dispatch = useDispatch();

    const input = useInput(resultUrl);
    const [selectedValue, setSelectedValue] = React.useState('google');
    const handleChange = event => {
        setSelectedValue(event.target.value);
    };

    const searchEngines = [
        {
            title : "bing",
            text : "Bing"
        },
        {
            title : "google",
            text : "Google"
        },
        {
            title : "tineye",
            text : "Tineye"
        },
        {
            title : "yandex",
            text : "Yandex"
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
            dispatch(setThumbnailsResult(url, get_images(url), false, false));
        }
        else
            dispatch(setError("Please use a valid Youtube Url (add to tsv)"));
    };

    const imageClick = (event) => {
        ImageReverseSearch(selectedValue, event.target.src)
    };

    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile> {keyword("youtube_title")}  </CustomTile>
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
                    <RadioGroup aria-label="position" name="position" value={selectedValue} onChange={handleChange} row>
                        {
                            searchEngines.map((item, key) => {
                                return (
                                    <FormControlLabel
                                        key={key}
                                        value={item.title}
                                        control={<Radio color="primary" />}
                                        label={item.text}
                                        labelPlacement="end"
                                    />
                                );
                            })
                        }
                    </RadioGroup>
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
                    <ImageGridList list={resultData} handleClick={imageClick}/>
                </Paper>
            }
        </div>);
};
export default Thumbnails;