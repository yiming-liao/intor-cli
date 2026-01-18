import type { InferNode } from "../../../../../src/core";
import type { ValidationResult } from "../../../../../src/features/validate/validate-locale-messages";
import { describe, it, expect } from "vitest";
import { validateMessagesSchema } from "../../../../../src/features/validate/messages/validate-messages-schema";

function createResult(): ValidationResult {
  return {
    missingKeys: [],
    missingReplacements: [],
    missingRichTags: [],
  };
}

describe("validateMessagesSchema", () => {
  it("does nothing when schema is not an object", () => {
    const schema: InferNode = { kind: "none" };
    const messages = { a: "hello" };
    const result = createResult();
    validateMessagesSchema(schema, messages, "", result);
    expect(result.missingKeys).toEqual([]);
  });

  it("reports missing top-level keys", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: { kind: "none" },
        title: { kind: "none" },
      },
    };
    const messages = {
      greeting: "hello",
    };
    const result = createResult();
    validateMessagesSchema(schema, messages, "", result);
    expect(result.missingKeys).toEqual(["title"]);
  });

  it("reports missing nested keys with correct dotted path", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        home: {
          kind: "object",
          properties: {
            title: { kind: "none" },
            subtitle: { kind: "none" },
          },
        },
      },
    };
    const messages = {
      home: {
        title: "Hello",
      },
    };
    const result = createResult();
    validateMessagesSchema(schema, messages, "", result);
    expect(result.missingKeys).toEqual(["home.subtitle"]);
  });

  it("produces no errors when messages fully satisfy schema", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        home: {
          kind: "object",
          properties: {
            title: { kind: "none" },
          },
        },
      },
    };
    const messages = {
      home: {
        title: "Hello",
      },
    };
    const result = createResult();
    validateMessagesSchema(schema, messages, "", result);
    expect(result.missingKeys).toEqual([]);
  });

  it("ignores extra keys in messages that are not defined in schema", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: { kind: "none" },
      },
    };
    const messages = {
      greeting: "hello",
      extra: "should be ignored",
    };
    const result = createResult();
    validateMessagesSchema(schema, messages, "", result);
    expect(result.missingKeys).toEqual([]);
  });

  it("does not recurse into message branches not defined in schema", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        a: { kind: "none" },
      },
    };
    const messages = {
      a: "ok",
      nested: {
        missing: "value",
      },
    };
    const result = createResult();
    validateMessagesSchema(schema, messages, "", result);
    expect(result.missingKeys).toEqual([]);
  });
});
