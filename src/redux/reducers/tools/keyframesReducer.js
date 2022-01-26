const defaultState = {
    notification : false,
    loading : false,
    url: "",
    result: null,
    message : "",
    video_id: null,
    similarity: null,
    similarityLoading: false,
};

const keyframesReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_KEYFRAMES_RESULT":
            return { ...state,
                    notification: action.payload.notification, 
                    loading: action.payload.loading, 
                    url: action.payload.url, 
                    result: action.payload.result,
                    video_id: action.payload.video_id};
        case "SET_KEYFRAMES_LOADING":
            return {...state, loading: action.payload, };
        case "SET_KEYFRAMES_SIMILARITY_LOADING":
            return { ...state, similarityLoading: action.payload, };
        case "SET_KEYFRAMES_MESSAGE":
            return {...state, message:action.payload};
        case "KEYFRAMES_CLEAN_STATE":                        
            return {...state, url:"", result:null};
        case "KEYFRAMES_UPDATE_SIMILARITY":
            return { ...state, similarity: action.payload };
        default:
            return state;
    }
};
export default keyframesReducer;