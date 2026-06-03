const homemadeStopWords = [
  "&amp;", // somehow the scrapper retrieve this instead of teh esperluette caracter
];

export const STOP_WORDS_SET = new Set([...homemadeStopWords]);
