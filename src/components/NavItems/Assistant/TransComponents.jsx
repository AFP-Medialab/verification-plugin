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

export function TransTargetObliviousStanceLink({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="target_oblivious_stance_link"
      components={{
        targetObliviousStanceLink: (
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
        strongWarning: <strong style={{ background: "#d32f2f" }} />,
        strongMentions: <strong style={{ background: "#ed6c02" }} />,
        strongFactChecker: <strong style={{ background: "#2e7d32" }} />,
      }}
    />
  );
}

const stanceSupportColour = "#2e7d32";
const stanceQueryColour = "#ed6c02";
const stanceDenyColour = "#d32f2f";
const stanceCommentColour = "#757575";

export function TransTargetObliviousStanceTooltip({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="target_oblivious_stance_tooltip"
      components={{
        ul: <ul />,
        li: <li />,
        strongSupport: <strong style={{ background: stanceSupportColour }} />,
        strongQuery: <strong style={{ background: stanceQueryColour }} />,
        strongDeny: <strong style={{ background: stanceDenyColour }} />,
        strongComment: <strong style={{ background: stanceCommentColour }} />,
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
