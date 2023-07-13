import React from "react";
import { useSelector } from "react-redux";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const AuthenticationIcon = () => {
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );
  return (
    <div>
      {userAuthenticated && <LockOpenIcon />}
      {!userAuthenticated && <LockIcon />}
    </div>
  );
};

export default AuthenticationIcon;
