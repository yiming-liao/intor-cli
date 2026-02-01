/* eslint-disable unicorn/no-process-exit */
import type { Diagnostic } from "./diagnostics/types";
import { features } from "../../constants";
import { extractUsages, readSchema } from "../../core";
import { loadSourceFiles } from "../../core/scan";
import { printTitle } from "../shared/print";
import { spinner } from "../shared/spinner";
import { writeJsonReport } from "../shared/write-json-report";
import { buildScopeUsages } from "./build-scoped-usages";
import { collectDiagnostics, groupDiagnostics } from "./diagnostics";
import { printSummary } from "./print-summary";

interface CheckReport {
  configs: Array<{ id: string; diagnostics: Diagnostic[] }>;
}

export interface CheckOptions {
  tsconfigPath?: string;
  format?: "human" | "json";
  output?: string;
  debug?: boolean;
}

export async function check({
  format = "human",
  output,
  tsconfigPath = "tsconfig.json",
  debug,
}: CheckOptions) {
  const isHuman = format === "human";
  if (isHuman) {
    printTitle(features.check.title);
    spinner.start();
  }

  try {
    // Read generated schema
    const schema = await readSchema();

    if (isHuman) spinner.stop();

    // Load source files
    const sourceFiles = loadSourceFiles(tsconfigPath, debug);
    if (sourceFiles.length === 0) {
      if (sourceFiles.length === 0) {
        throw new Error(
          [
            "No source files found.",
            "",
            "Check the following:",
            "  - tsconfig.json path",
            "  - project root",
            "  - included source patterns",
          ].join("\n"),
        );
      }
    }
    // Extract usages from source files
    const usages = extractUsages({ sourceFiles, debug });

    // Use first config's id as default key
    const defaultConfigKey = schema.configs[0]?.id;

    const report: CheckReport = { configs: [] };

    // Per-config processing
    for (const config of schema.configs) {
      const configKey = config.id;

      // per-config usages
      const scopedUsages = buildScopeUsages({
        usages,
        defaultConfigKey,
        configKey,
      });

      // Diagnostic
      const diagnostics = collectDiagnostics(config.schemas, scopedUsages);
      report.configs.push({ id: config.id, diagnostics });

      // Human summary
      if (isHuman) {
        const grouped = groupDiagnostics(diagnostics);
        printSummary(config.id, grouped);
      }
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
