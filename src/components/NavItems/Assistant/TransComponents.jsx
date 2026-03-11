import React from "react";
import { Trans } from "react-i18next";

import Chip from "@mui/material/Chip";

// CSS STYLES

const UL_STYLE = { paddingLeft: "20px", margin: "8px 0" };
const LI_STYLE = { display: "list-item", listStyleType: "disc" };
export const A_STYLE = { color: "blue", textDecoration: "underline" };

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
  const colorMap = {
    // url domain analysis
    warning: "error",
    mentions: "warning",
    fact_checker: "success",
    unlabelled: "default",
    // fact-checks
    dbkf_acronym: "warning",
    fcss_acronym: "warning",
    // machine generated text (colours match getMgtColours lightGreenRgb/greenRgb defaults)
    highly_likely_human: "success",
    likely_human: "#aaff00",
    likely_machine: "warning",
    highly_likely_machine: "error",
    // stance classifier
    deny: "error",
    query: "warning",
    support: "success",
    comment: "default",
  };

  const mapped = color || colorMap[i18nKey] || "default";
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
            href="https://gatenlp.github.io/we-verify-app-assistant/supported-tools"
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
            href="https://gatenlp.github.io/we-verify-app-assistant/supported-urls"
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
            href="https://gatenlp.github.io/domain-analysis-lists/"
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
            href="https://gatenlp.github.io/we-verify-app-assistant/supported-tools#named-entity-recogniser"
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
            href="https://gatenlp.github.io/we-verify-app-assistant/supported-tools#credibility-signals"
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
            href="https://gatenlp.github.io/we-verify-app-assistant/supported-tools#previous-fact-checks"
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
            href="https://gatenlp.github.io/we-verify-app-assistant/supported-tools#database-of-known-fakes"
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
            href="https://gatenlp.github.io/we-verify-app-assistant/supported-tools#stance-classifier"
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
            href="https://cloud.gate.ac.uk/shopfront"
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
            href="https://www.dw.com/"
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
            href="https://kinit.sk/"
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
            href="https://www.ontotext.com/"
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
            href="https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types"
            target="_blank"
            rel="noopener noreferrer"
            style={A_STYLE}
          />
        ),
        videoFileTypeSupportLink: (
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs"
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
        {["support", "query", "deny", "comment"].map((key) => (
          <li key={key} style={LI_STYLE}>
            <TransTooltipChip keyword={keyword} i18nKey={key} />
          </li>
        ))}
      </ul>
    </>
  );
}

// Summary tooltips

export function TransSummaryDomainTooltip({
  keyword,
  cautionCount,
  mixedCount,
  positiveCount,
  loaded,
}) {
  return (
    <>
      <Trans t={keyword} i18nKey="summary_url_domain_analysis_tooltip" />
      {loaded && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {cautionCount}{" "}
            <TransTooltipChip keyword={keyword} i18nKey="warning" />
          </li>
          <li style={LI_STYLE}>
            {mixedCount}{" "}
            <TransTooltipChip keyword={keyword} i18nKey="mentions" />
          </li>
          <li style={LI_STYLE}>
            {positiveCount}{" "}
            <TransTooltipChip keyword={keyword} i18nKey="fact_checker" />
          </li>
        </ul>
      )}
    </>
  );
}

export function TransSummaryFactChecksTooltip({
  keyword,
  dbkfCount,
  fcssCount,
  isBetaTester,
  loaded,
}) {
  return (
    <>
      {isBetaTester ? (
        <Trans t={keyword} i18nKey="summary_dbkf_fcss_tooltip" />
      ) : (
        <Trans t={keyword} i18nKey="summary_dbkf_tooltip" />
      )}
      {loaded && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {dbkfCount}{" "}
            <TransTooltipChip keyword={keyword} i18nKey="dbkf_acronym" />
          </li>
          {isBetaTester && (
            <li style={LI_STYLE}>
              {fcssCount}{" "}
              <TransTooltipChip keyword={keyword} i18nKey="fcss_acronym" />
            </li>
          )}
        </ul>
      )}
    </>
  );
}

