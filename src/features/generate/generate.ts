/* eslint-disable unicorn/no-process-exit */
import type { ExtraExt } from "../../core";
import type { MergeOverrides } from "../../core/collect-messages/types";
import type { LocaleMessages } from "intor";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { buildTypes, buildSchemas, type BuildInput } from "../../build";
import {
  discoverConfigs,
  collectRuntimeMessages,
  inferSchemas,
  writeTypes,
  writeSchema,
  DEFAULT_OUT_DIR,
} from "../../core";
import { cyan, dim, print, printTitle } from "../print";
import { spinner } from "../spinner";
import { printOverrides } from "./print-overrides";
import { printSummary } from "./print-summary";

export interface GenerateOptions {
  messageFilePath?: string;
  exts?: Array<ExtraExt>;
  customReaders?: Record<string, string>;
  debug?: boolean;
}

export async function generate({
  messageFilePath,
  exts = [],
  customReaders,
  debug,
}: GenerateOptions) {
  printTitle("Generating intor types");
  spinner.start();
  const start = performance.now();

  const hasTarget = !!messageFilePath;

  try {
    // -----------------------------------------------------------------------
    // Discover configs from the current workspace
    // -----------------------------------------------------------------------
    const configEntries = await discoverConfigs(debug);
    if (configEntries.length === 0) {
      spinner.stop();
      throw new Error("No Intor config found.");
    }

    // -----------------------------------------------------------------------
    // Collect messages and infer schemas
    // -----------------------------------------------------------------------
    const buildInputs: BuildInput[] = [];

    // Runtime mode - Per-config processing
    for (const { config, filePath } of configEntries) {
      const { id, supportedLocales: locales } = config;

      spinner.stop();
      print(`${dim("Config:")} ${cyan(config.id)}  ${dim(`⚲ ${filePath}`)}`);
      spinner.start();

      let messages: LocaleMessages;
      let overrides: MergeOverrides[] = [];
      if (!hasTarget) {
        const result = await collectRuntimeMessages(
          config,
          config.defaultLocale,
          exts,
          customReaders,
        );
        messages = result.messages;
        overrides = result.overrides;
      } else {
        const content = await readFile(messageFilePath, "utf8");
        messages = { [config.defaultLocale]: JSON.parse(content) };
      }

      printOverrides(overrides);
      const schemas = inferSchemas(messages[config.defaultLocale]);
      buildInputs.push({ id, locales, schemas });
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
    printSummary(path.resolve(DEFAULT_OUT_DIR), performance.now() - start);
  } catch (error) {
    spinner.stop();
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
