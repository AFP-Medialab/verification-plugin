import React from 'react';
import { useSelector } from 'react-redux';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';


const AuthenticationIcon = (porps) => {

    const userAuthenticated = useSelector(state => state.userSession && state.userSession.userAuthenticated);

    /*
    if(userAuthenticated){
        console.log("LOGGED");
    }else{
        console.log("NO");
    }
    */

    return (

        <div>

            {userAuthenticated && 
                <LockOpenIcon />
            }

            {!userAuthenticated && 
                <LockIcon />
            }

        </div>

    )


}

export default AuthenticationIcon;