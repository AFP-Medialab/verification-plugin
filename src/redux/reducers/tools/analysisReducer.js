const defaultState = {
    notification : false,
    loading : false,
    url: "",
    result: null,
};

const analysisReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_ANALYSIS_RESULT":
            return action.payload;
        case "SET_ANALYSIS_PAGINATION_COMMENTS":
            return {
                ...state,
                result: { ...state.result, comments:action.payload.comments, pagination:action.payload.pagination },
              };
        case "SET_ANALYSIS_PAGINATION_LINK_COMMENTS":
            return {
                ...state,
                result: { ...state.result, 
                    link_comments:action.payload.comments,
                    pagination:action.payload.pagination 
                    }, 
                
              };
        case "SET_ANALYSIS_PAGINATION_VERIFIED_COMMENTS":
                return {
                    ...state,
                    result: { ...state.result, 
                        verification_comments:action.payload.comments, 
                        pagination:action.payload.pagination },
                  };         
        case "SET_ANALYSIS_LOADING":
            return {...state, loading: action.payload};
        case "ANALYSIS_CLEAN_STATE":
            return {...state, result:null, url:""};
        default:
            return state;
    }
};
export default analysisReducer;