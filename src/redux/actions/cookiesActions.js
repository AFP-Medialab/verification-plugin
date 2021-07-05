export const setTrue = () => {
    return {
        type : "SET_TRUE",
    }
};

export const setStorageTrue = () => {
    return {
        type : "SET_STORAGE_TRUE",
    }
};

export const setFalse = () => {
    return {
        type : "SET_FALSE",
    }
};

export const toggleState = (cookiestate) => {
    return {
        type: "TOGGLE_STATE",
        payload: !cookiestate
    }
};