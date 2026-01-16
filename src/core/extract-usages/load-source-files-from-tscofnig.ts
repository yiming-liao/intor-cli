import fs from "node:fs";
import path from "node:path";
import { Project, type SourceFile } from "ts-morph";
import { createLogger } from "../scan-logger";

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
export function loadSourceFilesFromTsconfig(
  tsconfigPath: string,
  debug: boolean,
): SourceFile[] {
  const log = createLogger(debug);
  // ---------------------------------------------------------------------------
  // 1. Try loading source files directly from the given tsconfig
  // ---------------------------------------------------------------------------
  const project = new Project({ tsConfigFilePath: tsconfigPath });
  const files = project.getSourceFiles();
  if (files.length > 0) return files;

  // ---------------------------------------------------------------------------
  // 2. No source files found → attempt to follow project references
  // ---------------------------------------------------------------------------
  const configDir = path.dirname(tsconfigPath);
  const rawConfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
  const references: { path: string }[] = rawConfig.references ?? [];

  if (references.length === 0) return [];
  log("info", `no source files found, following project references`);

  // ---------------------------------------------------------------------------
  // 3. Load source files from each referenced tsconfig
  // ---------------------------------------------------------------------------
  const collected: SourceFile[] = [];

  for (const ref of references) {
    const refPath = path.resolve(configDir, ref.path);

    // Skip missing referenced tsconfig files
    if (!fs.existsSync(refPath)) {
      log("warn", `referenced tsconfig not found: ${refPath}`);
      continue;
    }

    log("ref ", `${path.relative(process.cwd(), refPath)}`);

    const refProject = new Project({ tsConfigFilePath: refPath });
    collected.push(...refProject.getSourceFiles());
  }

  return collected;
}
