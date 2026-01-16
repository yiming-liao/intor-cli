import { describe, it, expect } from "vitest";
import { inferMessagesSchema } from "../../../../../src/core/infer-schema/messages";

describe("inferMessagesSchema", () => {
  it("returns none for empty message object", () => {
    const result = inferMessagesSchema({});
    expect(result).toEqual({ kind: "none" });
  });

  it("infers primitive string values", () => {
    const result = inferMessagesSchema({
      greeting: "hello",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        greeting: { kind: "primitive", type: "string" },
      },
    });
  });

  it("infers primitive number, boolean and null values", () => {
    const result = inferMessagesSchema({
      count: 1,
      active: true,
      empty: null,
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        count: { kind: "primitive", type: "number" },
        active: { kind: "primitive", type: "boolean" },
        empty: { kind: "primitive", type: "null" },
      },
    });
  });

  it("infers array values using first-element policy", () => {
    const result = inferMessagesSchema({
      list: ["a", "b", "c"],
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        list: {
          kind: "array",
          element: { kind: "primitive", type: "string" },
        },
      },
    });
  });

  it("infers empty arrays as array of none", () => {
    const result = inferMessagesSchema({
      list: [],
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        list: {
          kind: "array",
          element: { kind: "none" },
        },
      },
    });
  });

  it("infers nested objects recursively", () => {
    const result = inferMessagesSchema({
      user: {
        name: "Alice",
        age: 18,
      },
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        user: {
          kind: "object",
          properties: {
            name: { kind: "primitive", type: "string" },
            age: { kind: "primitive", type: "number" },
          },
        },
      },
    });
  });

  it("prunes unsupported values inside objects", () => {
    const result = inferMessagesSchema({
      valid: "ok",
      invalid: undefined as unknown as string,
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        valid: { kind: "primitive", type: "string" },
      },
    });
  });

  it("falls back to record node for empty inferred object", () => {
    const result = inferMessagesSchema({
      nested: {},
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        nested: { kind: "record" },
      },
    });
  });

  it("falls back to record node when all object branches are pruned", () => {
    const result = inferMessagesSchema({
      a: undefined as unknown as string,
      b: undefined as unknown as string,
    });
    expect(result).toEqual({ kind: "record" });
  });
});
