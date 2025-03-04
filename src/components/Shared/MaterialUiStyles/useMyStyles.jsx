import { green } from "@mui/material/colors";

import useClasses from "./useClasses";

const drawerWidthOpen = 300;
const drawerWidthClose = 85;

const styles = (theme) => ({
  root: {
    padding: theme.spacing(3, 2),
    marginTop: 5,
    textAlign: "center",
  },

  namedEntityButtonHidden: {
    textDecoration: "line-through !important",
    filter: "brightness(80%)",
  },

  tagCloudTag: {
    "&:hover": {
      filter: "brightness(80%)",
    },
  },

  rootNoCenter: {
    padding: theme.spacing(2),
  },

  noMargin: {
    marginLeft: "0px!important",
    marginRight: "0px!important",
  },

  circularProgress: {
    margin: "auto",
    width: "100%",
  },
  neededField: {
    "& label": {
      color: "#00926c",
    },
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
  card: {
    maxWidth: "60%",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  flex: {
    display: "flex",
  },
  drawer: {
    width: drawerWidthOpen,
    flexShrink: 0,
    whiteSpace: "nowrap",
    overflowX: "hidden",
  },

  drawerCategoryBorder: {
    border: "1px solid #c4c4c4",
  },

  drawerWidth: {
    width: drawerWidthOpen,
  },

  drawerWidthClose: {
    width: drawerWidthClose,
  },

  drawerOpen: {
    width: drawerWidthOpen,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    left: "auto",
  },

  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: drawerWidthClose,
    [theme.breakpoints.up("sm")]: {
      width: drawerWidthClose,
    },
    "&::-webkit-scrollbar": {
      display: "none",
    },
    left: "auto",
  },

  drawerListText: {
    fontWeight: "500",
    fontSize: "14px",
    textAlign: "start",
    whiteSpace: "pre-wrap",
  },

  drawerListTextClosed: {
    fontWeight: "500",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
    display: "none",
  },

  drawerListHeadingCenter: {
    textAlign: "center",
  },

  drawerListIcon: {
    width: "24px",
    height: "24px",
  },

  drawerListNested: {
    paddingInlineStart: theme.spacing(4),
  },

  drawerListIcons: {
    height: "30px",
    width: "30px",
  },

  toolbar: {
    //...theme.mixins.toolbar,
    height: "120px",
    paddingBottom: "10px",
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    backgroundColor: "#fafafa",
    minHeight: "100vh",
    overflow: "hidden",
  },
  logoLeft: {
    cursor: "pointer",
    //marginRight: theme.spacing(1),
    //maxHeight: "60px",
  },
  logoRight: {
    cursor: "pointer",
    //marginLeft: theme.spacing(1),
    //maxHeight: "70px",
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
    textAlign: "center",
    MaxHeight: "10px",
  },
  popUp: {
    width: "300px",
    padding: theme.spacing(1, 2),
    textAlign: "start",
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
    height: "auto",
    width: "100%",
    maxWidth: "60px",
  },
  textPaper: {
    elevation: 4,
    padding: theme.spacing(1, 2),
    textAlign: "start",
  },
  footer: {
    padding: theme.spacing(10, 5),
    textAlign: "center",
    bottom: 0,
  },
  feedback: {
    position: "fixed",
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 1,
  },
  listRoot: {
    flexGrow: 1,
    overflow: "hidden",
    padding: theme.spacing(0, 3),
  },
  listItem: {
    maxWidth: 400,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
  },
  formControl: {
    width: "100%",
    minWidth: 200,
  },
  histogram: {
    width: "100%",
    height: "100%",
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
    overflow: "visible",
  },
  imageIconDrawer: {
    width: "auto",
    height: "100%",
  },

  imageIconTab: {
    height: "auto",
    width: "100%",
  },
  iconRootTab: {
    overflow: "visible",
    textAlign: "center",
    fontSize: "2.25rem",
  },
  imageIconAllTools: {
    maxWidth: "300px",
    height: "auto",
    width: "100px",
  },
  text: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  longText: {
    maxWidth: "100%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
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
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing(1),
  },
  image: {
    height: "auto",
    width: "auto",
    maxWidth: "300px",
    maxHeight: "300px",
  },
  onClickInfo: {
    borderColor: "grey",
    borderRadius: "10px",
    borderStyle: "solid",
    borderWidth: "2px",
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "#151515",
    width: window.innerWidth * 0.9,
  },
  modalButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  AboutMedia: {
    height: "auto",
    width: "auto",
    maxWidth: "60%",
  },
  AboutMediaSmall: {
    height: "auto",
    width: "auto",
    maxWidth: "100px",
  },
  InteractiveMedia: {
    maxWidth: "80%",
    maxHeight: window.innerHeight / 2,
  },
  customTitle: {
    background: theme.palette.primary.main,
    borderRadius: 5,
    textAlign: "center",
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    padding: "15px",
    width: "auto",
    margin: 5,
  },
  forensicCard: {
    width: "100%",
  },
  forensicMediaLandscape: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  forensicMediaNotLandscape: {
    height: 400,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  lightBox: {
    overlay: {
      zIndex: theme.zIndex.drawer + 1,
    },
  },
  imgMagnifierContainer: {
    position: "relative",
    display: "inline-block",
    maxWidth: "1000px",
    lineHeight: "0",
  },
  imgMagnifierGlass: {
    width: "175px",
    height: "175px",
    position: "absolute",
    borderRadius: "100%",
    boxShadow:
      "0 0 0 7px rgba(255, 255, 255, 0.85), 0 0 7px 7px rgba(0, 0, 0, 0.25), inset 0 0 40px 2px rgba(0, 0, 0, 0.25)",
    /*hide the glass by default*/
    display: "none",
  },
  imgMagnifierImg: {
    cursor: "none",
  },
  FactCheckCard: {
    maxWidth: "80%",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  factCheckLogos: {
    width: "20%",
  },
  tab: {
    [theme.breakpoints.up("sm")]: {
      fontSize: "10px",
      minWidth: 100,
      color: "#4c4c4c",
    },
  },
  customAllToolsButton: {
    padding: 0,
    minHeight: 0,
    minWidth: 0,
    backgroundColor: "transparent",
    fontSize: 40,
  },
  customAllToolsIconDeselected: {
    fontSize: "inherit",
    color: "#9A9A9A",
  },
  customAllToolsIconSelected: {
    fontSize: "inherit",
    color: theme.palette.primary.main,
  },

  /* Assistant classes */
  /* ================================================================================== */

  toolTipIcon: {
    color: theme.palette.secondary,
    position: "relative",
    opacity: 0.7,
    top: theme.spacing(1),
    width: theme.typography.h5.fontSize,
    height: theme.typography.h5.fontSize,
    marginRight: 3,
    marginLeft: 5,
  },
  svgIcon: {
    fill: theme.palette.primary,
    position: "relative",
    top: theme.spacing(1),
    width: theme.typography.h3.fontSize,
    height: theme.typography.h3.fontSize,
    marginRight: 7,
    marginLeft: 5,
  },
  toolTipWarning: {
    color: "red",
    position: "relative",
    top: theme.spacing(1),
    width: theme.typography.h5.fontSize,
    height: theme.typography.h5.fontSize,
    marginRight: 3,
    marginLeft: 5,
  },
  assistantCardHeader: {
    fontSize: theme.typography.h6.fontSize,
    color: "white",
    textAlign: "start",
    backgroundColor: theme.palette.primary.main,
  },
  assistantHover: {
    borderWidth: 3,
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
  },
  sourceCredibilityBorder: {
    border: "2px solid",
    borderColor: theme.palette.primary.main,
    borderRadius: "15px",
    display: "flex",
    padding: "12px",
  },
  assistantWarningBorder: {
    border: "2px solid",
    borderColor: "red",
    borderRadius: "15px",
    display: "flex",
    padding: "12px",
  },
  assistantBackground: {
    backgroundColor: "transparent",
  },
  assistantIconRight: {
    marginLeft: "auto",
  },
  assistantIconLeft: {
    marginRight: "-15px",
  },

  /* OCR classes */
  /* ================================================================================== */

  displayFlex: {
    display: "flex",
  },
  ocrImageCard: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  ocrImageDiv: {
    position: "relative",
  },
  ocrImageCanvas: {
    position: "absolute",
    left: 0,
  },
  ocrImage: {
    objectFit: "contain",
    position: "relative",
    maxHeight: "100%",
    maxWidth: "100%",
  },
  ocrActionAreaLeft: {
    justifyContent: "left",
  },
  ocrActionAreaRight: {
    display: "flex",
    justifyContent: "right",
  },
  ocrButton: {
    borderWidth: "medium",
    width: "49%",
  },
  ocrReprocessBox: {
    backgroundColor: "whitesmoke",
    padding: 20,
  },
  fontBold: {
    fontWeight: "bold",
  },

  /* Forensic classes */
  /* ================================================================================== */
  newForensics: {
    spacing: 8,
    marginTop: -40,
  },

  cardFilters: {
    height: "100%",
  },

  lensesCard: {
    flexGrow: 1,
  },

  imageUploaded: {
    objectFit: "contain",
    objectPosition: "center",
    height: "100%",
    width: "100%",
  },

  imageFilter: {
    height: "13vh",
    width: "100%",
    backgroundPosition: "center",
    backgroundSize: "contain",
  },

  headerUploadedImage: {
    paddingTop: "11px!important",
    paddingBottom: "11px!important",
  },

  imageOverlayWrapper: {
    position: "relative",
  },

  imageOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    transition: "visibility 0s, opacity 0.2s linear",
    opacity: 0,
    "&:hover": {
      opacity: 1,
    },
  },

  filterDisplayedClass: {
    position: "absolute",
    objectFit: "contain",
    objectPosition: "center top",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },

  wrapperImageFilter: {
    position: "relative",
  },

  imagesGifImage: {
    backgroundPosition: "center",
    backgroundSize: "contain",
    objectFit: "contain",
    objectPosition: "top",
    position: "relative",
    top: 0,
    left: 0,
  },

  imagesGifFilter: {
    position: "absolute",
    objectFit: "contain",
    objectPosition: "center top",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },

  sliderClass: {
    maxWidth: "30vw",
  },

  /* CheckGIF classes */
  /* ================================================================================== */

  dropArea: {
    height: "20vh",
  },

  dropZone: {
    border: "dashed grey 2px",
    borderRadius: "25px",
    height: "25vh",
    minHeight: "200px",
  },

  dropZoneInside: {
    width: "100%",
    height: "100%",
  },

  imageDropped: {
    height: "25vh",
    minHeight: "200px",
  },

  inputContainer: {
    position: "relative",
  },

  inputLabel: {
    cursor: "pointer",
  },

  inputInput: {
    position: "absolute",
    zIndex: 2,
    width: "0.1px",
    height: "0.1px",
    opacity: 0,
    overflow: "hidden",
  },

  headingGif: {
    fontSize: "1rem",
    fontWeight: "600",
  },

  buttonGif: {
    weight: "100%!important",
  },

  bigButtonDiv: {
    border: "solid #E1E1E1 2px",
    borderRadius: "25px",
    cursor: "pointer",

    "&:hover": {
      border: "solid #00926c 2px",
    },
  },

  bigButtonDivSelectted: {
    border: "solid #00926c 3px",
    borderRadius: "25px",
  },

  bigButtonIcon: {
    height: "50px",
    width: "auto",
    color: "#9A9A9A",
  },

  bigButtonIconSelectted: {
    height: "50px",
    width: "auto",
    color: "#00926c",
  },

  bigButtonResponsive: {
    flexWrap: "nowrap",
  },

  height100: {
    height: "100%",
  },

  root2: {
    textAlign: "center",
    padding: theme.spacing(3),
  },

  toolCardStyle: {
    width: "32%",
    maxWidth: "400px",
    minWidth: "250px",
  },

  dialogTitleWithButton: {
    display: "flex",
    justifyContent: "space - between",
    alignItems: "center",
  },

  feedbackButtonTitleHide: {
    display: "none",
  },

  feedbackButtonTitleShow: {
    marginLeft: "12px",
    display: "block",
  },

  fabTop: {
    margin: "0px",
    top: "auto",
    position: "fixed",
    backgroundColor: "#fff",
    color: "#000",
  },

  feedbackHeaderTitle: {
    marginLeft: "12px",
  },

  deepfakeSquare: {
    position: "absolute",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
  },

  deepfakeSquareBorderRed: {
    border: "4px solid red",
  },

  deepfakeSquareBorderWhite: {
    border: "4px solid white",
  },

  checkeredBG: {
    background:
      "repeating-conic-gradient(#eee 0% 25%, #fafafa 0% 50%) 50% / 20px 20px",
  },

  hidden: {
    display: "none",
  },

  showElement: {
    display: "block",
  },
});
const cardStyles = () => ({
  root: {
    overflow: "visible",
  },
});
export const myCardStyles = () => {
  return useClasses(cardStyles);
};
const useMyStyles = () => {
  return useClasses(styles);
};

export default useMyStyles;
