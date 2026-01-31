/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/consistent-function-scoping */
import type { SourceFile } from "ts-morph";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  extractUsages,
  type ExtractedUsages,
} from "../../../../src/core/extract-usages";
import { extractUsagesFromSourceFile } from "../../../../src/core/extract-usages/extract-usages-from-source-file";
import { loadSourceFilesFromTsconfig } from "../../../../src/core/extract-usages/load-source-files-from-tscofnig";

vi.mock(
  "../../../../src/core/extract-usages/load-source-files-from-tscofnig",
  () => ({
    loadSourceFilesFromTsconfig: vi.fn(),
  }),
);

vi.mock(
  "../../../../src/core/extract-usages/extract-usages-from-source-file",
  () => ({
    extractUsagesFromSourceFile: vi.fn(),
  }),
);

vi.mock("../../../../src/core/scan-logger", () => ({
  createLogger: () => () => {},
}));

const mockSourceFile = (path: string) =>
  ({ getFilePath: () => path }) as SourceFile;

const empty: ExtractedUsages = {
  preKey: [],
  key: [],
  replacement: [],
  rich: [],
  trans: [],
};

describe("extractUsages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty result when no source files are found", () => {
    vi.mocked(loadSourceFilesFromTsconfig).mockReturnValue([]);
    const result = extractUsages();
    expect(result).toEqual(empty);
    expect(loadSourceFilesFromTsconfig).toHaveBeenCalledWith(
      "tsconfig.json",
      false,
    );
  });

  it("skips files whose file-level extraction is fully empty", () => {
    const files = [mockSourceFile("a.ts"), mockSourceFile("b.ts")];
    vi.mocked(loadSourceFilesFromTsconfig).mockReturnValue(files);
    vi.mocked(extractUsagesFromSourceFile).mockReturnValue(empty);
    const result = extractUsages();
    expect(result).toEqual(empty);
    expect(extractUsagesFromSourceFile).toHaveBeenCalledTimes(2);
  });

  it("merges usages from multiple source files including trans usages", () => {
    const files = [mockSourceFile("a.ts"), mockSourceFile("b.ts")];
    vi.mocked(loadSourceFilesFromTsconfig).mockReturnValue(files);
    vi.mocked(extractUsagesFromSourceFile)
      .mockReturnValueOnce({
        preKey: [{ preKey: "home" } as any],
        key: [{ key: "title" } as any],
        replacement: [],
        rich: [],
        trans: [{ key: "home.title" } as any],
      })
      .mockReturnValueOnce({
        preKey: [],
        key: [],
        replacement: [{ key: "count" } as any],
        rich: [{ key: "content" } as any],
        trans: [{ key: "profile.name" } as any],
      });
    const result = extractUsages();
    expect(result.preKey).toHaveLength(1);
    expect(result.key).toHaveLength(1);
    expect(result.replacement).toHaveLength(1);
    expect(result.rich).toHaveLength(1);
    expect(result.trans).toHaveLength(2);
  });

  it("passes custom tsconfigPath and debug flag", () => {
    vi.mocked(loadSourceFilesFromTsconfig).mockReturnValue([]);
    extractUsages({ tsconfigPath: "custom.json", debug: true });
    expect(loadSourceFilesFromTsconfig).toHaveBeenCalledWith(
      "custom.json",
      true,
    );
  });
});
