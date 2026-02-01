/* eslint-disable unicorn/no-process-exit */

import type { LocaleMessages } from "intor";
import { readFile } from "node:fs/promises";
import { buildTypes, buildSchemas, type BuildInput } from "../../build";
import { features } from "../../constants";
import {
  discoverConfigs,
  collectRuntimeMessages,
  inferSchemas,
  writeTypes,
  writeSchema,
  DEFAULT_OUT_DIR,
  type ReaderOptions,
  type MergeOverrides,
} from "../../core";
import { br, printConfigs, printTitle } from "../shared/print";
import { spinner } from "../shared/spinner";
import { toRelativePath } from "../shared/to-relative-path";
import { printOverrides } from "./print-overrides";
import { printSummary } from "./print-summary";
import { resolveMessageSource } from "./utils/resolve-message-source";
import { validateMessageSource } from "./utils/validate-message-source";

export type MessageSource =
  | { mode: "single"; file: string }
  | { mode: "mapping"; files: Record<string, string> }
  | { mode: "none" };

export interface GenerateOptions extends ReaderOptions {
  messageSource?: MessageSource;
  debug?: boolean;
}

export async function generate({
  messageSource = { mode: "none" },
  exts = [],
  customReaders,
  debug,
}: GenerateOptions) {
  printTitle(features.generate.title);
  const start = performance.now();

  try {
    // -----------------------------------------------------------------------
    // Discover configs from the current workspace
    // -----------------------------------------------------------------------
    const configEntries = await discoverConfigs(debug);
    if (configEntries.length === 0) throw new Error("No Intor config found.");

    // Validate messageSource against discovered configs
    validateMessageSource(messageSource, configEntries);

    br();
    printConfigs(configEntries);
    spinner.start();

    // -----------------------------------------------------------------------
    // Collect messages and infer schemas
    // -----------------------------------------------------------------------
    const buildInputs: BuildInput[] = [];

    // Per-config message collection and schema inference
    for (const { config } of configEntries) {
      const { id, supportedLocales: locales } = config;

      let messages: LocaleMessages;
      let overrides: MergeOverrides[] = [];
      const messageFilePath = resolveMessageSource(messageSource, id);

      if (messageFilePath) {
        // ----------------------------------------------------------
        // File mode (per-config)
        // ----------------------------------------------------------
        const content = await readFile(messageFilePath, "utf8");
        messages = { [config.defaultLocale]: JSON.parse(content) };
      } else {
        // ----------------------------------------------------------
        // Runtime mode (default)
        // ----------------------------------------------------------
        const result = await collectRuntimeMessages(
          config,
          config.defaultLocale,
          { exts, customReaders },
        );
        messages = result.messages;
        overrides = result.overrides;
      }
      spinner.stop();

      printOverrides(config.id, overrides);
      const schemas = inferSchemas(messages[config.defaultLocale]);
      buildInputs.push({ id, locales, schemas });

      spinner.start();
    }

    // -----------------------------------------------------------------------
    // Build artifacts and write output
    // -----------------------------------------------------------------------
    const types = buildTypes(buildInputs);
    const schema = buildSchemas(buildInputs);

    // Write files
    await writeTypes(types);
    await writeSchema(schema);

    spinner.stop();
    printSummary(toRelativePath(DEFAULT_OUT_DIR), performance.now() - start);
  } catch (error) {
    spinner.stop();
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
