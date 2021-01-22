export const setOcrInput = (url) => {
    return {
        type: "SET_OCR_INPUT",
        payload: {
            url: url,
        }
    }
};

export const setOcrB64Img = (b64EncodedImg) => {
    return {
        type: "SET_B64_IMG",
        payload: {
            b64Image: b64EncodedImg,
        }
    }
};

export const setOcrResult = (loading, fail, done, result) => {
    return {
        type: "SET_OCR_RESULT",
        payload: {
            loading: loading,
            fail: fail,
            done: done,
            result: result
        }
    }
}

export const setOcrErrorKey = (errorKey) => {
    return {
        type: "SET_OCR_ERROR_KEY",
        payload: {
            errorKey: errorKey,
        }
    }
};

export const cleanOcr = () => {
    return {
        type: "OCR_CLEAN_STATE"
    }
};