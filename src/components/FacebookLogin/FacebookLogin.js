const FB = {};
window.fbAsyncInit = function () {
    FB.init({
        appId: "697724640623413",
        cookie: true,
        xfbml: true,
        version: "v3.2"
    });
    FB.AppEvents.logPageView();
};

(function (d, s, id) {
    let js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, "script", "facebook - jssdk"));

export function checkLoginState() {//call whenever you want to check if a user is logged
    FB.getLoginStatus(function (response) {
        console.log(response)
        if (response.status === "connected") {
            // The user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user’s ID, a valid access token, a signed
            // request, and the time the access token
            // and signed request each expire.
            FB.api("/me", {fields: "id,name,first_name,last_name,email"}, function (response) {
                    //response.first_name -> User First Name
                    //response.last_name -> User Last Name
                    //response.email -> User Email
                    //https://graph.facebook.com/’ + response.id + ’/picture?type=normal -> User Avatar
                }
            );
//access_token -> response.authResponse.accessToken
            //expiresIn -> response.authResponse.expiresIn
//reauthorize_required_in -> response.authResponse.reauthorize_required_in
//signedRequest -> response.authResponse.signedRequest
//userID -> response.authResponse.userID
//access_token -> response.authResponse.accessToken
        } else if (response.status === "not_authorized")
        {
            // The user hasn’t authorized your application.
        }
    else
        {
            // The user isn’t logged in to Facebook.
        }
    })
    ;
}