const defaultState = {
    selected: 0,
    analysis: {
        notification : false,
        loading : false,
        url: "",
        result: null,
    },
    keyframes: {
        notification : false,
        loading : false,
        url: "",
        result: null,
        message : "",
    },
    thumbnails: {
        notification : false,
        loading : false,
        url: "",
        result: null,
    },
    magnifier: {
        notification : false,
        loading : false,
        url: "",
        result: null,
    },
    metadata: {
        isImage : true,
        notification : false,
        loading : false,
        url: "",
        result: null,
    },
    videoRights: {
        notification : false,
        loading : false,
        url: "",
        result: null,
    },
    forensic: {
        notification : false,
        loading : false,
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
        case "SET_ANALYSIS_LOADING":
            state.analysis.loading = action.payload;
            return state;
        case "SET_KEYFRAMES_LOADING":
            state.keyframes.loading = action.payload;
            return state;
        case "SET_THUMBNAILS_LOADING":
            state.thumbnails.loading = action.payload;
            return state;
        case "SET_MAGNIFIER_LOADING":
            state.magnifier.loading = action.payload;
            return state;
        case "SET_METADATA_LOADING":
            state.metadata.loading = action.payload;
            return state;
        case "SET_VIDEO_RIGHTS_LOADING":
            state.videoRights.loading = action.payload;
            return state;
        case "SET_FORENSIC_LOADING":
            state.forensic.loading = action.payload;
            return state;
        case "SET_KEYFRAMES_MESSAGE":
            state.keyframes.message = action.payload;
            return state;
        case "SET_METADATA_IS_IMAGE":
            state.metadata.isImage = action.payload;
            return state;
        case "CLEAN_STATE":
            return defaultState;
        default:
            return state;
    }
};
export default toolReducer;