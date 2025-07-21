import React from "react";
import { Trans } from "react-i18next";

// Links

export function TransSupportedToolsLink({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="supported_tools_link"
      components={{
        supportedToolsLink: (
          <a
            href="https://gatenlp.github.io/we-verify-app-assistant/supported-tools"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
      }}
    />
  );
}

export function TransSupportedUrlsLink({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="supported_urls_link"
      components={{
        supportedUrlsLink: (
          <a
            href="https://gatenlp.github.io/we-verify-app-assistant/supported-urls"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
      }}
    />
  );
}

export function TransUrlDomainAnalysisLink({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="url_domain_analysis_link"
      components={{
        urlDomainAnalysisLink: (
          <a
            href="https://gatenlp.github.io/domain-analysis-lists/"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
      }}
    />
  );
}

export function TransNamedEntityRecogniserLink({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="named_entity_link"
      components={{
        namedEntityRecogniserLink: (
          <a
            href="https://gatenlp.github.io/we-verify-app-assistant/supported-tools#named-entity-recogniser"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
      }}
    />
  );
}

export function TransCredibilitySignalsLink({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="credibility_signals_link"
      components={{
        credibilitySignalsLink: (
          <a
            href="https://gatenlp.github.io/we-verify-app-assistant/supported-tools#credibility-signals"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
      }}
    />
  );
}

export function TransMultilingualStanceLink({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="multilingual_stance_link"
      components={{
        multilingualStanceLink: (
          <a
            href="https://gatenlp.github.io/we-verify-app-assistant/supported-tools#stance-classifier"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
      }}
    />
  );
}

// Tooltips

export function TransSourceCredibilityTooltip({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="sc_tooltip"
      components={{
        ul: <ul />,
        li: <li />,
        strongWarning: (
          <strong
            style={{
              background: "#d32f2f",
              paddingBottom: "0.2em",
              paddingRight: "0.1em",
              paddingLeft: "0.1em",
            }}
          />
        ),
        strongMentions: (
          <strong
            style={{
              background: "#ed6c02",
              paddingBottom: "0.2em",
              paddingRight: "0.1em",
              paddingLeft: "0.1em",
            }}
          />
        ),
        strongFactChecker: (
          <strong
            style={{
              background: "#2e7d32",
              paddingBottom: "0.2em",
              paddingRight: "0.1em",
              paddingLeft: "0.1em",
            }}
          />
        ),
      }}
    />
  );
}

export function TransPersuasionTechniquesTooltip({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="persuasion_techniques_tooltip"
      components={{
        ul: <ul />,
        li: <li />,
      }}
    />
  );
}

export function TransMachineGeneratedTextTooltip({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="machine_generated_text_tooltip"
      components={{
        ul: <ul />,
        li: <li />,
        highlyLikelyHuman: (
          <strong
            style={{
              background: "#00fc00",
              color: "black",
              paddingBottom: "0.2em",
              paddingRight: "0.1em",
              paddingLeft: "0.1em",
            }}
          />
        ),
        likelyHuman: (
          <strong
            style={{
              background: "#aaff00",
              color: "black",
              paddingBottom: "0.2em",
              paddingRight: "0.1em",
              paddingLeft: "0.1em",
            }}
          />
        ),
        likelyMachine: (
          <strong
            style={{
              background: "#fcaa00",
              color: "black",
              paddingBottom: "0.2em",
              paddingRight: "0.1em",
              paddingLeft: "0.1em",
            }}
          />
        ),
        highlyLikelyMachine: (
          <strong
            style={{
              background: "#fc0000",
              paddingBottom: "0.2em",
              paddingRight: "0.1em",
              paddingLeft: "0.1em",
            }}
          />
        ),
      }}
    />
  );
}

const stanceSupportColour = "#2e7d32";
const stanceQueryColour = "#ed6c02";
const stanceDenyColour = "#d32f2f";
const stanceCommentColour = "#757575";

export function TransMultilingualStanceTooltip({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="multilingual_stance_tooltip"
      components={{
        ul: <ul />,
        li: <li />,
        strongSupport: (
          <strong
            style={{
              background: stanceSupportColour,
              paddingBottom: "0.2em",
              paddingRight: "0.1em",
              paddingLeft: "0.1em",
            }}
          />
        ),
        strongQuery: (
          <strong
            style={{
              background: stanceQueryColour,
              paddingBottom: "0.2em",
              paddingRight: "0.1em",
              paddingLeft: "0.1em",
            }}
          />
        ),
        strongDeny: (
          <strong
            style={{
              background: stanceDenyColour,
              paddingBottom: "0.2em",
              paddingRight: "0.1em",
              paddingLeft: "0.1em",
            }}
          />
        ),
        strongComment: (
          <strong
            style={{
              background: stanceCommentColour,
              paddingBottom: "0.2em",
              paddingRight: "0.1em",
              paddingLeft: "0.1em",
            }}
          />
        ),
      }}
    />
  );
}

// Whitespace

export function TransHtmlDoubleLineBreak({ keyword }) {
  return <Trans t={keyword} i18nKey="html_double_line_break" />;
}

export function TransHtmlSingleLineBreak({ keyword }) {
  return <Trans t={keyword} i18nKey="html_single_line_break" />;
}
