import {Paper} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import Loop from "./Loop";
import Box from "@material-ui/core/Box";
import {useDispatch, useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import 'react-image-crop/dist/ReactCrop.css';
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
import{setMagnifierResult} from "../../../../redux/actions/tools/magnifierActions";
import ImageReverseSearch from "../ImageReverseSearch";
import history from "../../../utility/History/History";

const myTheme = {
    "menu.backgroundColor": "white",
    "common.backgroundColor": "#151515",
    "downloadButton.backgroundColor": "white",
    "downloadButton.borderColor": "white",
    "downloadButton.color": "black",
    "menu.normalIcon.path": icond,
    "menu.activeIcon.path": iconb,
    "menu.disabledIcon.path": icona,
    "menu.hoverIcon.path": iconc,
};

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 20,
        textAlign: "center",
    },
    textFiledError: {
        MuiInput: {
            underline: {
                borderBottom: theme.palette.error.main,
            },
            '&:hover fieldset': {
                borderBottom: 'yellow',
            },
        },
    },
    grow: {
        flexGrow: 1,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: "#151515",
        width: window.innerWidth * 0.9,

    },
    modalButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));


const ImageResult = () => {
    const classes = useStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const original = useSelector(state => state.magnifier.url);
    const resultImage = useSelector(state => state.magnifier.result);

    const dispatch = useDispatch();
    const imageEditor = React.createRef();

    const updateImage = () => {
        const imageEditorInst = imageEditor.current.imageEditorInst;
        const data = imageEditorInst.toDataURL();
        dispatch(setMagnifierResult(original, data, false, false));
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
        let index = image_name.indexOf("?");
        return image_name.substring(0, image_name.lastIndexOf("."));
    };

    return (
        <Paper className={classes.root}>
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
                            <Button variant="contained" color="secondary" onClick={() => setOpen(false)}>Quit (add
                                tsv)</Button>
                            <div className={classes.grow}/>
                            <Button variant="contained" color="secondary" onClick={handleClose}>Save (add tsv)</Button>
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
                    <Button color="primary" variant="contained" onClick={handleOpen}>Edit Image add tsv</Button>
                </Grid>
                <Grid item>
                    <a href={resultImage} download={downLoadLink(resultImage)}>
                        <Button color="primary" variant="contained">Download</Button>
                    </a>
                </Grid>
            </Grid>
            <Box m={2}/>
            <Loop src={resultImage}/>
            <Box m={2}/>
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
                            keyword("magnifier_google")
                        }
                    </Button>
                </Grid>
                <Grid item>
                    <Button color="primary"
                            variant="contained"
                            onClick={() => ImageReverseSearch("baidu", original)}>
                        {
                            keyword("magnifier_baidu")
                        }
                    </Button>
                </Grid>
                <Grid item>
                    <Button color="primary"
                            variant="contained"
                            onClick={() => ImageReverseSearch("yandex", original)}>
                        {
                            keyword("magnifier_yandex")
                        }
                    </Button>
                </Grid>
                <Grid item>
                    <Button color="primary"
                            variant="contained"
                            onClick={() => ImageReverseSearch("tineye", original)}>
                        {
                            keyword("magnifier_tineye")
                        }
                    </Button>
                </Grid>
                <Grid item>
                    <Button color="primary"
                            variant="contained"
                            onClick={() => history.push("forensic/" + encodeURIComponent(original))}>
                        {
                            keyword("magnifier_forensic")
                        }
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
};
export default ImageResult;