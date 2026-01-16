/* eslint-disable unicorn/no-process-exit */
import type { ReadGeneratedSchemaOptions } from "../../core";
import type { ExtractUsagesOptions } from "../../core/extract-usages/extract-usages";
import {
  readGeneratedSchema,
  extractUsages,
  collectDiagnostics,
  groupDiagnostics,
} from "../../core";
import { printTitle } from "../../features/print-title";
import { spinner } from "../spinner";
import { dedupePreKeyUsages } from "./dedupe-pre-key-usages";
import { printSummary } from "./print-summary";

function resolveConfigKey(
  usageConfigKey: string | undefined,
  defaultConfigKey: string,
) {
  if (usageConfigKey === "__default__") return defaultConfigKey;
  if (usageConfigKey == null) return defaultConfigKey;
  return usageConfigKey;
}

export async function check(
  readOptions?: ReadGeneratedSchemaOptions,
  extractOptions?: ExtractUsagesOptions,
) {
  printTitle("Checking intor diagnostics");
  spinner.start();

  try {
    // -----------------------------------------------------------------------
    // Read generated schema
    // -----------------------------------------------------------------------
    const generatedSchema = await readGeneratedSchema(readOptions);

    // -----------------------------------------------------------------------
    // Extract usages
    // -----------------------------------------------------------------------
    const usages = extractUsages(extractOptions);

    // Use first config's id as default key
    const defaultConfigKey = generatedSchema.configs[0]?.id;

    spinner.stop();

    // Per-config processing
    for (const config of generatedSchema.configs) {
      // configKey <-> config.id
      const configKey = config.id;

      // per-config usages
      const scopedUsages = {
        preKey: dedupePreKeyUsages(
          usages.preKey.filter(
            (u) =>
              resolveConfigKey(u.configKey, defaultConfigKey) === configKey,
          ),
        ),
        key: usages.key.filter(
          (u) => resolveConfigKey(u.configKey, defaultConfigKey) === configKey,
        ),
        replacement: usages.replacement.filter(
          (u) => resolveConfigKey(u.configKey, defaultConfigKey) === configKey,
        ),
        rich: usages.rich.filter(
          (u) => resolveConfigKey(u.configKey, defaultConfigKey) === configKey,
        ),
      };

      // Diagnostic
      const diagnostics = collectDiagnostics(config.schemas, scopedUsages);
      const grouped = groupDiagnostics(diagnostics);

      printSummary(config.id, grouped);
    }
  } catch (error) {
    spinner.stop();
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
