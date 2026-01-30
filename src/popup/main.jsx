import { CacheProvider } from "@emotion/react";
import React from "react";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import createCache from "@emotion/cache";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import AppWrapper from "../AppWrapper";
import App from "../content/views/App";
import "../i18n";
import "../index.css";
import allReducers from "../redux/reducers";
import rootSaga from "../redux/sagas";

function saveToLocalStorage(state) {
  try {
    const savedState = {
      humanRightsCheckBox: state.humanRightsCheckBox,
      interactiveExplanation: state.interactiveExplanation,
      language: state.language,
      defaultLanguage: state.defaultLanguage,
      ltr: state.ltr,
      cookies: state.cookies,
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

const persistedState = loadFromLocalStorage();
const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: allReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).prepend(sagaMiddleware),
  preloadedState: persistedState,
});
sagaMiddleware.run(rootSaga);

store.subscribe(() => {
  if (store.getState().cookies !== null && store.getState().cookies)
    saveToLocalStorage(store.getState());
  else localStorage.removeItem("persist:state");
});

const container = document.getElementById("root");
const root = createRoot(container);
export const muiCache = createCache({
  key: "mui",
  prepend: true,
});

root.render(
  <Suspense>
    <Provider store={store}>
      <CacheProvider value={muiCache}>
        <AppWrapper>
          <App />
        </AppWrapper>
      </CacheProvider>
    </Provider>
  </Suspense>,
);
