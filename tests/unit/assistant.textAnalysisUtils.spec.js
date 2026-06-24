import { expect, test } from "vitest";
import {
  getPersuasionCategoryTechnique,
  mergeSpanIndices,
  treeMapToElements,
  wrapPlainTextSpan,
} from "../../src/components/NavItems/Assistant/utils/textAnalysisUtils";

// --- getPersuasionCategoryTechnique ---

test("getPersuasionCategoryTechnique: splits on double underscore", () => {
  expect(getPersuasionCategoryTechnique("category__technique")).toEqual([
    "category",
    "technique",
  ]);
});

test("getPersuasionCategoryTechnique: handles multiple separators", () => {
  expect(getPersuasionCategoryTechnique("a__b__c")).toEqual(["a", "b", "c"]);
});

test("getPersuasionCategoryTechnique: no separator returns single-element array", () => {
  expect(getPersuasionCategoryTechnique("noseparator")).toEqual(["noseparator"]);
});

// --- mergeSpanIndices ---

test("mergeSpanIndices: empty input returns empty array", () => {
  expect(mergeSpanIndices({})).toEqual([]);
});

test("mergeSpanIndices: single label single span", () => {
  const result = mergeSpanIndices({
    label1: [{ indices: [0, 5], score: 0.8 }],
  });
  expect(result).toEqual([{ indices: [0, 5], techniques: { label1: 0.8 } }]);
});

test("mergeSpanIndices: multiple labels with same indices are merged into one entry", () => {
  const result = mergeSpanIndices({
    label1: [{ indices: [0, 5], score: 0.8 }],
    label2: [{ indices: [0, 5], score: 0.9 }],
  });
  expect(result).toEqual([
    { indices: [0, 5], techniques: { label1: 0.8, label2: 0.9 } },
  ]);
});

test("mergeSpanIndices: multiple labels with different indices produce separate entries", () => {
  const result = mergeSpanIndices({
    label1: [{ indices: [0, 5], score: 0.8 }],
    label2: [{ indices: [10, 15], score: 0.6 }],
  });
  expect(result).toEqual([
    { indices: [0, 5], techniques: { label1: 0.8 } },
    { indices: [10, 15], techniques: { label2: 0.6 } },
  ]);
});

test("mergeSpanIndices: results are sorted ascending by start index", () => {
  const result = mergeSpanIndices({
    label1: [
      { indices: [20, 25], score: 0.5 },
      { indices: [0, 5], score: 0.8 },
    ],
  });
  expect(result[0].indices[0]).toEqual(0);
  expect(result[1].indices[0]).toEqual(20);
});

// --- wrapPlainTextSpan ---

test("wrapPlainTextSpan: no spans returns full text as single string", () => {
  expect(wrapPlainTextSpan("hello world", [], null)).toEqual(["hello world"]);
});

test("wrapPlainTextSpan: span in middle produces prefix, span text, and suffix", () => {
  expect(
    wrapPlainTextSpan("hello world test", [{ indices: [6, 11] }], null),
  ).toEqual(["hello ", "world", " test"]);
});

test("wrapPlainTextSpan: span at start produces no prefix", () => {
  expect(
    wrapPlainTextSpan("hello world", [{ indices: [0, 5] }], null),
  ).toEqual(["hello", " world"]);
});

test("wrapPlainTextSpan: span at end produces no suffix", () => {
  expect(
    wrapPlainTextSpan("hello world", [{ indices: [6, 11] }], null),
  ).toEqual(["hello ", "world"]);
});

test("wrapPlainTextSpan: multiple non-overlapping spans are each extracted", () => {
  expect(
    wrapPlainTextSpan(
      "one two three",
      [{ indices: [0, 3] }, { indices: [4, 7] }],
      null,
    ),
  ).toEqual(["one", " ", "two", " three"]);
});

test("wrapPlainTextSpan: negative end index uses full text length as end", () => {
  expect(
    wrapPlainTextSpan("hello world", [{ indices: [6, -1] }], null),
  ).toEqual(["hello ", "world"]);
});

// --- treeMapToElements ---

test("treeMapToElements: null mapping returns text unchanged", () => {
  expect(treeMapToElements("hello", null)).toEqual("hello");
});

test("treeMapToElements: single-node mapping sets correct tag and extracts span text", () => {
  const mapping = { tag: "p", span: { start: 0, end: 5 }, children: [] };
  const result = treeMapToElements("hello world", mapping);
  expect(result.type).toBe("p");
  expect(result.props.children).toContain("hello");
});

test("treeMapToElements: nested child element is rendered with correct tag", () => {
  const mapping = {
    tag: "div",
    children: [
      { tag: "span", span: { start: 0, end: 5 }, children: [] },
    ],
  };
  const result = treeMapToElements("hello world", mapping);
  expect(result.type).toBe("div");
  expect(result.props.children[0].type).toBe("span");
  expect(result.props.children[0].props.children).toContain("hello");
});

test("treeMapToElements: spanHighlightIndices splits text into unhighlighted and highlighted parts", () => {
  const mapping = { tag: "p", span: { start: 0, end: 11 }, children: [] };
  const result = treeMapToElements(
    "hello world",
    mapping,
    [{ indices: [6, 11] }],
    null,
  );
  const children = result.props.children;
  expect(children).toContain("hello ");
  expect(children).toContain("world");
});

test("treeMapToElements: trailing text after highlight span is appended", () => {
  const mapping = { tag: "p", span: { start: 0, end: 11 }, children: [] };
  const result = treeMapToElements(
    "hello world",
    mapping,
    [{ indices: [0, 5] }],
    null,
  );
  const children = result.props.children;
  expect(children).toContain("hello");
  expect(children).toContain(" world");
});

test("treeMapToElements: attributes are passed through and key is set", () => {
  const mapping = {
    tag: "p",
    span: { start: 0, end: 5 },
    children: [],
    attributes: { className: "highlight" },
  };
  const result = treeMapToElements("hello", mapping);
  expect(result.props.className).toBe("highlight");
  expect(result.key).toBeDefined();
});
