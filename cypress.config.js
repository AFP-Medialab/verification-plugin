const path = require("path");
const { defineConfig } = require("cypress");
module.exports = defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        /* ... */
        console.log("launching browser %o", browser);
        if (browser.family === "chromium") {
          // we could also restrict the extension
          // to only load when "browser.isHeaded" is true
          const extensionFolder = path.resolve(__dirname, "build");

          console.log("adding React DevTools extension from", extensionFolder);
          launchOptions.extensions.push(extensionFolder);
          //launchOptions.args.push(`--load-extension=${extensionFolder}`);

          return launchOptions;
        }
      });
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
