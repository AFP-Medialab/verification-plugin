import {setOcrDetails} from "../actions/tools/assistantActions";
import {combineEpics, ofType} from "redux-observable";
import {mapTo, mergeMap} from "rxjs/operators";
import {Observable} from "rxjs";

//
// const ocrApi = useOcrService();
//
// const startOcrServiceEpic = (action$) => {
//     return action$,
//         ofType("SET_PROCESS_URL"),
//         mergeMap((processUrl)=>
//             Observable.from(ocrApi.callOcrService(processUrl))
//         )
//
//
// }
//
//
// export const rootEpic = combineEpics(
//     startOcrServiceEpic
// )
