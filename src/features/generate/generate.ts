/* eslint-disable unicorn/no-process-exit */
import type { ExtraExt } from "../../core";
import { buildTypes, buildSchemas, type BuildInput } from "../../build";
import {
  discoverConfigs,
  collectRuntimeMessages,
  inferSchemas,
  writeGeneratedFiles,
} from "../../core";
import { printTitle } from "../print-title";
import { spinner } from "../spinner";
import { printConfigs } from "./print-configs";
import { printOverrides } from "./print-overrides";
import { printSummary } from "./print-summary";

export interface GenerateOptions {
  exts?: Array<ExtraExt>;
  customReaders?: Record<string, string>;
  debug?: boolean;
}

export async function generate({
  exts = [],
  customReaders,
  debug,
}: GenerateOptions) {
  printTitle("Generating intor types");
  spinner.start();
  const start = performance.now();

  try {
    // -----------------------------------------------------------------------
    // Discover configs from the current workspace
    // -----------------------------------------------------------------------
    const configEntries = await discoverConfigs(debug);
    if (configEntries.length === 0) {
      spinner.stop();
      throw new Error("No Intor config found for type generation.");
    }

    // -----------------------------------------------------------------------
    // Collect messages and infer schemas
    // -----------------------------------------------------------------------
    const buildInputs: BuildInput[] = [];

    // Runtime mode - Per-config processing
    for (const { config, filePath } of configEntries) {
      const { id, supportedLocales: locales } = config;
      printConfigs(id, filePath);
      const { messages, overrides } = await collectRuntimeMessages(
        config,
        config.defaultLocale,
        exts,
        customReaders,
      );
      printOverrides(overrides);
      const schemas = inferSchemas(messages[config.defaultLocale]);
      buildInputs.push({ id, locales, schemas });
    }

    // -----------------------------------------------------------------------
    // Build artifacts and write output
    // -----------------------------------------------------------------------
    const types = buildTypes(buildInputs);
    const schema = buildSchemas(buildInputs);

    // Write generated files
    const { outDir } = await writeGeneratedFiles({ types, schema });

    spinner.stop();
    printSummary(outDir, performance.now() - start);
  } catch (error) {
    spinner.stop();
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
