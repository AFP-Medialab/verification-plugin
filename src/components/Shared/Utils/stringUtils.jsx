// From exifr package
export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// From exifr package
export function prettyCase(string) {
  const matchRegex =
    /([A-Z]+(?=[A-Z][a-z]))|([A-Z][a-z]+)|([0-9]+)|([a-z]+)|([A-Z]+)/g;
  return string.match(matchRegex).map(capitalize).join(" ");
}
