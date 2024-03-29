import React from "react";
import PropTypes from "prop-types";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Zoom from "@mui/material/Zoom";
import useClasses from "../MaterialUiStyles/useClasses";

const styles = (theme) => ({
  root: {
    position: "fixed",
    zIndex: theme.zIndex.drawer + 1,
  },
});

function ScrollTop(props) {
  const { children, window, isCurrentLanguageLeftToRight } = props;
  const classes = useClasses(styles);
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor",
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div
        style={{
          left: isCurrentLanguageLeftToRight ? "auto" : 14,
          right: isCurrentLanguageLeftToRight ? 14 : "auto",
          bottom: 100,
        }}
        onClick={handleClick}
        role="presentation"
        className={classes.root}
      >
        {children}
      </div>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
export default ScrollTop;
