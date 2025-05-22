import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Snackbar from "@mui/material/Snackbar";

import { KeyboardArrowUp } from "@mui/icons-material";

import { canUserSeeTool } from "@/constants/tools";
import { TOP_MENU_ITEMS } from "@/constants/topMenuItems";
import { setFalse, setTrue } from "@/redux/reducers/cookiesReducers";
import { cleanError, cleanErrorNetwork } from "@/redux/reducers/errorReducer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import Feedback from "../Feedback/Feedback";
import MySnackbar from "../MySnackbar/MySnackbar";
import MainContentMenuTopMenuItems from "../NavBar/MainContentMenuTabItems/MainContentMenuTopMenuItems";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import ScrollTop from "../Shared/ScrollTop/ScrollTop";

/**
 *
 * @param tools {Tool[]}
 * @returns {Element}
 * @constructor
 */
const MainContent = ({ tools }) => {
  const classes = useMyStyles();

  const keyword = i18nLoadNamespace("components/NavBar");

  const dispatch = useDispatch();

  const currentLang = useSelector((state) => state.language);
  const isCurrentLanguageLeftToRight = currentLang !== "ar";

  const error = useSelector((state) => state.error.tools);
  const errorNetwork = useSelector((state) => state.error.network);

  const cookiesUsage = useSelector((state) => state.cookies);

  const role = useSelector((state) => state.userSession.user.roles);

  const userAuthenticated = useSelector(
    (state) => state.userSession.userAuthenticated,
  );

  const toolsAllowedForRole = tools.filter((tool) => {
    return canUserSeeTool(tool, role, userAuthenticated);
  });

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} id="back-to-top-anchor" />
      <MainContentMenuTopMenuItems
        className={classes.noMargin}
        topMenuItems={TOP_MENU_ITEMS}
        tools={toolsAllowedForRole}
      />
      <ScrollTop
        {...{ isCurrentLanguageLeftToRight: isCurrentLanguageLeftToRight }}
      >
        <Fab
          color="primary"
          size="large"
          aria-label="scroll back to top"
          className={classes.fabTop}
        >
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
      {error !== null && (
        <MySnackbar
          variant="error"
          message={error}
          onClick={() => dispatch(cleanError())}
          onClose={() => {}}
          sx={{ mr: 8 }}
        />
      )}
      {errorNetwork !== null && (
        <MySnackbar
          variant="error"
          message={errorNetwork}
          onClick={() => dispatch(cleanErrorNetwork())}
          onClose={() => {}}
          sx={{ mr: 8 }}
        />
      )}
      {cookiesUsage.active === null && (
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={true}
          message={keyword("cookies_message")}
          action={[
            <Button
              key={"cookies_decline"}
              color={"secondary"}
              size={"small"}
              onClick={() => dispatch(setFalse())}
            >
              {" "}
              {keyword("cookies_decline")}{" "}
            </Button>,
            <Button
              key={"cookies_accept"}
              color={"primary"}
              size={"small"}
              onClick={() => dispatch(setTrue())}
            >
              {" "}
              {keyword("cookies_accept")}{" "}
            </Button>,
          ]}
        />
      )}
      <Feedback />
    </main>
  );
};

export default MainContent;
