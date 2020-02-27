import makeStyles from "@material-ui/core/styles/makeStyles";
import {green} from "@material-ui/core/colors";

const drawerWidth = 200;

const useMyStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
       
    },
    circularProgress: {
        margin: "auto",
        width: "100%"
    },
    neededField: {
        '& label': 
        {
            color: "rgb(0,170,180)"
        }
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    error: {
        backgroundColor: theme.palette.error.main,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    card: {
        maxWidth: "60%",
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9

    },
    flex: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    logoLeft: {
        cursor: "pointer",
        marginRight: theme.spacing(2),
        maxHeight: "60px",
    },
    logoRight: {
        cursor: "pointer",
        marginLeft: theme.spacing(2),
        maxHeight: "70px",
    },
    selectedApp: {
        color: theme.palette.primary.main,
    },
    unSelectedApp: {},
    fab: {
        margin: theme.spacing(1),
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    iconRoot: {
        textAlign: 'center',
        MaxHeight: "10px"
    },
    popUp: {
        width: "300px",
        padding: theme.spacing(1, 2),
        textAlign: "center",
    },
    grow: {
        flexGrow: 1,
    },
    TableHead: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    buttonOk: {
        color: theme.palette.primary.main,
    },
    buttonError: {
        color: theme.palette.error.main,
    },
    buttonWarning: {
        color: theme.palette.secondary.main,
    },
    imageIcon: {
        height: 'auto',
        width: '100%',
        maxWidth: "60px",
    },
    textPaper: {
        elevation: 4,
        padding: theme.spacing(1, 2),
        textAlign: "left",
    },
    footer: {
        padding: theme.spacing(10, 5),
        textAlign: "center",
        bottom: 0,
    },
    feedback: {
        position: 'fixed',
        bottom: theme.spacing(2),
        left: theme.spacing(2),
        zIndex: theme.zIndex.drawer + 1,
    },
    listRoot: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: theme.spacing(0, 3),
    },
    listItem: {
        maxWidth: 400,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    histogram: {
        width: "100%",
        height: "100%"
    },
    twitterSnaResult: {
        marginTop: 20,
        textAlign: "center",
    },
    closeResult: {
        cursor: "pointer",
        marginRight: "-10px",
        marginTop: "-20px",
        textAlign: "right",
    },
    iconRootDrawer: {
        textAlign: "center",
        overflow: "visible"
    },
    imageIconDrawer: {
        width: "auto",
        height: "100%",
    },

    imageIconTab: {
        height: "auto",
        width: "100%"
    },
    iconRootTab: {
        overflow: "visible",
        textAlign: "center",
        fontSize: "2.25rem"
    },
    imageIconAllTools: {
        maxWidth: "300px",
        height: "auto",
        width: "100px",
    },
    text: {
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    gridList: {
        width: "100%",
        maxHeight: "500px",
    },
    imagesRoot: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    button: {
        margin: theme.spacing(1),
    },
    image: {
        height: "auto",
        width: "auto",
        maxWidth: "300px",
        maxHeight: "300px"
    },
    onClickInfo: {
        borderColor: "grey",
        borderRadius: '10px',
        borderStyle: "solid",
        borderWidth: "2px",
        paddingTop: "10px",
        paddingBottom: "10px"
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
    AboutMedia: {
        height: "auto",
        width: "auto",
        maxWidth: "60%",
    },
    InteractiveMedia: {
        maxWidth: "80%",
        maxHeight: window.innerHeight / 2,
    },
    customTitle: {
        background: theme.palette.primary.main,
        borderRadius: 5,
        textAlign: "center",
        color: 'white',
        fontSize: 28,
        fontWeight: "bold",
        padding: '15px',
        width: "auto",
        margin: 5,
    },
    forensicCard: {
        width: "100%",
    },
    forensicMedia: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    lightBox: {
        overlay: {
            zIndex: theme.zIndex.drawer + 1,
        },
    },
    imgMagnifierContainer: {
        position: "relative",
        cursor: "none",
        margin: 0,
        padding: 0,
    },
    imgMagnifierGlass: {
        width: "175px",
        height: "175px",
        position: "absolute",
        borderRadius: "100%",
        boxShadow: "0 0 0 7px rgba(255, 255, 255, 0.85), 0 0 7px 7px rgba(0, 0, 0, 0.25), inset 0 0 40px 2px rgba(0, 0, 0, 0.25)",
        /*hide the glass by default*/
        display: "none",
    },
    imgMagnifierImg: {
        position: "relative",
        cursor: "none",
        display: "block",
    },
    FactCheckCard : {
        maxWidth: "80%"
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    factCheckLogos : {
        width: "20%"
    },
    tab: {
        [theme.breakpoints.up('sm')]: {
            fontSize: theme.typography.pxToRem(13),
            minWidth: 100,
        },
    }
}));
export default useMyStyles;