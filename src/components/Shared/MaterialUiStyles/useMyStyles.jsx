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

  noMargin: {
    marginLeft: "0px!important",
    marginRight: "0px!important",
  },

  neededField: {
    "& label": {
      color: "var(--mui-palette-primary-main)",
    },
  },

  message: {
    display: "flex",
    alignItems: "center",
  },

  drawer: {
    width: drawerWidthOpen,
    flexShrink: 0,
    whiteSpace: "nowrap",
    overflowX: "hidden",
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

  toolbar: {
    height: "110px",
    paddingBottom: "10px",
  },

  content: {
    flexGrow: 1,
    backgroundColor: "var(--mui-palette-background-main)",
    minHeight: "100vh",
    overflow: "hidden",
  },

  logoLeft: {
    cursor: "pointer",
  },

  logoRight: {
    cursor: "pointer",
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
    padding: theme.spacing(10, 0, 3, 0),
    textAlign: "center",
    bottom: 0,
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
    display: "inline-block",
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

  imgMagnifierContainer: {
    position: "relative",
    display: "inline-block",
    maxWidth: "1000px",
    lineHeight: "0",
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
    textAlign: "start",
    "& .MuiCardHeader-subheader": {
      color: "var(--mui-palette-text-primary)",
    },
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
    top: 0,
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

  dropZone: {
    border: "dashed grey 2px",
    borderRadius: "25px",
    height: "25vh",
    minHeight: "200px",
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

  headingGif: {
    fontSize: "1rem",
    fontWeight: "600",
  },

  bigButtonDiv: {
    border: "solid #E1E1E1 2px",
    borderRadius: "25px",
    cursor: "pointer",

    "&:hover": {
      border: "solid var(--mui-palette-primary-main) 2px",
    },
  },

  bigButtonDivSelected: {
    border: "solid var(--mui-palette-primary-main) 3px",
    borderRadius: "25px",
  },

  bigButtonIcon: {
    height: "50px",
    width: "auto",
    color: "#9A9A9A",
  },

  bigButtonIconSelected: {
    height: "50px",
    width: "auto",
    color: "var(--mui-palette-primary-main)",
  },

  height100: {
    height: "100%",
  },

  root2: {
    textAlign: "center",
    padding: theme.spacing(4),
  },

  fabTop: {
    margin: "0px",
    top: "auto",
    position: "fixed",
    backgroundColor: "#fff",
    color: "#000",
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
