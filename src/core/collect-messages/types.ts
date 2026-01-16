import type { DeepMergeOverrideEvent, LocaleMessages } from "intor";

export interface CollectRuntimeMessagesResult {
  messages: LocaleMessages;
  overrides: MergeOverrides[];
}

export interface MergeOverrides extends DeepMergeOverrideEvent {
  layer: "client_over_server" | "runtime_over_static";
  locale: string;
  configId: string;
}
