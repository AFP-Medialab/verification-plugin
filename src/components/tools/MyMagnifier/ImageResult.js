import {Paper} from "@material-ui/core";
import React, {useState} from "react";
import Loop from "./Loop";
import Box from "@material-ui/core/Box";
import {useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import 'react-image-crop/dist/ReactCrop.css';
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
import Fade from '@material-ui/core/Fade';
import Modal from "@material-ui/core/Modal";
import Backdrop from '@material-ui/core/Backdrop';


const icona = require("tui-image-editor/dist/svg/icon-a.svg");
const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
const icond = require("tui-image-editor/dist/svg/icon-d.svg");

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
        marginTop: 5,
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
    }
}));


const ImageResult = (props) => {
    const classes = useStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const [image, setImage] = useState(props.image);
    const imageEditor = React.createRef();

    const updateImage = () => {
        const imageEditorInst = imageEditor.current.imageEditorInst;
        const data = imageEditorInst.toDataURL();
        setImage(data);
    };

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        if (imageEditor !== undefined && imageEditor !== null) {
            updateImage()
        }
        setOpen(false);
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

                                theme: myTheme,
                                menu: ["crop", "flip", "rotate", "filter"],
                                initMenu: "",
                                uiSize: {
                                    height: `calc(100vh - 160px)`,
                                },
                                menuBarPosition: "bottom",
                            }}
                            cssMaxHeight={window.innerHeight}
                            cssMaxWidth={window.innerWidth}
                            selectionStyle={{
                                cornerSize: 20,
                                rotatingPointOffset: 70,
                            }}
                            usageStatistics={false}
                            ref={imageEditor}
                        />
                        <Box m={1}/>
                        <div className={classes.modalButton}>
                            <Button variant="contained" color="secondary" onClick={handleClose}>Save</Button>
                        </div>
                    </div>
                </Fade>
            </Modal>

            <Box m={1}/>
            <Button  onClick={handleOpen}>Edit Image</Button>
            <Box m={1}/>
            <Loop src={image}/>
        </Paper>
    )
};
export default ImageResult;