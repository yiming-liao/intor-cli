import type { KeyUsage } from "../../../../../../src/core/extract-usages";
import type { InferNode } from "../../../../../../src/core/infer-schema";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../src/core/diagnostics/messages";
import { keyNotFound } from "../../../../../../src/core/diagnostics/rules/key";

function createUsage(partial: Partial<KeyUsage>): KeyUsage {
  return {
    factory: "useTranslator",
    method: "t",
    localName: "t",
    key: "",
    file: "/test.ts",
    line: 1,
    column: 1,
    ...partial,
  };
}

describe("keyNotFound", () => {
  it("reports warn when message key does not exist in schema", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        hello: { kind: "primitive", type: "string" },
      },
    };
    const diagnostics = keyNotFound(createUsage({ key: "missing" }), schema);
    expect(diagnostics).toEqual([
      {
        severity: "warn",
        method: "t",
        messageKey: "missing",
        code: DIAGNOSTIC_MESSAGES.KEY_NOT_FOUND.code,
        message: DIAGNOSTIC_MESSAGES.KEY_NOT_FOUND.message(),
        file: "/test.ts",
        line: 1,
        column: 1,
      },
    ]);
  });

  it("returns no diagnostics when no message key", () => {
    const diagnostics = keyNotFound(createUsage({}), {} as InferNode);
    expect(diagnostics).toEqual([]);
  });

  it("resolves key with preKey correctly", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        home: {
          kind: "object",
          properties: {
            title: { kind: "primitive", type: "string" },
          },
        },
      },
    };
    const diagnostics = keyNotFound(
      createUsage({ key: "title", preKey: "home" }),
      schema,
    );
    expect(diagnostics).toEqual([]);
  });
});
