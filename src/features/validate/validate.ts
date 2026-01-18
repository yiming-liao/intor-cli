/* eslint-disable unicorn/no-process-exit */
import { discoverConfigs, readSchema, type ExtraExt } from "../../core";
import { collectOtherLocaleMessages } from "../../core";
import { printMissingSchema, printTitle } from "../print";
import { spinner } from "../spinner";
import { printSummary } from "./print-summary";
import {
  validateLocaleMessages,
  type ValidationResult,
} from "./validate-locale-messages";

export interface ValidateOptions {
  exts?: Array<ExtraExt>;
  customReaders?: Record<string, string>;
  debug?: boolean;
}

export async function validate({
  exts = [],
  customReaders,
  debug,
}: ValidateOptions) {
  printTitle("Validating intor translations");
  spinner.start();

  // -----------------------------------------------------------------------
  // Discover configs from the current workspace
  // -----------------------------------------------------------------------
  const configEntries = await discoverConfigs(debug);
  if (configEntries.length === 0) {
    spinner.stop();
    throw new Error("No Intor config found.");
  }

  try {
    // -----------------------------------------------------------------------
    // Read generated schema
    // -----------------------------------------------------------------------
    const schema = await readSchema();

    const resultsByConfig: Record<
      string,
      Record<string, ValidationResult>
    > = {};

    // Per-config processing
    for (const { config } of configEntries) {
      const schemaConfig = schema.configs.find((c) => c.id === config.id);
      if (!schemaConfig) {
        spinner.stop();
        printMissingSchema(config.id);
        spinner.start();
        continue;
      }

      // Load all non-default locale messages
      const localeMessages = await collectOtherLocaleMessages(
        config,
        exts,
        customReaders,
      );

      const results: Record<string, ValidationResult> = {};
      for (const locale of config.supportedLocales) {
        if (locale === config.defaultLocale) continue;
        const messages = localeMessages[locale];
        if (!messages) continue;
        results[locale] = validateLocaleMessages(
          schemaConfig.schemas,
          messages,
        );
      }

      resultsByConfig[config.id] = results;
    }

    spinner.stop();
    printSummary(resultsByConfig);
  } catch (error) {
    spinner.stop();
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
