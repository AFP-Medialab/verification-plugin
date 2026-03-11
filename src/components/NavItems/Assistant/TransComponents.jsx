import React from "react";
import { Trans } from "react-i18next";

// CSS STYLES

const UL_STYLE = { paddingLeft: "20px", margin: "8px 0" };
const LI_STYLE = { display: "list-item", listStyleType: "disc" };
export const A_STYLE = { color: "blue", textDecoration: "underline" };

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

export function TransMachineGeneratedTextTooltip({ keyword }) {
  return (
    <Trans
      t={keyword}
      i18nKey="machine_generated_text_tooltip"
      components={{
        ul: <ul style={UL_STYLE} />,
        li: <li style={LI_STYLE} />,
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
        ul: <ul style={UL_STYLE} />,
        li: <li style={LI_STYLE} />,
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
      <Trans
        t={keyword}
        i18nKey="summary_domain_tooltip"
        components={{
          b: <b />,
          ul: <ul style={UL_STYLE} />,
          li: <li style={LI_STYLE} />,
        }}
      />
      {loaded && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {cautionCount} {keyword("summary_domain_tooltip_warning")}
          </li>
          <li style={LI_STYLE}>
            {mixedCount} {keyword("summary_domain_tooltip_mentions")}
          </li>
          <li style={LI_STYLE}>
            {positiveCount} {keyword("summary_domain_tooltip_fact_checker")}
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
      <Trans
        t={keyword}
        i18nKey="summary_factchecks_tooltip"
        components={{
          b: <b />,
          ul: <ul style={UL_STYLE} />,
          li: <li style={LI_STYLE} />,
        }}
      />
      {loaded && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {dbkfCount} {keyword("summary_factchecks_tooltip_dbkf")}
          </li>
          {isBetaTester && (
            <li style={LI_STYLE}>
              {fcssCount} {keyword("summary_factchecks_tooltip_fcss")}
            </li>
          )}
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
      <Trans
        t={keyword}
        i18nKey="summary_persuasion_tooltip"
        components={{
          b: <b />,
          ul: <ul style={UL_STYLE} />,
          li: <li style={LI_STYLE} />,
        }}
      />
      {loaded && categoryCounts?.length > 0 && (
        <ul style={UL_STYLE}>
          {categoryCounts.map(({ name, count }) => (
            <li key={name} style={LI_STYLE}>
              {count} {keyword(name)}
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

export function TransSummaryLinksTooltip({
  keyword,
  warningLinksCount,
  mentionsLinksCount,
  factCheckerLinksCount,
  unlabelledLinksCount,
  linksCount,
  loaded,
}) {
  return (
    <>
      <Trans
        t={keyword}
        i18nKey="summary_links_tooltip"
        components={{
          b: <b />,
          ul: <ul style={UL_STYLE} />,
          li: <li style={LI_STYLE} />,
        }}
      />
      {loaded && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {warningLinksCount} {keyword("summary_links_tooltip_warning")}
          </li>
          <li style={LI_STYLE}>
            {mentionsLinksCount} {keyword("summary_links_tooltip_mentions")}
          </li>
          <li style={LI_STYLE}>
            {factCheckerLinksCount}{" "}
            {keyword("summary_links_tooltip_fact_checker")}
          </li>
          <li style={LI_STYLE}>
            {unlabelledLinksCount} {keyword("summary_links_tooltip_unlabelled")}
          </li>
          <li style={LI_STYLE}>
            {linksCount} {keyword("summary_links_tooltip_total")}
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
      <Trans
        t={keyword}
        i18nKey="summary_mgt_tooltip"
        components={{
          b: <b />,
          ul: <ul style={UL_STYLE} />,
          li: <li style={LI_STYLE} />,
        }}
      />
      {loaded && mgtScoreValue && mgtCategory && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {mgtScoreValue} {keyword(mgtCategory)}
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
      <Trans
        t={keyword}
        i18nKey="summary_comments_tooltip"
        components={{
          b: <b />,
          ul: <ul style={UL_STYLE} />,
          li: <li style={LI_STYLE} />,
        }}
      />
      {loaded && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {denyCount} {keyword("summary_comments_tooltip_deny")}
          </li>
          <li style={LI_STYLE}>
            {queryCount} {keyword("summary_comments_tooltip_query")}
          </li>
          <li style={LI_STYLE}>
            {supportCount} {keyword("summary_comments_tooltip_support")}
          </li>
          <li style={LI_STYLE}>
            {commentCount} {keyword("summary_comments_tooltip_comment")}
          </li>
        </ul>
      )}
    </>
  );
}

export function TransSummaryVideosTooltip({ keyword, videoCount, loaded }) {
  return (
    <>
      <Trans
        t={keyword}
        i18nKey="summary_videos_tooltip"
        components={{
          b: <b />,
          ul: <ul style={UL_STYLE} />,
          li: <li style={LI_STYLE} />,
        }}
      />
      {loaded && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {videoCount} {keyword("summary_videos_tooltip_count")}
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
      <Trans
        t={keyword}
        i18nKey="summary_named_entities_tooltip"
        components={{
          b: <b />,
          ul: <ul style={UL_STYLE} />,
          li: <li style={LI_STYLE} />,
        }}
      />
      {loaded && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {namedEntityCount} {keyword("summary_named_entities_tooltip_count")}
          </li>
        </ul>
      )}
    </>
  );
}

export function TransSummaryImagesTooltip({ keyword, imageCount, loaded }) {
  return (
    <>
      <Trans
        t={keyword}
        i18nKey="summary_images_tooltip"
        components={{
          b: <b />,
          ul: <ul style={UL_STYLE} />,
          li: <li style={LI_STYLE} />,
        }}
      />
      {loaded && (
        <ul style={UL_STYLE}>
          <li style={LI_STYLE}>
            {imageCount} {keyword("summary_images_tooltip_count")}
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
