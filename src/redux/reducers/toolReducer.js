const defaultState = {
    selected: 0,
    analysis: {
        url: "",
        result: null,
    },
    keyframes: {
        url: "",
        result: null,
    },
    thumbnails: {
        url: "",
        result: null,
    },
    magnifier: {
        url: "",
        result: null,
    },
    metadata: {
        url: "",
        result: null,
    },
    videoRights: {
        url: "",
        result: null,
    },
    forensic: {
        url: "",
        result: null,
    },
};


const toolReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SELECT_TOOL":
            state.selected = action.payload;
            return state;
        case "SET_ANALYSIS_RESULT":
            state.analysis = action.payload;
            return state;
        case "SET_KEYFRAMES_RESULT":
            state.keyframes = action.payload;
            return state;
        case "SET_THUMBNAILS_RESULT":
            state.thumbnails = action.payload;
            return state;
        case "SET_MAGNIFIER_RESULT":
            state.magnifier = action.payload;
            return state;
        case "SET_METADATA_RESULT":
            state.metadata = action.payload;
            return state;
        case "SET_VIDEO_RIGHTS_RESULT":
            state.videoRights = action.payload;
            return state;
        case "SET_FORENSIC_RESULT":
            state.forensic = action.payload;
            return state;
        default:
            return state;
    }
};
export default toolReducer;