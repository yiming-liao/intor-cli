import type { InferNode } from "../../../../../src/core";
import type { ValidationResult } from "../../../../../src/features/validate/validate-locale-messages";
import { describe, it, expect } from "vitest";
import { validateRichSchema } from "../../../../../src/features/validate/rich";

function createResult(): ValidationResult {
  return {
    missingKeys: [],
    missingReplacements: [],
    missingRichTags: [],
  };
}

describe("validateRichSchema", () => {
  it("does nothing when schema is not an object", () => {
    const result = createResult();
    validateRichSchema(
      { kind: "none" } as InferNode,
      { title: "<a>hello</a>" },
      "",
      result,
    );
    expect(result.missingRichTags).toEqual([]);
  });

  it("reports missing rich tag for a string message", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        title: {
          kind: "object",
          properties: {
            a: { kind: "none" },
          },
        },
      },
    };
    const messages = {
      title: "plain text",
    };
    const result = createResult();
    validateRichSchema(schema, messages, "", result);
    expect(result.missingRichTags).toEqual([{ key: "title", tag: "a" }]);
  });

  it("does not report when all rich tags are present", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        title: {
          kind: "object",
          properties: {
            a: { kind: "none" },
            b: { kind: "none" },
          },
        },
      },
    };
    const messages = {
      title: "<a>link</a><b>bold</b>",
    };
    const result = createResult();
    validateRichSchema(schema, messages, "", result);
    expect(result.missingRichTags).toEqual([]);
  });

  it("reports missing rich tags with correct nested path", () => {
    const schema: InferNode = {
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
    };
    const messages = {
      section: {
        title: "plain text",
      },
    };
    const result = createResult();
    validateRichSchema(schema, messages, "", result);
    expect(result.missingRichTags).toEqual([
      { key: "section.title", tag: "strong" },
    ]);
  });

  it("ignores non-string message values", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        title: {
          kind: "object",
          properties: {
            a: { kind: "none" },
          },
        },
      },
    };
    const messages = {
      title: { text: "<a>hello</a>" },
    };
    const result = createResult();
    validateRichSchema(schema, messages, "", result);
    expect(result.missingRichTags).toEqual([]);
  });

  it("ignores schema keys that do not define rich tags", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        title: { kind: "primitive", type: "string" },
      },
    };
    const messages = {
      title: "<a>hello</a>",
    };
    const result = createResult();
    validateRichSchema(schema, messages, "", result);
    expect(result.missingRichTags).toEqual([]);
  });
});
