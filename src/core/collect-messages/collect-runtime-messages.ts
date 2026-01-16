import type { ExtraExt } from "../../core";
import {
  mergeMessages,
  resolveLoaderOptions,
  type IntorResolvedConfig,
  type LocaleMessages,
  type MessagesReaders,
} from "intor";
import { loadMessages } from "intor/server";
import { getBuiltInReaders } from "../collect-messages/readers";
import { resolveMessagesReader } from "./resolve-messages-reader";

/**
 * Collect runtime messages for a given locale.
 *
 * Precedence: client-side runtime > server-side runtime > static messages.
 */
export async function collectRuntimeMessages(
  config: IntorResolvedConfig,
  locale: string,
  exts: Array<ExtraExt> = [],
  customReaders?: Record<string, string>, // {ext, customReaderFilePath}
): Promise<LocaleMessages> {
  // ----------------------------------------------------------------------
  // Resolve readers
  // ----------------------------------------------------------------------
  // Resolve optional custom readers
  const resolvedCustomReaders: MessagesReaders = {};
  for (const [ext, filePath] of Object.entries(customReaders || {})) {
    const resolved = await resolveMessagesReader(filePath);
    if (resolved) resolvedCustomReaders[ext] = resolved;
  }
  const readers = { ...getBuiltInReaders(exts), ...resolvedCustomReaders };

  // ----------------------------------------------------------------------
  // Load runtime messages
  // ----------------------------------------------------------------------
  let serverMessages: LocaleMessages | undefined;
  let clientMessages: LocaleMessages | undefined;

  // Load server-side runtime messages
  if (config.loader || config.server?.loader) {
    const serverLoader = resolveLoaderOptions(config, "server");
    if (serverLoader) {
      serverMessages = await loadMessages({
        config: { ...config, loader: serverLoader },
        locale,
        readers,
      });
    }
  }

  // Load client-side runtime messages
  if (config.client?.loader) {
    const clientLoader = resolveLoaderOptions(config, "client");
    if (clientLoader) {
      clientMessages = await loadMessages({
        config: { ...config, loader: clientLoader },
        locale,
        readers,
      });
    }
  }

  // ----------------------------------------------------------------------
  // Merge messages
  // ----------------------------------------------------------------------
  // client-side runtime > server-side runtime
  const runtimeMessages = mergeMessages(serverMessages, clientMessages, {
    config,
    locale,
  });

  // runtime messages > static messages
  return mergeMessages(config.messages, runtimeMessages, { config, locale });
}
