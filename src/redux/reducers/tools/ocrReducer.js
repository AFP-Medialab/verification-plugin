const defaultState = {
    url: undefined,
    filename:undefined,
    binaryImage: undefined,
    b64Content: undefined,
    loading : false,
    fail: false,
    errorKey: null,
    done: false,
    result: null,
    scripts: null,
    selectedScript: "loop",
    fastTextLanguages: null,
    feedbackScripts: null,
    fullText: null,
    reprocessBlockLoading: false,
    reprocessBlockOpen: false
};


const ocrReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_OCR_INPUT":
        case "SET_OCR_RESULT":
        case "SET_IMAGE_FILENAME":
        case "SET_IMAGE_BINARY":
        case "SET_B64_CONTENT":
        case "SET_OCR_ERROR_KEY":
        case "SET_SCRIPTS":
        case "SET_SELECTED_SCRIPT":
        case "SET_FASTTEXT_LANGUAGES":
        case "SET_FEEDBACK_SCRIPTS":
        case "SET_REPROCESS_LOADING":
        case "SET_REPROCESS_OPEN":
            return Object.assign({}, state, action.payload)
        case "OCR_CLEAN_STATE":
            return {...state,
                url: undefined,
                filename:undefined,
                binaryImage: undefined,
                b64Content: undefined,
                loading : false,
                errorKey: null,
                fail: false,
                done: false,
                result: null,
                fullText: null,
                selectedScript: "loop",
                reprocessBlockLoading: false,
                reprocessBlockOpen: false};
        default:
            return state;
    }
};
export default ocrReducer;


// todo: remove. here until UI mock ups are all sent through so I don't need to bother making any actual calls to the API
// const defaultState = {
//     url: "https://i.redd.it/qdd749l2y2l11.jpg",
//     binaryImage: undefined,
//     loading : false,
//     fail: false,
//     errorKey: null,
//     done: true,
//     result: {"script":{"code":"arab","name":"Arabic","probability":0.6002758912244689},"bounding_boxes":[{"text":"خبر عاجل من الصین","bounding_box":[[306,69],[905,69],[905,159],[306,159]],"language":{"code":"ar","name":"Arabic","probability":0.6532930731773376},"script":{"code":"arab","name":"Arabic","probability":1.0}},{"text":"我不去上斑略旧是仰知道了仰不是: 也不要因力自己不喜弥仰就行峨  仰 他家是介付公的都是我仰都要咲付公 怒公多事都汲有了当初的自己会来告浜 と又是滋梓了 滋公早透汲有好消息","bounding_box":[[0,234],[1227,234],[1227,681],[0,681]],"language":{"code":"zh","name":"Chinese","probability":0.9754168391227722},"script":{"code":"jpan","name":"Han, Hiragana, and Katakana","probability":-1.0}},{"text":"الله يستر","bounding_box":[[503,777],[769,777],[769,862],[503,862]],"language":{"code":"ar","name":"Arabic","probability":0.9315743446350098},"script":{"code":"arab","name":"Arabic","probability":1.0}},{"text":"إنشالله تكون إشاعة","bounding_box":[[326,855],[887,855],[887,951],[326,951]],"language":{"code":"ar","name":"Arabic","probability":0.9987024068832397},"script":{"code":"arab","name":"Arabic","probability":1.0}}]},
//     fullText: "خبر عاجل من الصین 我不去上斑略旧是仰知道了仰不是: 也不要因力自己不喜弥仰就行峨 仰 他家是介付公的都是我仰都要咲付公 怒公多事都汲有了当初的自己会来告浜 と又是滋梓了 滋公早透汲有好消息 الله يستر إنشالله تكون إشاعة",
//     scripts: {"auto":"Auto Detect (Single Script)","loop":"Auto Detect (Multiple Scripts)","arab":"Arabic","beng":"Bengali-Assamese","cyrl":"Cyrillic","deva":"Devanagari","hans":"Han (simplified variant)","hant":"Han (traditional variant)","hang":"Hangul","jpan":"Han, Hiragana, and Katakana","latn":"Latin","taml":"Tamil","telu":"Telugu"},
//     selectedScript: "loop",
//     reprocessBlockLoading: false,
//     reprocessBlockOpen: false
// };
