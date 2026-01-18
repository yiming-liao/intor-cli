import type { ExtraExt } from "../../../core";

export interface NormalizedReaderOptions {
  exts: ExtraExt[];
  customReaders?: Record<string, string>;
}

export interface RawReaderOptions {
  ext?: string | string[];
  reader?: string[];
}

/**
 * Normalize CLI reader-related options:
 * - ext: string | string[] → string[]
 * - reader: ["md=./reader.ts"] → { md: "./reader.ts" }
 */
export function normalizeReaderOptions(
  options: RawReaderOptions,
): NormalizedReaderOptions {
  // Normalize exts
  const exts = options.ext
    ? Array.isArray(options.ext)
      ? options.ext
      : [options.ext]
    : [];

  // Normalize custom readers
  let customReaders: Record<string, string> | undefined;

  if (options.reader && options.reader.length > 0) {
    customReaders = {};

    for (const item of options.reader) {
      const [key, value] = item.split("=", 2);
      if (!key || !value) continue;

      customReaders[key] = value;
    }
  }

  return {
    exts: exts as ExtraExt[],
    customReaders,
  };
}
