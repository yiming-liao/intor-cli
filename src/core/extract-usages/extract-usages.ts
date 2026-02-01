import type { ExtractedUsages } from "./types";
import type { SourceFile } from "ts-morph";
import { yellow } from "../../features/shared/print";
import { createScanLogger } from "../scan";
import { extractUsagesFromSourceFile } from "./extract-usages-from-source-file";

/** Check whether a file-level extraction produced any meaningful usage */
const isEmpty = (u: ExtractedUsages) =>
  u.key.length === 0 &&
  u.replacement.length === 0 &&
  u.rich.length === 0 &&
  u.trans.length === 0;

export interface ExtractUsagesOptions {
  sourceFiles?: SourceFile[];
  debug?: boolean;
}

/**
 * Extract all static translator usages from a TypeScript project.
 */
export function extractUsages({
  sourceFiles = [],
  debug = false,
}: ExtractUsagesOptions = {}): ExtractedUsages {
  const logger = createScanLogger(debug, "Extract usages");
  logger.header(`processing ${yellow(sourceFiles.length)} source files`);

  const result: ExtractedUsages = {
    preKey: [],
    key: [],
    replacement: [],
    rich: [],
    trans: [],
  };

  // Debug counters
  let scannedFiles = 0;
  let matchedFiles = 0;

  // Process each source file independently
  for (const sourceFile of sourceFiles) {
    scannedFiles++;

    // ---------------------------------------------------------------------------
    // File-level extraction (pure analysis, no side effects)
    // ---------------------------------------------------------------------------
    const partialUsages = extractUsagesFromSourceFile(sourceFile);

    if (isEmpty(partialUsages)) {
      logger.log("skip", sourceFile.getFilePath());
      continue;
    }

    logger.log("ok", sourceFile.getFilePath());
    matchedFiles++;

    // ---------------------------------------------------------------------------
    // Merge file-level results into the project-level result
    // ---------------------------------------------------------------------------
    result.preKey.push(...partialUsages.preKey);
    result.key.push(...partialUsages.key);
    result.replacement.push(...partialUsages.replacement);
    result.rich.push(...partialUsages.rich);
    result.trans.push(...partialUsages.trans);
  }

  logger.footer(
    `scanned ${yellow(scannedFiles)} files, extracted from ${yellow(
      matchedFiles,
    )} file(s)`,
  );
  return result;
}
