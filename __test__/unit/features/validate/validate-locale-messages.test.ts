import type { InferredSchemas } from "../../../../src/core";
import { describe, it, expect } from "vitest";
import { validateLocaleMessages } from "../../../../src/features/validate/validate-locale-messages";

describe("validateLocaleMessages", () => {
  it("returns empty result when schemas define no constraints", () => {
    const schemas: InferredSchemas = {
      messagesSchema: { kind: "none" },
      replacementsSchema: { kind: "none" },
      richSchema: { kind: "none" },
    };
    const messages = {};
    const result = validateLocaleMessages(schemas, messages);
    expect(result).toEqual({
      missingKeys: [],
      missingReplacements: [],
      missingRichTags: [],
    });
  });

  it("aggregates missing keys, replacements, and rich tags", () => {
    const schemas: InferredSchemas = {
      messagesSchema: {
        kind: "object",
        properties: {
          greeting: { kind: "primitive", type: "string" },
        },
      },
      replacementsSchema: {
        kind: "object",
        properties: {
          greeting: {
            kind: "object",
            properties: {
              name: { kind: "none" },
            },
          },
        },
      },
      richSchema: {
        kind: "object",
        properties: {
          greeting: {
            kind: "object",
            properties: {
              a: { kind: "none" },
            },
          },
        },
      },
    };
    const messages = {
      greeting: "Hello",
    };
    const result = validateLocaleMessages(schemas, messages);
    expect(result).toEqual({
      missingKeys: [],
      missingReplacements: [{ key: "greeting", name: "name" }],
      missingRichTags: [{ key: "greeting", tag: "a" }],
    });
  });

  it("reports missing keys before other validations", () => {
    const schemas: InferredSchemas = {
      messagesSchema: {
        kind: "object",
        properties: {
          title: { kind: "primitive", type: "string" },
        },
      },
      replacementsSchema: { kind: "none" },
      richSchema: { kind: "none" },
    };
    const messages = {};
    const result = validateLocaleMessages(schemas, messages);
    expect(result.missingKeys).toEqual(["title"]);
    expect(result.missingReplacements).toEqual([]);
    expect(result.missingRichTags).toEqual([]);
  });
});
