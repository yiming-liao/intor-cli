import type { ExtraExt } from "../constants";
import type { DeepMergeOverrideEvent, LocaleMessages } from "intor";

export interface ReaderOptions {
  exts?: Array<ExtraExt>;
  customReaders?: Record<string, string>; // {ext, customReaderFilePath}
}

export interface CollectRuntimeMessagesResult {
  messages: LocaleMessages;
  overrides: MergeOverrides[];
}

export interface MergeOverrides extends DeepMergeOverrideEvent {
  layer: "clientOverServer" | "runtimeOverStatic";
  locale: string;
  configId: string;
}
