import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {applyMiddleware, createStore} from "redux";

import allReducers from "./redux/reducers/index"
import createSagaMiddleware from 'redux-saga';

import {Provider} from "react-redux"
import rootSaga from "./redux/sagas";

function saveToLocalStorage(state) {
    try {
        const savedState = {
            humanRightsCheckBox: state.humanRightsCheckBox,
            interactiveExplanation: state.interactiveExplanation,
            language: state.language,
            defaultLanguage: state.defaultLanguage,
            cookies: state.cookies,
            userSession: state.userSession
        };
        const serializedState = JSON.stringify(savedState);
        localStorage.setItem('state', serializedState)

    } catch (e) {
        console.error(e)
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem("state");
        if (serializedState === null)
            return undefined;
        return JSON.parse(serializedState);
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

const persistedState = loadFromLocalStorage();

/*SAGA*/
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    allReducers,
    persistedState,  // uncomment to keep redux state on refresh,
    applyMiddleware(sagaMiddleware)
);

/*SAGA*/
sagaMiddleware.run(rootSaga)

store.subscribe(() => {
    if (store.getState().cookies !== null && store.getState().cookies)
        saveToLocalStorage(store.getState());
    else
        localStorage.removeItem('state');
});

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
