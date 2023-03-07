import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTwitterSnaLoading,
  setTwitterSnaResult,
} from "../../../../../redux/reducers/tools/twitterSnaReducer";
import _ from "lodash";

const useTwitterSnaRequest = (request) => {
  const dispatch = useDispatch();
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated
  );
  const userToken = useSelector(
    (state) => state.userSession && state.userSession.accessToken
  );
  const userLogined = useSelector(
    (state) => state.userSession && state.userSession.user
  );
  const refreshtoken = useSelector(
    (state) => state.userSession && state.userSession.refreshToken
  );
  const storeLanguage = useSelector((state) => state.language);

  useEffect(() => {
    // Check request
    if (
      _.isNil(request) ||
      _.isNil(request.keywordList) ||
      (_.isEmpty(request.keywordList) && _.isEmpty(request.keywordAnyList)) ||
      // || (_.isNil(request.userList) || _.isEmpty(request.userList))
      _.isNil(request.from) ||
      _.isNil(request.until)
    ) {
      dispatch(
        setTwitterSnaResult({ request: request, result: null, loading: false })
      );
      return;
    }

    dispatch(setTwitterSnaLoading(true));

    if (userAuthenticated) {
      // ici la redirection vers le serveur
      //construite la requête avec:
      // 1 - le contenu request
      // 2 - le token d'authentification
      const requestData = encodeURIComponent(JSON.stringify(request));
      const userData = encodeURIComponent(JSON.stringify(userLogined));
      // userToken
      window.open(
        process.env.REACT_APP_TSNA_SERVER +
          "pluginredirect?data=" +
          requestData +
          "&token=" +
          userToken +
          "&refreshToken=" +
          refreshtoken +
          "&user=" +
          userData +
          "&lang=" +
          storeLanguage
      );
      dispatch(setTwitterSnaLoading(false));
    } else {
      /* TODO:empty */
    }
  }, [JSON.stringify(request)]);
};
export default useTwitterSnaRequest;
