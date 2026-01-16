import { describe, it, expect } from "vitest";
import { inferRichSchema } from "../../../../../src/core/infer-schema/rich";

describe("inferRichSchema", () => {
  it("returns none for empty message object", () => {
    const result = inferRichSchema({});
    expect(result).toEqual({ kind: "none" });
  });

  it("returns none when no rich tags are found", () => {
    const result = inferRichSchema({
      greeting: "hello world",
    });
    expect(result).toEqual({ kind: "none" });
  });

  it("infers a single rich tag from string", () => {
    const result = inferRichSchema({
      greeting: "<a>hello</a>",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            a: { kind: "none" },
          },
        },
      },
    });
  });

  it("infers multiple different rich tags from a string", () => {
    const result = inferRichSchema({
      content: "<a>link</a><b>bold</b>",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        content: {
          kind: "object",
          properties: {
            a: { kind: "none" },
            b: { kind: "none" },
          },
        },
      },
    });
  });

  it("deduplicates the same rich tag used multiple times", () => {
    const result = inferRichSchema({
      content: "<a>one</a><a>two</a>",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        content: {
          kind: "object",
          properties: {
            a: { kind: "none" },
          },
        },
      },
    });
  });

  it("infers rich tags recursively in nested objects", () => {
    const result = inferRichSchema({
      section: {
        title: "<strong>Title</strong>",
      },
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        section: {
          kind: "object",
          properties: {
            title: {
              kind: "object",
              properties: {
                strong: { kind: "none" },
              },
            },
          },
        },
      },
    });
  });

  it("ignores array values completely", () => {
    const result = inferRichSchema({
      list: ["<a>hello</a>"],
    });
    expect(result).toEqual({ kind: "none" });
  });

  it("prunes branches without rich tags", () => {
    const result = inferRichSchema({
      valid: "<a>link</a>",
      invalid: "plain text",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        valid: {
          kind: "object",
          properties: {
            a: { kind: "none" },
          },
        },
      },
    });
  });

  it("returns none when all branches are pruned", () => {
    const result = inferRichSchema({
      a: "text only",
      b: "still text",
    });
    expect(result).toEqual({ kind: "none" });
  });

  it("returns none for unsupported value type", () => {
    inferRichSchema({ a: Symbol("x") as unknown as string });
  });
});
