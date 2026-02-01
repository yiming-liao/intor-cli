import fs from "node:fs";
import path from "node:path";
import { type IntorResolvedConfig } from "intor";
import { bold, cyan, yellow } from "../../features/shared/print";
import { scanFiles, createScanLogger } from "../scan";
import { isIntorResolvedConfig } from "./is-intor-resolved-config";
import { loadModule } from "./load-module";

export interface ConfigEntry {
  filePath: string;
  config: IntorResolvedConfig;
}

/**
 * Discover and resolve Intor configs from the current workspace.
 *
 * Notes:
 * - Configs must be declared via `defineIntorConfig(...)`
 * - Dynamic or computed configs are intentionally not supported
 */
export async function discoverConfigs(debug?: boolean): Promise<ConfigEntry[]> {
  const files = await scanFiles();
  const logger = createScanLogger(debug, "Discover configs");
  logger.header(bold(`scanning ${yellow(files.length)} candidate files`));

  const configEntries: ConfigEntry[] = [];
  const seenIds = new Set<string>();

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
      logger.log("warn", `failed to read ${relPath}`);
      continue;
    }

    // ----------------------------------------------------------------------
    // Skip files that clearly do not define an Intor config
    // ----------------------------------------------------------------------
    if (!content.includes("defineIntorConfig(")) {
      logger.log("skip", `${relPath} (missing defineIntorConfig)`);
      continue;
    }
    logger.log("load", relPath);

    // ----------------------------------------------------------------------
    // Dynamic import & export inspection
    // ----------------------------------------------------------------------
    try {
      const moduleExports = await loadModule(absPath);
      let matched = false;
      let resolvedCount = 0;

      // Loop through all exports
      for (const module of Object.values(moduleExports)) {
        const config = module as IntorResolvedConfig;
        if (!isIntorResolvedConfig(module)) continue;
        matched = true;

        // Ensure config ids are unique across the workspace
        if (seenIds.has(module.id)) {
          logger.log(
            "warn",
            `duplicate config id "${module.id}" (ignored, ${relPath})`,
          );
          continue;
        }

        seenIds.add(module.id);
        resolvedCount++;

        configEntries.push({ filePath: absPath, config });
        logger.log("ok", `resolved config ${cyan(config.id)}`);
      }

      if (matched && resolvedCount === 0) {
        logger.log("warn", `no usable Intor config export (${relPath})`);
      }
    } catch {
      logger.log("warn", `failed to import module (${relPath})`);
    }
  }

  if (configEntries.length === 0) {
    logger.log("warn", "no Intor config discovered");
  }

  logger.footer(
    `scanned ${yellow(files.length)} files, resolved ${yellow(
      configEntries.length,
    )} Intor config(s)`,
  );
  return configEntries.sort((a, b) => a.filePath.localeCompare(b.filePath));
}
