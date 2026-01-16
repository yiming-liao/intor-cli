import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import { type IntorResolvedConfig } from "intor";
import { createLogger } from "../scan-logger";
import { isIntorResolvedConfig } from "./is-intor-resolved-config";
import { loadModule } from "./load-module";

const DEFAULT_PATTERNS = ["**/*.{ts,js}"];
const DEFAULT_IGNORE = [
  "**/node_modules/**",
  "**/dist/**",
  "**/*.d.ts",
  "**/*.test.*",
  "**/*.test-d.ts",
];

export interface ConfigEntry {
  filePath: string;
  config: IntorResolvedConfig;
}

/**
 * Discover and resolve Intor configs from the current workspace.
 */
export async function discoverConfigs(debug?: boolean): Promise<ConfigEntry[]> {
  const files = await fg(DEFAULT_PATTERNS, { ignore: DEFAULT_IGNORE });
  const log = createLogger(debug);
  log("scan", `found ${files.length} candidate files`);

  const configEntries: ConfigEntry[] = [];

  // Iterate through candidate files
  for (const file of files) {
    const absPath = path.resolve(process.cwd(), file);
    const relPath = path.relative(process.cwd(), absPath);

    // ----------------------------------------------------------------------
    // Read file content
    // ----------------------------------------------------------------------
    let content: string;
    try {
      content = await fs.promises.readFile(absPath, "utf8");
    } catch {
      log("warn", `failed to read ${relPath}`);
      continue;
    }

    // ----------------------------------------------------------------------
    // Skip files that clearly do not define an Intor config
    // ----------------------------------------------------------------------
    if (!content.includes("defineIntorConfig(")) {
      log("skip", `${relPath} (no defineIntorConfig)`);
      continue;
    }
    log("load", relPath);

    // ----------------------------------------------------------------------
    // Dynamic import & export inspection
    // ----------------------------------------------------------------------
    try {
      const moduleExports = await loadModule(absPath);
      let matched = false;

      for (const module of Object.values(moduleExports)) {
        const config = module as IntorResolvedConfig;
        if (!isIntorResolvedConfig(config)) continue;

        matched = true;

        configEntries.push({ filePath: absPath, config });
        log(" ok ", `resolved config "${config.id}"`);
      }

      if (!matched) {
        log("warn", `no valid Intor config export found in ${relPath}`);
      }
    } catch {
      log("warn", `failed to import ${relPath}`);
    }
  }

  if (configEntries.length === 0) {
    log("info", "no Intor config discovered");
  }

  return configEntries;
}
