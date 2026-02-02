import fs from "node:fs";
import path from "node:path";
import { Project, type SourceFile } from "ts-morph";
import { createLogger } from "../../logger";
import { br, yellow } from "../../render";

/**
 * Load source files from a tsconfig.
 *
 * Strategy:
 * 1. Try loading source files from the given tsconfig directly.
 * 2. If no source files are found, follow project references (one level).
 * 3. Return the collected source files for further static analysis.
 *
 * Notes:
 * - This is designed to support Vite-style tsconfig setups
 *   where the root tsconfig only contains references.
 * - References are followed non-recursively on purpose.
 */
export function loadSourceFiles(
  tsconfigPath: string,
  debug = false,
): SourceFile[] {
  if (debug) br();
  const logger = createLogger(debug);
  logger.header("Load source files - processing tsconfig", {
    kind: "process",
  });

  // ---------------------------------------------------------------------------
  // Try loading source files directly from the given tsconfig
  // ---------------------------------------------------------------------------
  const project = new Project({ tsConfigFilePath: tsconfigPath });
  const files = project.getSourceFiles();
  if (files.length > 0) {
    logger.footer(`loaded ${yellow(files.length)} files`, { kind: "process" });
    return files;
  }

  // ---------------------------------------------------------------------------
  // No source files found, attempt to follow project references
  // ---------------------------------------------------------------------------
  const configDir = path.dirname(tsconfigPath);
  const rawTsConfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

  // Project references (e.g. { references: [ { path: "./tsconfig.app.json" } ] })
  const references: { path: string }[] = rawTsConfig.references ?? [];
  if (references.length === 0) {
    logger.footer("no source files found", { kind: "process" });
    return [];
  }

  logger.log();
  logger.process("load", `references (${references.length})`);

  // ---------------------------------------------------------------------------
  // Load source files from each referenced tsconfig
  // ---------------------------------------------------------------------------
  const collected: SourceFile[] = [];

  for (const ref of references) {
    const refPath = path.relative(configDir, ref.path);

    // Skip missing referenced tsconfig files
    if (!fs.existsSync(refPath)) {
      logger.process("warn", `referenced tsconfig not found: ${refPath}`);
      continue;
    }

    logger.process("load", `${path.relative(process.cwd(), refPath)}`);

    const refProject = new Project({ tsConfigFilePath: refPath });
    collected.push(...refProject.getSourceFiles());
  }

  logger.footer(`loaded ${yellow(collected.length)} files`, {
    kind: "process",
    lineBreakBefore: 1,
  });
  return collected;
}
