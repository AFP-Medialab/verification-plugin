import makeStyles from "@material-ui/core/styles/makeStyles";
import {green} from "@material-ui/core/colors";

const drawerWidth = 200;

const useMyStyles = makeStyles(theme => ({
        root: {
            padding: theme.spacing(3, 2),
            marginTop: 5,
            textAlign: "center",
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
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        logoLeft: {
            marginRight: theme.spacing(2),
            maxHeight: "60px",
        },
        logoRight: {
            marginLeft: theme.spacing(2),
            maxHeight: "70px",
        },
        selectedApp: {
            color: theme.palette.primary.main
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
            MaxHeight: "100%"
        },
        popUp: {
            width: "300px",
            padding: theme.spacing(3, 2),
            marginTop: 5,
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
    }));
export default useMyStyles;