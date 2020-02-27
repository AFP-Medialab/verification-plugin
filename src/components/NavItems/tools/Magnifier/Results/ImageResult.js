import {Paper} from "@material-ui/core";
import React, {useState} from "react";
import Loop from "./Loop";
import Box from "@material-ui/core/Box";
import {useDispatch, useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
import Fade from '@material-ui/core/Fade';
import Modal from "@material-ui/core/Modal";
import Backdrop from '@material-ui/core/Backdrop';
import icona from "tui-image-editor/dist/svg/icon-a.svg";
import iconb from "tui-image-editor/dist/svg/icon-b.svg";
import iconc from "tui-image-editor/dist/svg/icon-c.svg";
import icond from "tui-image-editor/dist/svg/icon-d.svg";
import Grid from "@material-ui/core/Grid";
import {cleanMagnifierState, setMagnifierResult} from "../../../../../redux/actions/tools/magnifierActions";
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Magnifier.tsv";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import ImageReverseSearch from "../../ImageReverseSearch"

const myTheme = {
    'loadButton.backgroundColor': "#151515",
    'loadButton.border': '0px',
    'loadButton.color': "#151515",
    'loadButton.fontFamily': 'NotoSans, sans-serif',
    'loadButton.fontSize': '0px',

    'downloadButton.backgroundColor': "#151515",
    'downloadButton.border': '0px',
    'downloadButton.color': "#151515",
    'downloadButton.fontFamily': 'NotoSans, sans-serif',
    'downloadButton.fontSize': '0px',


    "menu.backgroundColor": "white",
    "common.backgroundColor": "#151515",
    "menu.normalIcon.path": icond,
    "menu.activeIcon.path": iconb,
    "menu.disabledIcon.path": icona,
    "menu.hoverIcon.path": iconc,


    // submenu icons
    'submenu.normalIcon.path': '../dist/svg/icon-a.svg',
    'submenu.normalIcon.name': 'icon-a',
    'submenu.activeIcon.path': '../dist/svg/icon-c.svg',
    'submenu.activeIcon.name': 'icon-c',
    'submenu.iconSize.width': '64px',
    'submenu.iconSize.height': '64px',

// submenu labels
    'submenu.normalLabel.color': '#fff',
    'submenu.normalLabel.fontWeight': 'bold',
    'submenu.activeLabel.color': '#858585',
    'submenu.activeLabel.fontWeight': 'bold',
};

const ImageResult = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Magnifier.tsv", tsv);

    const original = useSelector(state => state.magnifier.url);
    const resultImage = useSelector(state => state.magnifier.result);

    const dispatch = useDispatch();
    const imageEditor = React.createRef();

    const [imageIsUrl, setImageIsUrl] = useState(original.startsWith("http:") || original.startsWith("https:"));


    const updateImage = () => {
        const imageEditorInst = imageEditor.current.imageEditorInst;
        const data = imageEditorInst.toDataURL();
        dispatch(setMagnifierResult(original, data, false, false));
        setImageIsUrl(false);
    };

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        if (imageEditor !== null && imageEditor.current !== null) {
            const imageEditorInst = imageEditor.current;
            imageEditorInst.loadImageFromURL(resultImage, 'image')
                .catch((error) => console.error(error));
        }
        setOpen(true);

    };

    const handleClose = () => {
        if (imageEditor !== undefined && imageEditor !== null) {
            updateImage()
        }
        setOpen(false);
    };

    const downLoadLink = (image) => {
        let image_name = image.substring(image.lastIndexOf("/") + 1);
        return image_name.substring(0, image_name.lastIndexOf("."));
    };

    const copyToClipBoard = (string) => {
        let textArea = document.createElement("textarea");
        textArea.innerHTML = string;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
    };

    const GoogleClick = () => {
        copyToClipBoard(resultImage);
        window.open("https://www.google.com/imghp?sbi=1", "_blank");
    };

    return (
        <Paper className={classes.root}>
            <CloseResult onClick={() => dispatch(cleanMagnifierState())}/>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <ImageEditor
                            includeUI={{
                                loadImage: {
                                    path: resultImage,
                                    name: 'SampleImage'
                                },
                                theme: myTheme,
                                menu: ["crop", "flip", "rotate", "filter"],
                                initMenu: "",
                                uiSize: {
                                    height: `calc(100vh - 160px)`,
                                },
                                menuBarPosition: "bottom",
                            }}
                            cssMaxHeight={window.innerHeight * 0.8}
                            cssMaxWidth={window.innerWidth * 0.8}
                            selectionStyle={{
                                cornerSize: 20,
                                rotatingPointOffset: 70,
                            }}
                            usageStatistics={false}
                            ref={imageEditor}
                        />
                        <Box m={1}/>

                        <div className={classes.modalButton}>
                            <Button variant="contained" color="secondary" onClick={() => setOpen(false)}>
                                {
                                    keyword("quit")
                                }
                            </Button>
                            <div className={classes.grow}/>
                            <Button variant="contained" color="secondary" onClick={handleClose}>
                                {
                                    keyword("save")
                                }
                            </Button>
                        </div>
                    </div>
                </Fade>
            </Modal>

            <Box m={1}/>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={3}
            >
                <Grid item>
                    <Button color="primary" variant="contained" onClick={handleOpen}>
                        {
                            keyword("edit_image")
                        }
                    </Button>
                </Grid>
                <Grid item>
                    <a style={{"text-decoration": "none"}} href={resultImage} download={downLoadLink(resultImage)}>
                        <Button color="primary" variant="contained">
                            {
                                keyword("download")
                            }
                        </Button>
                    </a>
                </Grid>
            </Grid>
            <Box m={2}/>
            <Loop src={resultImage}/>
            <Box m={2}/>
            {
                !imageIsUrl ?
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        spacing={3}
                    >
                        <Grid item>
                            <OnClickInfo keyword={"magnifier_tip"}/>
                        </Grid>
                        <Grid item>
                            <Button color="primary"
                                    variant="contained"
                                    onClick={GoogleClick}>
                                {
                                    keyword("magnifier_google")
                                }
                            </Button>
                        </Grid>
                    </Grid>
                    :
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        spacing={3}
                    >
                        <Grid item>
                            <Button color="primary"
                                    variant="contained"
                                    onClick={() => ImageReverseSearch("google", original)}>
                                {
                                    "Google " +  keyword("reverse_search")
                                }
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button color="primary"
                                    variant="contained"
                                    onClick={() => ImageReverseSearch("baidu", original)}>
                                {
                                    "Baidu " + keyword("reverse_search")
                                }
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button color="primary"
                                    variant="contained"
                                    onClick={() => ImageReverseSearch("bing", original)}>
                                {
                                    "Bing " + keyword("reverse_search")
                                }
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button color="primary"
                                    variant="contained"
                                    onClick={() => ImageReverseSearch("tineye", original)}>
                                {
                                    "Tineye " + keyword("reverse_search")
                                }
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button color="primary"
                                    variant="contained"
                                    onClick={() => ImageReverseSearch("yandex", original)}>
                                {
                                    "Yandex " + keyword("reverse_search")
                                }
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button color="primary"
                                    variant="contained"
                                    onClick={() => ImageReverseSearch("reddit", original)}>
                                {
                                    "Reddit " + keyword("reverse_search")
                                }
                            </Button>
                        </Grid>
                    </Grid>

            }
        </Paper>
    )
};
export default ImageResult;