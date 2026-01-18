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
    .option(
      "--tsconfig <path>",
      "Path to tsconfig.json (default: tsconfig.json)",
    )
    .option("--debug", "Enable debug logging")

    // -----------------------------------------------------------------------
    // Action
    // -----------------------------------------------------------------------
    .action(async (options: ExtractUsagesOptions) => {
      const { tsconfigPath, debug } = options;
      try {
        await check({ tsconfigPath, debug });
      } catch (error) {
        console.error(error);
        process.exitCode = 1;
      }
    });
}
