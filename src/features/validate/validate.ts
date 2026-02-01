/* eslint-disable unicorn/no-process-exit */
import { features } from "../../constants";
import { discoverConfigs, readSchema, type ReaderOptions } from "../../core";
import { collectOtherLocaleMessages } from "../../core";
import { br, printMissingSchema, printTitle } from "../shared/print";
import { spinner } from "../shared/spinner";
import { writeJsonReport } from "../shared/write-json-report";
import { printSummary } from "./print-summary";
import {
  validateLocaleMessages,
  type ValidationResult,
} from "./validate-locale-messages";

type ValidateReportByConfig = Record<string, ValidationResult>;
type ValidateReport = Record<string, ValidateReportByConfig>;

export interface ValidateOptions extends ReaderOptions {
  format?: "human" | "json";
  output?: string;
  debug?: boolean;
}

export async function validate({
  exts = [],
  customReaders,
  format = "human",
  output,
  debug,
}: ValidateOptions) {
  const isHuman = format === "human";
  if (isHuman) printTitle(features.validate.title);

  // -----------------------------------------------------------------------
  // Discover configs from the current workspace
  // -----------------------------------------------------------------------
  const configEntries = await discoverConfigs(debug);
  if (configEntries.length === 0) {
    if (isHuman) spinner.stop();
    throw new Error("No Intor config found.");
  }

  try {
    // -----------------------------------------------------------------------
    // Read generated schema
    // -----------------------------------------------------------------------
    const schema = await readSchema();
    const report: ValidateReport = {};

    // Per-config processing
    for (const { config } of configEntries) {
      const schemaConfig = schema.configs.find((c) => c.id === config.id);
      if (!schemaConfig) {
        if (isHuman) {
          spinner.stop();
          printMissingSchema(config.id);
          spinner.start();
        }
        continue;
      }

      // Load all non-default locale messages
      const localeMessages = await collectOtherLocaleMessages(config, {
        exts,
        customReaders,
      });

      // Per-locale validation
      const reportByConfig: ValidateReportByConfig = {};
      for (const locale of config.supportedLocales) {
        if (locale === config.defaultLocale) continue;

        const messages = localeMessages[locale];
        if (!messages) continue;

        reportByConfig[locale] = validateLocaleMessages(
          schemaConfig.schemas,
          messages,
        );
      }

      report[config.id] = reportByConfig;
    }

    if (isHuman) {
      spinner.stop();
      br();
      printSummary(report);
    }

    // JSON output
    if (format === "json") {
      await writeJsonReport(report, output);
    }
  } catch (error) {
    if (isHuman) spinner.stop();
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
