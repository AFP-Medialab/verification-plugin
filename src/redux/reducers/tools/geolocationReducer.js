const defaultState = {
    urlImage: "",
    result: null,
    loading: false,
};

const geolocationReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "GEOLOCATION_RESET":
            return {
                ...state, 
                urlImage: "",
                result: null,
                loading: false,
            }
        case "SET_GEOLOCATION_LOADING":
            return {
                ...state,
                loading: action.payload,
            }
        case "SET_GEOLOCATION_RESULT":
            return action.payload;
        default:
            return state;
    }
};
export default geolocationReducer;