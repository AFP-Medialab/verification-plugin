import { convertMomentToGMT } from "../../../Shared/DateTimePicker/convertToGMT";
export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}

export const createUrl = (
  term,
  account,
  filter,
  lang,
  geocode,
  near,
  within,
  from_date,
  to_date,
  localTime,
) => {
  let twitter_url = "https://twitter.com/search?&src=typed_query&f=top&q=";
  twitter_url = twitter_url + replaceAll(term, "#", "%23");
  if (account !== "") {
    twitter_url += "%20from:" + account;
  }
  if (filter !== "") {
    twitter_url += "%20filter:" + filter;
  }
  if (lang !== "") {
    twitter_url += "%20lang:" + lang;
  }
  if (geocode !== "") {
    twitter_url += "%20geocode:" + geocode;
  }
  if (near !== "") {
    twitter_url += "%20near:" + near;
    if (within !== "") {
      twitter_url += "%20within:" + within;
    }
  }
  if (from_date) {
    let epoch =
      localTime === "false" ? convertMomentToGMT(from_date) : from_date;
    twitter_url += "%20since%3A" + epoch.toDate().getTime() / 1000;
  }
  if (to_date) {
    let epoch = localTime === "false" ? convertMomentToGMT(to_date) : to_date;
    twitter_url += "%20until%3A" + epoch.toDate().getTime() / 1000;
  }
  // twitter_url = twitter_url + "&src=typd"
  return twitter_url;
};
