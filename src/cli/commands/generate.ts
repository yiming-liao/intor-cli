import type { ExtraExt } from "../../core";
import type { CAC } from "cac";
import { generate } from "../../features";

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
      const { ext, reader, debug } = options as {
        ext?: Array<ExtraExt>;
        reader?: string[];
        debug?: boolean;
      };

      // Normalize exts
      const exts = ext ? (Array.isArray(ext) ? ext : [ext]) : [];

      // Parse customReaders: ["md=./my-md-reader.ts"] → { md: "./my-md-reader.ts" }
      let customReaders: Record<string, string> | undefined;
      if (reader && reader.length > 0) {
        customReaders = {};
        for (const item of reader) {
          const [key, value] = item.split("=", 2);
          if (!key || !value) continue;
          customReaders[key] = value;
        }
      }

      try {
        await generate({ exts, customReaders, debug });
      } catch (error) {
        console.error(error);
        process.exitCode = 1;
      }
    });
}
