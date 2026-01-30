import React, { createContext, useContext, useReducer, useState } from "react";
import { useSearchParams } from "react-router-dom";

const defaultSelectionContext = {
  /** @type {string | undefined} */
  url: undefined,
  /** @type {File | undefined} */
  file: undefined,
  /** @type {(item?: (string | File | undefined)) => void} */
  setAssistantSelection: () => {},
};

const AssistantSelectionContext = createContext(defaultSelectionContext);

// if reducer needs to return an empty object, always use the same one
const emptyState = {};

export const AssistantSelectionProvider = ({ children }) => {
  const [{ url, file }, setAssistantSelection] = useReducer((state, action) => {
    if (typeof action === "undefined" || action === null) {
      return emptyState;
    }
    if (typeof action === "string") {
      // avoid re-render if setAssistantSelection is called with the same value twice
      return state.url === action ? state : { url: action };
    }
    // else it must be a File - again avoid re-render if setAssistantSelection is called
    // with the same value twice
    return state.file === action ? state : { file: action };
  }, {});

  return (
    <AssistantSelectionContext.Provider
      value={{ url, file, setAssistantSelection }}
    >
      {children}
    </AssistantSelectionContext.Provider>
  );
};

export const useUrlOrFile = () => {
  const { url, file } = useContext(AssistantSelectionContext);
  const [params] = useSearchParams();
  const fromAssistant = params.has("fromAssistant");

  // if we were redirected from the assistant then use the context
  // values as the initial defaults for our state
  const [myUrl, setUrl] = useState(fromAssistant ? url : undefined);
  const [myFile, setFile] = useState(fromAssistant ? file : undefined);

  return [myUrl, setUrl, myFile, setFile];
};

export const useSetInputFromAssistant = () => {
  const { setAssistantSelection } = useContext(AssistantSelectionContext);
  return setAssistantSelection;
};
