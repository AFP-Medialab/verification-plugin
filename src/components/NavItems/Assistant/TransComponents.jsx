import { Trans } from "react-i18next";

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
        credibilitySignalsLink: (
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

export function TransCollectedCommentsTooltip({ keyword }) {
  return <Trans t={keyword} i18nKey="collected_comments_tooltip" />;
}

export function TransTargetObliviousStanceTooltip({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="target_oblivious_stance_tooltip"
      components={{
        ul: <ul />,
        li: <li />,
        strongSupport: <strong style={{ background: "#2e7d32" }} />,
        strongDeny: <strong style={{ background: "#d32f2f" }} />,
        strongQuery: <strong style={{ background: "#ed6c02" }} />,
        strongComment: <strong style={{ background: "#0288d1" }} />,
      }}
    />
  );
}

export function TransHtmlDoubleLineBreak({ keyword }) {
  return <Trans t={keyword} i18nKey="html_double_line_break" />;
}

export function TransHtmlSingleLineBreak({ keyword }) {
  return <Trans t={keyword} i18nKey="html_single_line_break" />;
}
