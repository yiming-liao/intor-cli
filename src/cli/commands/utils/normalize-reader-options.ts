import type { ReaderOptions, ExtraExt } from "../../../core";
import type { CliOptions } from "../options/options";

/**
 * Normalize CLI reader-related options
 */
export function normalizeReaderOptions({
  ext = [],
  reader = [],
}: Pick<CliOptions, "ext" | "reader">): ReaderOptions {
  // Normalize custom readers
  let customReaders: Record<string, string> | undefined;

  if (reader && reader.length > 0) {
    customReaders = {};

    for (const item of reader) {
      const [key, value] = item.split("=", 2);
      if (!key || !value) {
        throw new Error(
          `Invalid --reader entry: "${item}". Each entry must be in the form: <ext=path>`,
        );
      }

      customReaders[key] = value;
    }
  }

  return {
    exts: ext as ExtraExt[],
    customReaders,
  };
}