export function TransSummaryImagesTooltip({ keyword, imageCount, loaded }) {
  return (
    <>
      <Trans t={keyword} i18nKey="summary_images_tooltip" />
      {loaded && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {imageCount} {keyword("images_label")}
          </li>
        </ul>
      )}
    </>
  );
}

export function TransSummaryVideosTooltip({ keyword, videoCount, loaded }) {
  return (
    <>
      <Trans t={keyword} i18nKey="summary_videos_tooltip" />
      {loaded && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {videoCount} {keyword("videos_label")}
          </li>
        </ul>
      )}
    </>
  );
}

export function TransSummaryPersuasionTooltip({
  keyword,
  categoryCounts,
  otherCount,
  loaded,
}) {
  return (
    <>
      <Trans t={keyword} i18nKey="summary_persuasion_techniques_tooltip" />
      {loaded && categoryCounts?.length > 0 && (
        <ul style={UL_STYLE}>
          {categoryCounts.map(({ name, count }) => (
            <li key={name} style={LI_STYLE}>
              {count}{" "}
              <TransTooltipChip
                keyword={keyword}
                i18nKey={name}
                color={"warning"}
              />
            </li>
          ))}
          <li style={LI_STYLE}>
            {otherCount} {keyword("summary_persuasion_tooltip_other")}
          </li>
        </ul>
      )}
    </>
  );
}

export function TransSummaryMgtTooltip({
  keyword,
  mgtScoreValue,
  mgtCategory,
  loaded,
}) {
  return (
    <>
      <Trans t={keyword} i18nKey="summary_machine_generated_text_tooltip" />
      {loaded && mgtScoreValue && mgtCategory && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {mgtScoreValue}{" "}
            <TransTooltipChip keyword={keyword} i18nKey={mgtCategory} />
          </li>
        </ul>
      )}
    </>
  );
}

export function TransSummaryNamedEntitiesTooltip({
  keyword,
  namedEntityCount,
  loaded,
}) {
  return (
    <>
      <Trans t={keyword} i18nKey="summary_named_entities_tooltip" />
      {loaded && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {namedEntityCount} {keyword("named_entities_label")}
          </li>
        </ul>
      )}
    </>
  );
}

export function TransSummaryLinksTooltip({
  keyword,
  warningLinksCount,
  mentionsLinksCount,
  factCheckerLinksCount,
  unlabelledLinksCount,
  linksCount,
  loaded,
}) {
  const items = [
    { count: warningLinksCount, key: "warning", color: "error" },
    { count: mentionsLinksCount, key: "mentions", color: "warning" },
    { count: factCheckerLinksCount, key: "fact_checker", color: "success" },
    { count: unlabelledLinksCount, key: "unlabelled", color: "default" },
  ];
  return (
    <>
      <Trans t={keyword} i18nKey="summary_links_tooltip" />
      {loaded && (
        <ul style={UL_STYLE}>
          {items.map(({ count, key, color }) => (
            <li key={key} style={LI_STYLE}>
              {count}{" "}
              <TransTooltipChip keyword={keyword} i18nKey={key} color={color} />
            </li>
          ))}
          <li style={LI_STYLE}>
            {linksCount} {keyword("summary_links_tooltip_total")}
          </li>
        </ul>
      )}
    </>
  );
}

export function TransSummaryCommentsTooltip({
  keyword,
  denyCount,
  queryCount,
  supportCount,
  commentCount,
  loaded,
}) {
  return (
    <>
      <Trans t={keyword} i18nKey="summary_comments_tooltip" />
      {loaded && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {denyCount} <TransTooltipChip keyword={keyword} i18nKey="deny" />
          </li>
          <li style={LI_STYLE}>
            {queryCount} <TransTooltipChip keyword={keyword} i18nKey="query" />
          </li>
          <li style={LI_STYLE}>
            {supportCount}{" "}
            <TransTooltipChip keyword={keyword} i18nKey="support" />
          </li>
          <li style={LI_STYLE}>
            {commentCount}{" "}
            <TransTooltipChip keyword={keyword} i18nKey="comment" />
          </li>
        </ul>
      )}
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
