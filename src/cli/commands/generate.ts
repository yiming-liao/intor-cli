import type { ExtraExt } from "../../core";
import type { CAC } from "cac";
import { generate } from "../../features";
import { normalizeReaderOptions } from "./utils/normalize-reader-options";

export function registerGenerateCommand(cli: CAC) {
  cli
    // -----------------------------------------------------------------------
    // Command
    // -----------------------------------------------------------------------
    .command("generate", "Generate intor types and schemas")

    // -----------------------------------------------------------------------
    // Option
    // -----------------------------------------------------------------------
    .option(
      "--messages <path>",
      "Explicit messages file for schema generation (bypass runtime loader)",
    )
    .option(
      "--ext <ext>",
      "Enable extra messages file extension (repeatable)",
      { default: [] },
    )
    .option(
      "--reader <mapping>",
      "Custom reader mapping in the form <ext=path> (repeatable)",
      { default: [] },
    )
    .option(
      "--debug",
      "Print debug information during config discovery and generation",
    )

    // -----------------------------------------------------------------------
    // Action
    // -----------------------------------------------------------------------
    .action(async (options) => {
      const { messages, ext, reader, debug } = options as {
        messages?: string;
        ext?: Array<ExtraExt>;
        reader?: string[];
        debug?: boolean;
      };

      const { exts, customReaders } = normalizeReaderOptions({ ext, reader });

      try {
        await generate({
          messageFilePath: messages,
          exts,
          customReaders,
          debug,
        });
      } catch (error) {
        console.error(error);
        process.exitCode = 1;
      }
    });
}
