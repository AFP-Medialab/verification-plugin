let browser_language = window.navigator.language.split("-")
  ? window.navigator.language.split("-")[0]
  : null;

export function getSupportedBrowserLanguage() {
  let language_list = ["en", "es", "fr", "el"];
  if (browser_language !== null && language_list.includes(browser_language)) {
    return browser_language;
  }
  return undefined;
}
