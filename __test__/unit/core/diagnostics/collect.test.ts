/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Diagnostic } from "../../../../src/core/diagnostics/types";
import type { ExtractedUsages } from "../../../../src/core/extract-usages";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { collectDiagnostics } from "../../../../src/core";
import { enforceMissingReplacements } from "../../../../src/core/diagnostics/rules/enforce-missing-replacements";
import { enforceMissingRich } from "../../../../src/core/diagnostics/rules/enforce-missing-rich";
import {
  keyNotFound,
  keyEmpty,
} from "../../../../src/core/diagnostics/rules/key";
import { preKeyNotFound } from "../../../../src/core/diagnostics/rules/pre-key";
import {
  replacementsNotAllowed,
  replacementsMissing,
  replacementsUnused,
} from "../../../../src/core/diagnostics/rules/replacement";
import {
  richNotAllowed,
  richMissing,
  richUnused,
} from "../../../../src/core/diagnostics/rules/rich";

vi.mock("../../../../src/core/diagnostics/rules/pre-key", () => ({
  preKeyNotFound: vi.fn(),
}));

vi.mock("../../../../src/core/diagnostics/rules/key", () => ({
  keyNotFound: vi.fn(),
  keyEmpty: vi.fn(),
}));

vi.mock("../../../../src/core/diagnostics/rules/replacement", () => ({
  replacementsNotAllowed: vi.fn(),
  replacementsMissing: vi.fn(),
  replacementsUnused: vi.fn(),
}));

vi.mock("../../../../src/core/diagnostics/rules/rich", () => ({
  richNotAllowed: vi.fn(),
  richMissing: vi.fn(),
  richUnused: vi.fn(),
}));

vi.mock(
  "../../../../src/core/diagnostics/rules/enforce-missing-replacements",
  () => ({
    enforceMissingReplacements: vi.fn(),
  }),
);

vi.mock("../../../../src/core/diagnostics/rules/enforce-missing-rich", () => ({
  enforceMissingRich: vi.fn(),
}));

vi.mock("../../../../src/core/diagnostics/utils/index-usages-by-key", () => ({
  indexUsagesByKey: vi.fn(() => new Map()),
}));

describe("collectDiagnostics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("collects diagnostics from all rule groups", () => {
    const d = (id: string): Diagnostic => ({ id }) as any;
    vi.mocked(preKeyNotFound).mockReturnValue([d("preKey")]);
    vi.mocked(keyNotFound).mockReturnValue([d("keyNotFound")]);
    vi.mocked(keyEmpty).mockReturnValue([d("keyEmpty")]);
    vi.mocked(replacementsNotAllowed).mockReturnValue([d("repNotAllowed")]);
    vi.mocked(replacementsMissing).mockReturnValue([d("repMissing")]);
    vi.mocked(replacementsUnused).mockReturnValue([d("repUnused")]);
    vi.mocked(richNotAllowed).mockReturnValue([d("richNotAllowed")]);
    vi.mocked(richMissing).mockReturnValue([d("richMissing")]);
    vi.mocked(richUnused).mockReturnValue([d("richUnused")]);
    vi.mocked(enforceMissingReplacements).mockReturnValue([d("enforceRep")]);
    vi.mocked(enforceMissingRich).mockReturnValue([d("enforceRich")]);
    const usages: ExtractedUsages = {
      preKey: [{} as any],
      key: [{} as any],
      replacement: [{} as any],
      rich: [{} as any],
    };
    const result = collectDiagnostics(
      {
        messagesSchema: {} as any,
        replacementsSchema: {} as any,
        richSchema: {} as any,
      },
      usages,
    );
    expect(result.map((d) => (d as any).id)).toEqual([
      "preKey",
      "keyNotFound",
      "keyEmpty",
      "repNotAllowed",
      "repMissing",
      "repUnused",
      "richNotAllowed",
      "richMissing",
      "richUnused",
      "enforceRep",
      "enforceRich",
    ]);
  });

  it("does not call enforce rules when there are no key usages", () => {
    const usages: ExtractedUsages = {
      preKey: [],
      key: [],
      replacement: [],
      rich: [],
    };
    collectDiagnostics(
      {
        messagesSchema: {} as any,
        replacementsSchema: {} as any,
        richSchema: {} as any,
      },
      usages,
    );
    expect(enforceMissingReplacements).not.toHaveBeenCalled();
    expect(enforceMissingRich).not.toHaveBeenCalled();
  });
});
