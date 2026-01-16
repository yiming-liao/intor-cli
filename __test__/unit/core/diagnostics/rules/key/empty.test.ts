import type { KeyUsage } from "../../../../../../src/core/extract-usages";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../src/core/diagnostics/messages";
import { keyEmpty } from "../../../../../../src/core/diagnostics/rules/key";

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

describe("keyEmpty", () => {
  it("reports warn for empty message key", () => {
    const diagnostics = keyEmpty(createUsage({ key: "" }));
    expect(diagnostics).toEqual([
      {
        severity: "warn",
        method: "t",
        messageKey: "",
        code: DIAGNOSTIC_MESSAGES.KEY_EMPTY.code,
        message: DIAGNOSTIC_MESSAGES.KEY_EMPTY.message(),
        file: "/test.ts",
        line: 1,
        column: 1,
      },
    ]);
  });

  it("returns no diagnostics for existing message key", () => {
    const diagnostics = keyEmpty(createUsage({ key: "hello" }));
    expect(diagnostics).toEqual([]);
  });
});
