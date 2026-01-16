import type { ReadGeneratedSchemaOptions } from "../../core";
import type { ExtractUsagesOptions } from "../../core/extract-usages/extract-usages";
import type { CAC } from "cac";
import { check } from "../../features";

export function registerCheckCommand(cli: CAC) {
  cli
    // -----------------------------------------------------------------------
    // Command
    // -----------------------------------------------------------------------
    .command("check", "Validate intor translation usage")

    // -----------------------------------------------------------------------
    // Option
    // -----------------------------------------------------------------------
    // Read generated schema options
    .option(
      "--cwd <path>",
      "Working directory for resolving intor config (default: process.cwd())",
    )
    .option(
      "--file-name <name>",
      "Generated schema file name (default: intor-generated.schema.json)",
    )
    .option(
      "--out-dir <path>",
      "Directory of generated schema output (default: .intor)",
    )
    // Extract usages options
    .option(
      "--tsconfig <path>",
      "Path to tsconfig.json (default: tsconfig.json)",
    )
    .option("--debug", "Enable debug logging")

    // -----------------------------------------------------------------------
    // Action
    // -----------------------------------------------------------------------
    .action(
      async (options: ReadGeneratedSchemaOptions & ExtractUsagesOptions) => {
        const { cwd, fileName, outDir, tsconfigPath, debug } = options;
        try {
          await check({ cwd, fileName, outDir }, { tsconfigPath, debug });
        } catch (error) {
          console.error(error);
          process.exitCode = 1;
        }
      },
    );
}
