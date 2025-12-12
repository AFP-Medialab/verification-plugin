import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HashRouter, Route, Routes } from "react-router-dom";

import {
  cleanErrorNetwork,
  setErrorNetwork,
} from "@/redux/reducers/errorReducer";
import useAuthenticationAPI from "@Shared/Authentication/useAuthenticationAPI";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import AppLayout from "./components/Layout/AppLayout";
import PopUp from "./components/PopUp/PopUp";

const App = () => {
  const keyword = i18nLoadNamespace("components/Shared/utils");
  const [isOnline, setOnline] = useState(navigator.onLine);
  const dispatch = useDispatch();
  const checkInternetConnection = () => {
    if (navigator.onLine) {
      dispatch(cleanErrorNetwork());
      //console.log("online")
      if (!isOnline) {
        window.location.reload(false);
        setOnline(true);
      }
    } else {
      dispatch(setErrorNetwork(keyword("offline")));
      setOnline(false);
      //console.log("offline")
    }
  };

  const authenticationAPI = useAuthenticationAPI();
  const locationSearchStart = window.location.href.lastIndexOf("?");
  if (locationSearchStart > 0) {
    const locationSearch = window.location.href.substring(
      locationSearchStart + 1,
    );
    // console.log("Query params: ", locationSearch);
    if (locationSearch) {
      const locationParams = new URLSearchParams(locationSearch);
      const accessCode = locationParams.get("ac");
      // console.log("Found ac param: ", accessCode);
      if (accessCode) {
        authenticationAPI.login({ accessCode });
      }
    }
  }

  useEffect(() => {
    window.addEventListener("online", checkInternetConnection);
    window.addEventListener("offline", checkInternetConnection);
    checkInternetConnection();
    return () => {
      window.removeEventListener("online", checkInternetConnection);
      window.removeEventListener("offline", checkInternetConnection);
    };
  }, []);

  return (
    <HashRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: false }}
    >
      <Routes>
        <Route index path="/" element={<PopUp />} />
        <Route path={"/app/*"} element={<AppLayout />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
