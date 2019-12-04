This project was bootstrapped with [Create React Extension](https://github.com/VasilyShelkov/create-react-extension).

## Project setup

To setup this project you need to run:

### `npm install` or `yarn install`

#### You will also need a `.env` File containing :

    REACT_APP_KEYFRAME_TOKEN=[youKeyframeToken]
    REACT_APP_CHOKIDAR_USEPOLLING=true
    REACT_APP_MY_WEB_HOOK_URL=[yourSlackAppUrlHook]
    REACT_APP_ELK_URL=[yourElasticSearchUrl]
    REACT_APP_TWINT_WRAPPER_URL=[yourTwintWrapperUrl]
    REACT_APP_GOOGLE_ANALYTICS_KEY=[yourGoogleAnaliticsToken]

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

### `npm start` or `yarn start`

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

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

