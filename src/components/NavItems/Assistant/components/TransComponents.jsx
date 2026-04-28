import React from "react";
import { Trans } from "react-i18next";

import Chip from "@mui/material/Chip";

import { STANCE_CATEGORIES, STANCE_COLOR_MAP } from "../constants";

const URLS = {
  SUPPORTED_TOOLS:
    "https://gatenlp.github.io/we-verify-app-assistant/supported-tools",
  SUPPORTED_URLS:
    "https://gatenlp.github.io/we-verify-app-assistant/supported-urls",
  DOMAIN_ANALYSIS: "https://gatenlp.github.io/domain-analysis-lists/",
  NAMED_ENTITY_RECOGNISER:
    "https://gatenlp.github.io/we-verify-app-assistant/supported-tools#named-entity-recogniser",
  CREDIBILITY_SIGNALS:
    "https://gatenlp.github.io/we-verify-app-assistant/supported-tools#credibility-signals",
  PREV_FACT_CHECKS:
    "https://gatenlp.github.io/we-verify-app-assistant/supported-tools#previous-fact-checks",
  DBKF: "https://gatenlp.github.io/we-verify-app-assistant/supported-tools#database-of-known-fakes",
  STANCE_CLASSIFIER:
    "https://gatenlp.github.io/we-verify-app-assistant/supported-tools#stance-classifier",
  GATE_SHOPFRONT: "https://cloud.gate.ac.uk/shopfront",
  DEUTSCHE_WELLE: "https://www.dw.com/",
  KINIT: "https://kinit.sk/",
  ONTOTEXT: "https://www.ontotext.com/",
  MDN_IMAGE_TYPES:
    "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types",
  MDN_VIDEO_CODECS:
    "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs",
};

// CSS STYLES

const UL_STYLE = { paddingLeft: "20px", margin: "8px 0" };
const LI_STYLE = { display: "list-item", listStyleType: "disc" };
const A_STYLE = {
  color: "#D6D6FF", // passes all tests on https://webaim.org/resources/contrastchecker/
  textDecoration: "underline",
};

// chips with colour

const CHIP_SX = {
  mx: 0.5,
  height: "16px",
  borderRadius: "4px",
  "& .MuiChip-label": { fontSize: "0.65rem", px: "6px" },
  color: "white",
};

function InlineChip({ color, children }) {
  return <Chip size="small" color={color} label={children} sx={CHIP_SX} />;
}

export function TransTooltipChip({ keyword, i18nKey, color }) {
  const mapped = color || STANCE_COLOR_MAP[i18nKey] || "default";
  const isCustomColor = mapped.startsWith("#") || mapped.startsWith("rgb");

  return (
    <Chip
      size="small"
      color={isCustomColor ? "default" : mapped}
      label={keyword(i18nKey)}
      sx={
        isCustomColor
          ? { ...CHIP_SX, backgroundColor: mapped, color: "rgba(0,0,0,0.87)" }
          : CHIP_SX
      }
    />
  );
}

// Links

export function TransSupportedToolsLink({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="supported_tools_link"
      components={{
        supportedToolsLink: (
          <a
            href={URLS.SUPPORTED_TOOLS}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
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
            href={URLS.SUPPORTED_URLS}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
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
            href={URLS.DOMAIN_ANALYSIS}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
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
            href={URLS.NAMED_ENTITY_RECOGNISER}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
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
            href={URLS.CREDIBILITY_SIGNALS}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
          />
        ),
      }}
    />
  );
}

export function TransPrevFactChecksLink({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="previous_fact_checks_link"
      components={{
        previousFactChecksLink: (
          <a
            href={URLS.PREV_FACT_CHECKS}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
          />
        ),
      }}
    />
  );
}

export function TransDbkfLink({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="dbkf_link"
      components={{
        dbkfLink: (
          <a
            href={URLS.DBKF}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
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
            href={URLS.STANCE_CLASSIFIER}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
          />
        ),
      }}
    />
  );
}

// Service acknowledgements

export function TransUsfdAuthor({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="usfd_author"
      components={{
        usfdLink: (
          <a
            href={URLS.GATE_SHOPFRONT}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
          />
        ),
      }}
    />
  );
}

export function TransDeutscheWelleAuthor({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="deutsche_welle_author"
      components={{
        deutscheWelleLink: (
          <a
            href={URLS.DEUTSCHE_WELLE}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
          />
        ),
      }}
    />
  );
}

export function TransKinitAuthor({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="kinit_author"
      components={{
        kinitLink: (
          <a
            href={URLS.KINIT}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
          />
        ),
      }}
    />
  );
}

export function TransOntotextAuthor({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="ontotext_author"
      components={{
        ontotextLink: (
          <a
            href={URLS.ONTOTEXT}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
          />
        ),
      }}
    />
  );
}

// Tooltips

export function TransAssistantHelpTwoTooltip({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="assistant_help_2"
      components={{
        b: <b />,
        ul: <ul style={UL_STYLE} />,
        li: <li style={LI_STYLE} />,
      }}
    />
  );
}

export function TransAssistantHelpThreeTooltip({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="assistant_help_3"
      components={{
        b: <b />,
        ul: <ul style={UL_STYLE} />,
        li: <li style={LI_STYLE} />,
      }}
    />
  );
}

export function TransAssistantHelpFourTooltip({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="assistant_help_4"
      components={{
        b: <b />,
        ul: <ul style={UL_STYLE} />,
        li: <li style={LI_STYLE} />,
        imageFileTypeSupportLink: (
          <a
            href={URLS.MDN_IMAGE_TYPES}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
          />
        ),
        videoFileTypeSupportLink: (
          <a
            href={URLS.MDN_VIDEO_CODECS}
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
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
        ul: <ul style={UL_STYLE} />,
        li: <li style={LI_STYLE} />,
        chipWarning: <InlineChip color="error" />,
        chipMentions: <InlineChip color="warning" />,
        chipFactChecker: <InlineChip color="success" />,
      }}
    />
  );
}

export function TransExtractedTextTooltip({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="text_tooltip"
      components={{
        b: <b />,
        ul: <ul style={UL_STYLE} />,
        li: <li style={LI_STYLE} />,
      }}
    />
  );
}

export function TransNewsFramingTooltip({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="news_framing_tooltip"
      components={{
        ul: <ul style={UL_STYLE} />,
        li: <li style={LI_STYLE} />,
      }}
    />
  );
}

export function TransNewsGenreTooltip({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="news_genre_tooltip"
      components={{
        ul: <ul style={UL_STYLE} />,
        li: <li style={LI_STYLE} />,
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
        ul: <ul style={UL_STYLE} />,
        li: <li style={LI_STYLE} />,
      }}
    />
  );
}

export function TransMultilingualStanceTooltip({ keyword }) {
  return (
    <>
      <Trans t={keyword} i18nKey="multilingual_stance_tooltip" />
      <ul style={UL_STYLE}>
        {STANCE_CATEGORIES.map((key) => (
          <li key={key} style={LI_STYLE}>
            <TransTooltipChip keyword={keyword} i18nKey={key} />
          </li>
        ))}
      </ul>
    </>
  );
}

// Whitespace

export function TransHtmlDoubleLineBreak({ keyword }) {
  return <Trans t={keyword} i18nKey="html_double_line_break" />;
}

export function TransHtmlSingleLineBreak({ keyword }) {
  return <Trans t={keyword} i18nKey="html_single_line_break" />;
}
