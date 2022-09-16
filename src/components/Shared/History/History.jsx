import { createHashHistory } from 'history';
import { useLocation, matchPath } from 'react-router-dom';
export default createHashHistory();

export const useRouteMatch = (patterns) =>{
    const { pathname } = useLocation();
  
    for (let i = 0; i < patterns.length; i += 1) {
      const pattern = patterns[i];
      const possibleMatch = matchPath(pattern, pathname);
      if (possibleMatch !== null) {
        return possibleMatch;
      }
    }
  
    return null;
  }