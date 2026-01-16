import type { ExtraExt } from "../../core/constants";
import type { MessagesReader, MessagesReaders } from "intor";
import { mdReader } from "@intor/reader-md";
import { yamlReader } from "@intor/reader-yaml";

export const BUILTIN_READERS: Record<ExtraExt, MessagesReader> = {
  md: mdReader,
  yaml: yamlReader,
};

export const getBuiltInReaders = (
  exts: readonly ExtraExt[],
): MessagesReaders => {
  // Map to [ext, reader]
  const entries = exts
    .map((ext) => {
      const reader = BUILTIN_READERS[ext];
      return reader ? [ext, reader] : null;
    })
    .filter((e): e is [ExtraExt, MessagesReader] => e !== null);
  // Entries to object
  return Object.fromEntries(entries);
};
