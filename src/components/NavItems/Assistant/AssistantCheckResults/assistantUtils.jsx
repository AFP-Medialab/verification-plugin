function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getUrlTypeFromCredScope = (string) => {
  let urlType = string.split("/")[0].replace(".com", "");
  if (urlType === "t.me") {
    urlType = "telegram";
  }
  return capitaliseFirstLetter(urlType);
};
