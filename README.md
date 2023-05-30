# Fake news debunker by InVID & WeVerify

This plugin has been designed as a verification “Swiss army knife” helping journalists to save time and be more efficient in their fact-checking and debunking tasks on social networks especially when verifying videos and images.

The provided tools allow you to quickly get contextual information on Facebook and YouΤube videos, to perform reverse image search on Google, Baidu or Yandex search engines, to fragment videos from various platforms (Facebook, Instagram, YouTube, Twitter, Daily Motion) into keyframes, to enhance and explore keyframes and images through a magnifying lens, to query Twitter more efficiently through time intervals and many other filters, to read video and image metadata, and to apply forensic filters on still images.

For further details about the tool and the already released versions, please visit the plugin [website](https://weverify.eu/verification-plugin/).

For any feedback (bugs, enhancement, suggestions), please use the feeback tool within the plugin (on bottom right).

This plugin was initially developed by the InVID European project (2016-2018), a Horizon 2020 Innovation Action funded by the European Union under Grant Agreement 687786. It is now maintained and further enhanced by the WeVerify European project (2018-2021). WeVerify is a new Horizon 2020 Innovation Action funded by the European Union under Grant Agreement 825297.

For more information about those two projects, visit the [WeVerify website](https://weverify.eu/), [InVID website](http://www.invid-project.eu) or follow us on [InVID_EU](https://twitter.com/InVID_EU) and on [WeVerify](https://twitter.com/WeVerify).

**Disclaimer:** this software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.


## Project setup

To setup this project you need to run:

### `npm install` or `yarn install`

#### You will also need a `.env` File containing :

    REACT_APP_ELK_URL=<ELK-URL>/twinttweets/_search
    REACT_APP_TWINT_WRAPPER_URL=<TWINT-WRAPPER-URL>
    REACT_APP_FACEBOOK_APP_ID=<REACT_ID>
    REACT_APP_TRANSLATION_GITHUB=https://raw.githubusercontent.com/AFP-Medialab/InVID-Translations/react/
    REACT_APP_KEYFRAME_TOKEN=<yourKeyframeToken>
    REACT_APP_MY_WEB_HOOK_URL=<yourSlackAppUrlHook>
    REACT_APP_GOOGLE_ANALYTICS_KEY=<yourGoogleAnaliticsToken>
    REACT_APP_MAP_TOKEN=<MAP_TOKEN>
    REACT_APP_BASEURL=<TWINT-WRAPPER-URL>


####Then you need to load the extension in your browser: 

Build the extension using the available scripts to generate the file `dev` or `build`. (#some-markdown-heading)

#### For  Chrome :
- In chrome menu go to `More tools` then click `Extentions`
- Activate the `Developer mode` toggle
- The click the `Load Unpacked` button
- Select the `dev` or `build` file you generated earlier.

#### For  Firefox :
- In firefox menu click on `Add-ons`
- Then click on the gear button `⚙⌄`
- Then click on `Debug Add-ons`
- Then click on `Load TEmporary Add-on...`
- Select the `manifest.json` in the `dev` or `build` file you generated earlier.

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `yarn dev`

Runs the app in the development mode.<br>
This will run on port [3000](http://localhost:3000).

The extension will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

##Project structure

`public` : Contains the basic files for an extension (manifest.json etc) and the root htlm file (popup.html)

`src/background` : Contains the srcipts that are executed in the web browser background by the extension. The right click menu for example.

`src/contentScript`  : Contains the srcipts executed in the visited pages.(Now empty)

`src/Hooks` : Contains react custom hooks used in this project.

`src/LocalDictionary` : Contains the `components` file from this  [github repository](https://github.com/AFP-Medialab/InVID-Translations/tree/react) (This is used as a local backup for the extension if the github is unavailable)

`src/redux` : Contains react-redux actions and reducers. [Documentation](https://react-redux.js.org/) [basic Tutorial](https://www.youtube.com/watch?v=CVpUuw9XSjY)

####`src/components`

This file contains all the different components that are used in this project.

`src/components/Shared` : Contains all the components that are reused in multiple different components.

`src/components/FeedBack`: The FeedBack tool 

`src/components/PopUp`: The PopUp of the extension. 

`src/components/MySnackBar`: The little arrow that enable you to get back to the top of the page quickly.

`src/components/Navbar`: The NavBar and its Drawer (for tools) 

`src/components/NavItems`: All components that the navBar can display.

`src/components/NavItems/tools`: All components that the `tools drawer` can display.


## How do I add an item to the `Navbar` of this project ?

- First go to `src/components/Navbar/Navbar.js` file. Add an object to the `tabItems` list like so :

```
import yourImage from "./path/to/your/image";

const tabItems = [
        {
            title: "navbar_tools",
            icon:
                <Icon classes={{root: classes.iconRootTab}} fontSize={"large"}>
                    <img className={classes.imageIconTab} src={toolIcon}/>
                </Icon>,
            content: <div/>,
            path: "tools",
            footer: <div/>,
        },
        //(...)
        {
            title: "navbar_factCheck",
            icon: <ImageSearchIcon fontSize={"large"}/>,
            content: <FactCheck/>,
            path: "factCheck",
            footer: <Footer type={"afp"}/>
        },
        {
            title: "navbar_example", // Your tsv keyword for the title that you have to add to NavBar.tsv and allTools.tsv>
            icon:  <Icon classes={{root: classes.iconRootTab}} fontSize={"large"}>
                                      <img className={classes.imageIconTab} src={yourImage}/> // give our custom image
                   </Icon>,
            content: <div/>,  // the component you want to add
            path: "example", // This name will appear im the url when your tab is selected.
            footer: <div/> // The appropriate footer (See `src/components/Shared/Footer` component)
        }

    ];
```
###⚠
 Dont forget to add `title` to `NavBar.tsv` file.
 
 `path` must be unique. No other object in the list should have the same `path` value.
###⚠

## How do I add a tool to this project ?

- First go to `src/components/Navbar/Navbar.js` file. Add an object to the `drawerItems` list like so :

```
const drawerItems = [
        {
            title: "navbar_tools",
            icon: <AppsIcon fontSize={"large"}
                            className={(drawerValue === 0) ? classes.selectedApp : classes.unSelectedApp}/>,
            tsvPrefix: "all",
            path: "all",
        },
        //(...)
        {
            title: "navbar_twitter_sna",
            icon: (drawerValue === 9) ? twitterSnaIconOn : twitterSnaIconOff,
            tsvPrefix: "twitter_sna",
            path: "twitterSna"
        },
        {
            title: "navbar_example", // Your tsv keyword for the title that you have to add to NavBar.tsv and allTools.tsv>
            icon: (drawerValue === 10) ? IconOn : IconOff, //An image or icon that changes on 'drawerValue' (when === 10 here)
            tsvPrefix: "example_sna", // tsvPrefix + "_help_video" should be found in allTools.tsv
            path: "example" // This name will appear im the url when your tools is selected.
        }
    ];
```

###⚠
 Dont forget to add `title` to `NavBar.tsv` and `allTools.tsv` files.

 Dont forget to add `tsvPrefix + "_help_video"` to `allTools.tsv` file.
 
 `path` must be unique. No other object in the list should have the same `path` value.
###⚠

- go to `src/components/NavBar/DrawerItem/DrawerItem.js` file. Add an object to the `drawerItemsContent` list like so :
```
const drawerItemsContent = [
        {
            content: <AllTools tools={props.drawerItems}/>,
            footer: <div/>
        },
      //(...)
        {
            content: <div/>,
            footer: <Footer type={"afp"}/>
        },
        {
            content: <YourNewToolComponent/>, // Your new tool component
            footer: <div/> // The appropriate footer (See `src/components/Shared/Footer` component)
        },
    ];
```

At this point you can display the component you want when it's selected in the drawer or the all tools menu.
Your component will be unmounted and remounted each time you switch to another item. This means the results/status of your component will be lost.
To counter this, the results you computed should be stored with redux.

##Redux `src/redux`

Redux enables you to manage a global state accessible from anny component.
These are the steps to add redux to your component.

- Create a reducer

go to `src/redux/reducers` and create a file in the appropriate location calling it `<YourTool>Reducer.js`

- create an exported function called `<YourTool>Reducer` in this file
This function takes two parameters: `defaultState` and `action`

`defaultState` : is the default state you will have in your redux global state. 
`action` : is the object that contains the action to do `action.type` and he action parameters `action.payload` (we will go into details later)

This function should contain a switch for `action.type`.
This function returns the state value.

```
const defaultState = true;
const exampleReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_TRUE":
            return true;
        case "SET_FALSE":
            return false;
        case "SET_CUSTOM":
            return action.payload;
        case "TOGGLE_STATE":
            return !state;
        default:
            return state;
    }
};
export default exampleReducer;
```
In this example if `action.type` equals :
- `SET_TRUE` the new state will be true. 
- `SET_FALSE` the new state will be false. 
- `SET_CUSTOM` the new state will be 'action.payload' value. 
- `TOGGLE_STATE` the new state will be set to the opposite. 

By default the state doesnt change.

reducers can be more complex and use objects as default state. have a look to `src/redux/reducers/tools/analysisReducer.js`

- Add your new reducer to the `src/redux/reducers/index.js` file.

import it and add it to the `allReducers`  variable.

```
// imports...
import exampleReducer from "./your/path";

const allReducers = combineReducers({
    language : languageReducer,
    //(...)
    videoRights : videoRightsReducer,
    example : exampleReducer,
});

export default allReducers;
```

- Create your actions

Go to `src/redux/actions` and create a file in the appropriate location calling it `<YourTool>Actions.js`

- Create functions corresponding to the action.type you needed. 

For example, I used `SET_TRUE`, `SET_FALSE`,`SET_CUSTOM`,`TOGGLE_STATE`.

I will create : 

```
export const setTrue = () => {
    return {
        type : "SET_TRUE",
    }
};

export const setFalse = () => {
    return {
        type : "SET_FALSE",
    }
};

//setCustom has a parameter passed as payload
export const setCustom = (bool) => {
    return {
        type : "SET_CUSTOM",
        payload : bool
    }
};

export const toggleState = () => {
    return {
        type : "TOGGLE_STATE",
    }
};
```

- You can then use these actions in anny component like this :

```
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {setTrue, setFale, setCustom, toggleState} from "./path/to/exampleActions.js";

const Example = () => {
    const myReduxState = useSelector(state => state.example);
    const dispatch = useDispatch();
    
    const setReduxStateToTrue = () => dispatch(setTrue());
    const setReduxStateCustom = (bool) => dispatch(setCustom(bool));

return (
    <div>
        The redux state is set to {myReduxState}.
        <button onClick={setReduxStateToTrue}>
            action setTrue example
        </button>
        <button onClick={() => setReduxStateCustom(true)}>
            action setCustom example (with param)
        </button>
    </div>
    );
}
```




