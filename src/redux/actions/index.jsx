import { createAction } from "@reduxjs/toolkit";

export const setDictionary = (text) => {
  return {
    type: "SET",
    payload: text,
  };
};

export const addDictionary = (label, json) => {
  return {
    type: "ADD_DICO",
    payload: {
      label: label,
      json: json,
    },
  };
};

export const toggleUnlockExplanationCheckBox = createAction(
  "TOGGLE_INTERACTIVE_EXPLANATION_CHECKBOX",
);
