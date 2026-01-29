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

## Contributing

We welcome contributions! Please review our [Code of Conduct](CODE_OF_CONDUCT.md)
and [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

## Getting Started

The Verification plugin is a browser extension built with React, Redux, and WXT (Web Extension Tools) framework powered
by Vite.

1. To install the dependencies run
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

2. Add an `.env` file at the root containing environment variables with the `VITE_` prefix:
   ```
   VITE_KEYFRAME_API=<keyframe_url>
   VITE_MY_WEB_HOOK_URL=<slack_webhook_url>
   VITE_TRANSLATION_URL=<translation_server_url>
   VITE_TRANSLATION_TAG=<The current translation tag, e.g. v0.83>
   VITE_TSNA_SERVER=<tsna_url>
   VITE_ASSISTANT_URL=<assistant_url>
   VITE_DBKF_SEARCH_API=<dbkf_url>
   VITE_DBKF_SIMILARITY_API=<dbkf_similarity_url>
   VITE_BASEURL=<baseurl>
   VITE_WRAPPER=<wrapper_url>
   VITE_CAA_FORENSICS_URL=<forensics_url>
   VITE_CAA_ANALYSIS_URL=<analysis_url>
   VITE_CAA_ENVISU4_UTILS_URL=<envisu4_url>
   VITE_CAA_DEEPFAKE_URL=<deepfake_url>
   VITE_CAA_LOCATION_URL=<location_url>
   VITE_MATOMO_URL=<matomo_url>
   VITE_MATOMO_DOMAIN=<matomo_domain>
   MATOMO_SITE=<matomo_site>
   VITE_LOCCUS_URL=<loccus_url>
   VITE_AFP_REVERSE_SEARCH_URL=<reversesearch_url>
   VITE_SEMANTIC_SEARCH_URL=<semanticsearch_url>
   ARCHIVE_BACKEND=<archive_url>
   ```

   **Note**: Only variables prefixed with `VITE_` are exposed to client code.

## Build the project

WXT provides commands for building the extension for different browsers:

- Run the `dev` script to build the extension in development mode with watch
  ```
  npm run dev
  ```

- Build for specific browsers in development mode:
  ```
  npm run dev:chrome
  npm run dev:firefox
  ```

- Build for production:
  ```
  npm run build
  ```

- Build for specific browsers in production:
  ```
  npm run build:chrome:production
  npm run build:firefox:production
  npm run build:safari:production
  ```

WXT features:

- Fast builds powered by Vite
- Hot Module Replacement (HMR) during development
- Automatic manifest generation from `wxt.config.js`
- Multi-browser support (Chrome, Firefox, Safari)
- Convention-based structure with entry points in `src/entrypoints/`

## Translations

The plugin is translated into 8 languages: English, French, Spanish, Greek, Italian, Arabic, German and Japanese.

InVID-Translations repository: https://github.com/AFP-Medialab/InVID-Translations

- Update the relevant translations file using tabs to separate the translations
- For quotation marks, use single quotation mark `'` as double quotation marks `"` are not allowed
- Set `VITE_TRANSLATION_URL` to the staging URL
    - Register as a staging user to be granted access
    - Prevents test and page visits being added to production analytics server
    - Use when working on translations as this is a non-cached translation and a page refresh will show the changes
- Set `VITE_TRANSLATION_URL` to the production URL
    - There is a caching mechanism meaning changes are shown once the cache is reset (~once a day)
    - Set `VITE_TRANSLATION_TAG` to the branch in the InVID translations currently being worked on

### Offline Translations

Scripts for creating the offline translations are in this
repository: [verification-plugin-translation-scripts](https://github.com/AFP-Medialab/verification-plugin-translation-scripts)

For offline translations, edit and
run [this jupyter notebook](https://github.com/AFP-Medialab/verification-plugin-translation-scripts/blob/main/local-languages.ipynb)
to generate the JSON files

- Edit `invid_translation_project_path=<TRANSLATIONS-PATH>` to local folder for the InVID-Translations
- Edit `TARGET_PROJECT_HOME=<FRONTEND-PATH>` to local Verification Plugin folder
- If `write_to_file = True` then the `tsv` to `JSON` conversion will be done, otherwise it will just do a dry run
- Generates English: `public/locales/en/components/NavItems/tools/Assistant.json`
- Generates Arabic: `public/locales/ar/components/NavItems/tools/Assistant.json`
- This script is run before deployment so it's not necessary to run everytime there is an update

## Load the extension on the browser

#### Google Chrome / Chromium-based browsers

[Chrome for Developers documentation](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)

1. Build the extension first:
   ```
   npm run build
   ```
   or for development build:
   ```
   npm run build:chrome:development
   ```

2. Go to the Extensions page by entering [chrome://extensions/](chrome://extensions/) in a new tab.
3. Enable **Developer Mode** by clicking the toggle switch next to Developer mode.
4. Click the **Load unpacked** button and select the extension directory:
    - Navigate to `build/chrome-mv3` (for Chrome builds)

**Note**: WXT outputs built extensions to `build/<browser>-mv3/` directories. The exact path depends on the target
browser specified in the build command.

## Testing

The [playwright](https://playwright.dev/) framework is used for e2e, component and unit testing. All tests are located
in the `tests` folder with the following structure:

```

tests
!- component_unit - Component and unit testing
|- e2e - End to end testing
-- examples - Examples to serve as a reference only

```

**Note: Before running all (or just e2e) tests, the extension must first be built using `npm run build`. See
End-to-end (e2e) testing section for more details**

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
Transpiling and bundling of assets are done on the fly using [Vite](https://vitejs.dev/).

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

The compiled extension in the `./build/chrome-mv3` directory can be loaded into the browser by using the fixture code in
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
