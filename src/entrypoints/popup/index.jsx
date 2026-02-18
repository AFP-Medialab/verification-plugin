import { CacheProvider } from "@emotion/react";
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import createCache from "@emotion/cache";
import { configureStore } from "@reduxjs/toolkit";
import { throttle } from "lodash";
import createSagaMiddleware from "redux-saga";
import { browser } from "wxt/browser";

import AppWrapper from "../../AppWrapper";
import App from "../../content/views/App";
import "../../i18n";
import "../../index.css";
import allReducers from "../../redux/reducers";
import rootSaga from "../../redux/sagas";

async function actualSaveToLocalStorage(state) {
  try {
    const savedState = {
      humanRightsCheckBox: state.humanRightsCheckBox,
      interactiveExplanation: state.interactiveExplanation,
      language: state.language,
      defaultLanguage: state.defaultLanguage,
      ltr: state.ltr,
      cookies: state.cookies,
      userSession: state.userSession,
      tool: {
        toolName: state.tool?.toolName,
        pinnedTools: state.tool?.pinnedTools || [],
      },
    };

    // Try to use browser.storage.sync with fallback to storage.local, then localStorage
    const storage = browser.storage?.sync || browser.storage?.local;
    if (storage) {
      await storage.set({ "persist:state": savedState });
    } else {
      // Fallback to localStorage if browser.storage is not available
      const serializedState = JSON.stringify(savedState);
      localStorage.setItem("persist:state", serializedState);
    }
  } catch (e) {
    console.error("Error saving to storage:", e);
  }
}

// Use throttled version - this prevents saving too often to storage
const saveToLocalStorage = throttle(actualSaveToLocalStorage, 500, {
  leading: false,
  trailing: true,
});

async function loadFromLocalStorage() {
  try {
    // Try to use browser.storage.sync with fallback to storage.local
    const storage = browser.storage?.sync || browser.storage?.local;
    if (storage) {
      const result = await storage.get("persist:state");
      return result["persist:state"] || undefined;
    } else {
      // Fallback to localStorage if browser.storage is not available
      const serializedState = localStorage.getItem("persist:state");
      if (serializedState === null) return undefined;
      return JSON.parse(serializedState);
    }
  } catch (e) {
    console.error("Error loading from storage:", e);
    return undefined;
  }
}

// Initialize store asynchronously with persisted state
async function initializeApp() {
  const persistedState = await loadFromLocalStorage();
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: allReducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).prepend(
        sagaMiddleware,
      ),
    preloadedState: persistedState,
  });
  sagaMiddleware.run(rootSaga);

  let previousCookiesValue = store.getState().cookies;

  store.subscribe(() => {
    const currentState = store.getState();
    const currentCookies = currentState.cookies;

    if (currentCookies !== null && currentCookies) {
      // User accepted cookies - save state
      saveToLocalStorage(currentState);
    } else if (currentCookies === false && previousCookiesValue !== false) {
      // User explicitly declined cookies (changed from true/null to false) - remove storage
      const storage = browser.storage?.sync || browser.storage?.local;
      if (storage) {
        storage.remove("persist:state");
      } else {
        localStorage.removeItem("persist:state");
      }
    }

    previousCookiesValue = currentCookies;
  });

  const container = document.getElementById("root");
  const root = createRoot(container);
  const muiCache = createCache({
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
}

// Export muiCache for use in other files
export const muiCache = createCache({
  key: "mui",
  prepend: true,
});

// Start the app
initializeApp();
