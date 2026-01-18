/* eslint-disable unicorn/no-process-exit */
import type { ExtractUsagesOptions } from "../../core";
import { extractUsages, readSchema } from "../../core";
import { printTitle } from "../print";
import { spinner } from "../spinner";
import { dedupePreKeyUsages } from "./dedupe-pre-key-usages";
import { collectDiagnostics, groupDiagnostics } from "./diagnostics";
import { printSummary } from "./print-summary";

function resolveConfigKey(
  usageConfigKey: string | undefined,
  defaultConfigKey: string,
) {
  if (usageConfigKey === "__default__") return defaultConfigKey;
  if (usageConfigKey == null) return defaultConfigKey;
  return usageConfigKey;
}

export async function check(extractOptions?: ExtractUsagesOptions) {
  printTitle("Checking intor usages");
  spinner.start();

  try {
    // -----------------------------------------------------------------------
    // Read generated schema
    // -----------------------------------------------------------------------
    const generatedSchema = await readSchema();

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
