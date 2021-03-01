export const setTrue = () => {
    return {
        type : "SET_TRUE",
    }
};

export const setFalse = () => {
    return {
        type : "SET_FALSE",
    }
};

//setCustom has a parameter passed as payload
export const setCustom = (bool) => {
    return {
        type : "SET_CUSTOM",
        payload : bool
    }
};

export const toggleState = () => {
    return {
        type : "TOGGLE_STATE",
    }
};