import type { ExtractedUsages } from "./types";
import pc from "picocolors";
import { createLogger } from "../scan-logger";
import { extractUsagesFromSourceFile } from "./extract-usages-from-source-file";
import { loadSourceFilesFromTsconfig } from "./load-source-files-from-tscofnig";

/** Check whether a file-level extraction produced any meaningful usage */
const isEmpty = (u: ExtractedUsages) =>
  u.key.length === 0 && u.replacement.length === 0 && u.rich.length === 0;

export interface ExtractUsagesOptions {
  tsconfigPath?: string;
  debug?: boolean;
}

/**
 * Extract all static translator usages from a TypeScript project.
 */
export function extractUsages(options?: ExtractUsagesOptions): ExtractedUsages {
  const { tsconfigPath = "tsconfig.json", debug = false } = options || {};
  const log = createLogger(debug);

  const result: ExtractedUsages = {
    preKey: [],
    key: [],
    replacement: [],
    rich: [],
  };

  // Debug counters
  let scannedFiles = 0;
  let matchedFiles = 0;

  const sourceFiles = loadSourceFilesFromTsconfig(tsconfigPath, debug);

  // Process each source file independently
  for (const sourceFile of sourceFiles) {
    scannedFiles++;
    log("scan", sourceFile.getFilePath());

    // ---------------------------------------------------------------------------
    // File-level extraction (pure analysis, no side effects)
    // ---------------------------------------------------------------------------
    const partial = extractUsagesFromSourceFile(sourceFile);
    if (isEmpty(partial)) continue;
    matchedFiles++;

    // ---------------------------------------------------------------------------
    // Merge file-level results into the project-level result
    // ---------------------------------------------------------------------------
    result.preKey.push(...partial.preKey);
    result.key.push(...partial.key);
    result.replacement.push(...partial.replacement);
    result.rich.push(...partial.rich);
  }

  // Debug summary
  if (debug) {
    console.log(
      pc.dim(` › Scanned ${scannedFiles} files, matched ${matchedFiles} \n`),
    );
  }

  return result;
}
