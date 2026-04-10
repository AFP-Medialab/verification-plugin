import Alert from "@mui/material/Alert";

/**
 * A generic component used as a fallback when an element on the page contains an error.
 * It is assigned to the FallbackComponent variable of an ErrorBoundary so that it appears in the event of an error and does not block the entire display.
 * @param {Error} error
 * @returns
 */
const ErrorBoundaryFallback = ({ error }) => {
  return <Alert severity="error">{error.toString()}</Alert>;
};

export default ErrorBoundaryFallback;
