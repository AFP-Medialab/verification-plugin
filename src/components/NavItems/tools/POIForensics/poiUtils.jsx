/**
 * Enumeration that contains person of interest whose biometrics model has been
 * developped.
 * It is displayed as chekboxes in the POI Forensics features.
 */
export const getPersonOfInterest = (keyword) => ({
  MACRON: {
    DISPLAY_NAME: `${keyword("poi_forensics_macron")}`,
    NAME_TOSEND: "Macron",
  },
  PUTIN: {
    DISPLAY_NAME: `${keyword("poi_forensics_putin")}`,
    NAME_TOSEND: "Putin_ru",
  },
  Zelensky: {
    DISPLAY_NAME: `${keyword("poi_forensics_zelensky")}`,
    NAME_TOSEND: "Zelensky_ru",
  },
  Meloni: {
    DISPLAY_NAME: `${keyword("poi_forensics_meloni")}`,
    NAME_TOSEND: "GiorgiaMeloni",
  },
});
