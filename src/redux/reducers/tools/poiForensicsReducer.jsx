import { SignalCellularNullOutlined } from "@mui/icons-material";

const defaultState = {
  url: "",
  file: null,
  result: null,
  loading: false,
  selectedPoi: {
    Macron: true,
    Putin_ru: false,
    Zelensky_ru: false,
    GiorgiaMeloni: false,
  },
  selectedMode: "audiovideo",
  status: false,
};

const poiForensicsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "POI_FORENSICS_RESET":
      return {
        ...state,
        url: "",
        file: null,
        result: null,
        loading: false,
        type: "",
      };
    case "SET_POI_FORENSICS_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_POI_FORENSICS_RESULT":
      return {
        ...state,
        url: action.payload.url,
        result: action.payload.result,
        loading: false,
      };
    case "SET_POI_FORENSICS_URL":
      return {
        ...state,
        url: action.payload.url,
      };
    case "SET_POI_FORENSICS_FILE":
      return {
        ...state,
        file: action.payload,
      };
    case "SET_SELECTED_POI":
      return {
        ...state,
        selectedPoi: action.payload,
      };
    case "SET_SELECTED_MODE":
      return {
        ...state,
        selectedMode: action.payload,
      };
    case "SET_STATUS":
      return {
        ...state,
        status: action.payload,
      };
    default:
      return state;
  }
};
export default poiForensicsReducer;
