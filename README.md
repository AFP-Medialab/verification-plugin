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

    REACT_APP_ELK_URL=http://185.249.140.38/elk/twinttweets/_search
    REACT_APP_TWINT_WRAPPER_URL=http://185.249.140.38/twint-wrapper2
    REACT_APP_KEYFRAME_TOKEN=<yourKeyframeToken>
    REACT_APP_MY_WEB_HOOK_URL=<yourSlackAppUrlHook>
    REACT_APP_GOOGLE_ANALYTICS_KEY=<yourGoogleAnaliticsToken>

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
This project was bootstrapped with [Create React Extension](https://github.com/VasilyShelkov/create-react-extension).
You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).<br>
You should also check out [React Hooks](https://reactjs.org/docs/hooks-intro.html).



