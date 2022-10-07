import React from 'react';
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import allReducers from "./redux/reducers";
import "./index.css";
import rootSaga from "./redux/sagas";
import { Provider } from "react-redux";
import App from "./App";
import { createRoot } from 'react-dom/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import {persistStore, persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,} from 'redux-persist'
import storage from "redux-persist/lib/storage"

function saveToLocalStorage(state) {
  try {
    const savedState = {
      humanRightsCheckBox: state.humanRightsCheckBox,
      interactiveExplanation: state.interactiveExplanation,
      language: state.language,
      defaultLanguage: state.defaultLanguage,
      cookies: state.cookies,
      googleAnalytic: state.googleAnalytic,
      userSession: state.userSession,
    };
    const serializedState = JSON.stringify(savedState);
    localStorage.setItem("persist:state", serializedState);
  } catch (e) {
    console.error(e);
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("persist:state");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
const persistConfig = {
  key: 'state',
  storage: storage,
  whitelist: ['humanRightsCheckBox', 'interactiveExplanation', 'language', 'defaultLanguage', 'cookies', 'googleAnalytic', 'userSession']
  
}

const persistedState = loadFromLocalStorage();
const sagaMiddleware = createSagaMiddleware();
const persistedReducer = persistReducer(persistConfig, allReducers)
const store = configureStore({
  reducer: allReducers,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({ serializableCheck:{ignoredActions:["SET_METADATA_RESULT", FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]} }).prepend(sagaMiddleware),
  preloadedState: persistedState
});
sagaMiddleware.run(rootSaga);

store.subscribe(() => {
  if (store.getState().cookies !== null && store.getState().cookies)
    saveToLocalStorage(store.getState());
  else localStorage.removeItem("persist:state");
});

const container = document.getElementById('root')
const root = createRoot(container)
export const muiCache = createCache({
  'key': 'mui',
  'prepend': true
})
root.render(
  <Provider store={(store)}>
    <CacheProvider  value={muiCache}>
      <App />
    </CacheProvider>
  </Provider>
);
