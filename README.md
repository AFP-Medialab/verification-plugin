# Fake news debunker by InVID, WeVerify and vera.ai

This plugin is a verification “Swiss army knife” helping journalists to save time and be more
efficient in their fact-checking and debunking tasks on social networks especially when verifying videos and images.

The provided tools allow you to quickly get contextual information on Facebook and YouTube videos, perform a reverse
image search on Google, Baidu or Yandex search engines, to fragment videos from various platforms (Facebook, Instagram,
YouTube, Twitter, Daily Motion) into keyframes, to enhance and explore keyframes and images through a magnifying lens,
to query Twitter more efficiently through time intervals and many other filters, to read video and image metadata, and
to apply forensic filters on still images.

For further details about the tool and the already released versions, please visit the plugin page on our latest
project [website](https://www.veraai.eu/category/verification-plugin/).

**For any feedback (bugs, enhancement, suggestions), please use the feedback tool within the plugin (on the bottom
right) or file an issue on GitHub.**

This plugin was initially developed by the InVID European project (2016-2018), a Horizon 2020 Innovation Action funded
by the European Union under Grant Agreement 687786. It has been enhanced by the WeVerify European project (2018-2021), a
Horizon 2020 Innovation Action funded by the European Union under Grant Agreement 825297. Since September 2022, it is
improved within the [vera.ai project](https://veraai.eu) under Grant Agreement 101070093.

For more information about those three projects, visit the [vera.ai website](https://veraai.eu),
the [WeVerify website](https://weverify.eu/), and [InVID website](http://www.invid-project.eu) or follow us
on [veraai_eu](https://twitter.com/veraai_eu), [InVID_EU](https://twitter.com/InVID_EU) or
on [WeVerify](https://twitter.com/WeVerify).

**Disclaimer:** This software is provided "as is", without warranty of any kind, express or implied, including but not
limited to the warranties of merchantability, fitness for a particular purpose and non-infringement. In no event shall
the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract,
tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.

## Getting Started

The Verification plugin is a browser based plugin built with React and Redux.

1. To install the dependencies run
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Add an `.env` file at the root containing
   ```
   REACT_APP_ELK_URL=<ELK-URL>/twinttweets/_search
   REACT_APP_TWINT_WRAPPER_URL=<TWINT-WRAPPER-URL>
   REACT_APP_FACEBOOK_APP_ID=<REACT_ID>
   REACT_APP_TRANSLATION_GITHUB=https://raw.githubusercontent.com/AFP-Medialab/InVID-Translations/react/
   REACT_APP_KEYFRAME_TOKEN=<yourKeyframeToken>
   REACT_APP_MY_WEB_HOOK_URL=<yourSlackAppUrlHook>
   REACT_APP_GOOGLE_ANALYTICS_KEY=<yourGoogleAnaliticsToken>
   REACT_APP_MAP_TOKEN=<MAP_TOKEN>
   REACT_APP_BASEURL=<TWINT-WRAPPER-URL>
   ```

## Build the project

- Run the `dev` script to build the React app in development mode
  ```
  npm run dev
  ```

- Run the `build` to build the React app for production
  ```
  npm run build
  ```


## Load the extension on the browser

#### Google Chrome / Chromium-based browsers

[Chrome for Developers documentation](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)

- Go to the Extensions page by entering [chrome://extensions/](chrome://extensions/) in a new tab.  
- Enable **Developer Mode** by clicking the toggle switch next to Developer mode.
- Click the **Load unpacked** button and select the extension directory (go inside the `build` folder).

#### Firefox ( ⚠️ deprecated)

- In firefox menu click on `Add-ons`
- Then click on the gear button `⚙⌄`
- Then click on `Debug Add-ons`
- Then click on `Load TEmporary Add-on...`
- Select the `manifest.json` in the `dev` or `build` file you generated earlier.

## Project folders structure

`public` the configuration files for an extension `manifest.json` and the root html file `popup.html`

`src/background` scripts executed in the web browser background by the extension. The contextual menu for example.

`src/Hooks` Custom hooks used in this project.

`src/LocalDictionary` The offline translation files fallback used when the server cannot provide the translation

`src/redux` react-redux actions and
reducers. [Documentation](https://react-redux.js.org/)

`src/components` The main custom React components used in this project.

`src/components/Shared` Small React components reused in other components.

`src/components/FeedBack`The FeedBack tool

`src/components/PopUp` The extension's PopUp

`src/components/MySnackBar` The arrow to get back to the top of the page.

`src/components/Navbar` The NavBar and its Drawer (for tools)

`src/components/NavItems` All the components displayed by the navBar.

`src/components/NavItems/tools` All components that the `tools drawer` can display.

## Testing

The [playwright](https://playwright.dev/) framework is used for e2e, component and unit testing. All tests are located
in the `tests` folder with the following structure:

```
tests
!- component_unit - Component and unit testing
|- e2e - End to end testing
-- examples - Examples to serve as a reference only 
```

**Note: Before running all (or just e2e) tests, the extension must first be built. See End-to-end (e2e) testing section
for more details**

All tests (e2e, component & unit) can be run using the command:

```
npm run test
```

### Component and Unit testing

Component and unit testing are run together using the following command:

```
npm run test-cu
```

Playwright configurations of the component and unit tests can be found in `/playwright-ct.config.js`

Component and unit testing uses the
experimental [playwright component testing module](https://playwright.dev/docs/test-components).
When running tests, the browser loads the page in `./playwright/index.html` and any resources
in `./playwright/index.jsx`.
Tests can then mount a component directly on the page and run tests similar to e2e testing.
Transpiling and bundling of assets are done on the fly using [vitejs](https://vitejs.dev/) instead
of webpack.

Note: Component testing is best done on components that can be easily isolated. Ones that rely on redux or routing
are likely to be more suitable for e2e testing.

Note: Playwright/vite generates cache files at `/playwright/.cache` which sometimes does not get updated properly
when `.jsx` files changes, so currently the command `npm run test-cu` deletes the cache directory before running the
tests.

### End-to-end (e2e) testing

E2E testing can be run using the following command:

```
npm run test-e2e
```

Playwright configurations of the e2e tests can be found in `/playwright.config.ts`.

Before running all (or just e2e) tests, the extension must first be built using `npm run build`.

The compiled WeVerify extension in the `./build` directory can be loaded into the browser by using the fixture code in
`/tests/e2e/fixtures.ts`. All e2e tests of the extension should import the overridden `test` and `expect` functions in
the `fixtures.ts` file.

The overridden `test` function provides an additional `extensionId` variable in the handler function which is
needed to navigate to the location of the extension.

The following code shows how we can navigate to the root page of the extension:

```javascript
import {test, expect} from './fixtures';

test('Example extension test', async ({page, extensionId}) => {
    // Navigates to the root page of the plugin 
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    // ... test whatever functions
});
```

#### E2E UI mode

UI mode is for e2e test can be run using:

```
npm run test-e2e-ui
```

This will open a browser with interactive testing environment which can be useful for debugging.
