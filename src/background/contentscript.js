var s = document.createElement("script");
// must be listed in web_accessible_resources in manifest.json
console.log("AAAAHHHHHH");
s.src = chrome.runtime.getURL("inject.js");
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
