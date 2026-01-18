import type { ExtraExt } from "../constants";
import type { IntorResolvedConfig, MessageObject } from "intor";
import { collectRuntimeMessages } from "./collect-runtime-messages";

export async function collectOtherLocaleMessages(
  config: IntorResolvedConfig,
  exts: Array<ExtraExt> = [],
  customReaders?: Record<string, string>,
): Promise<Record<string, MessageObject>> {
  const { supportedLocales, defaultLocale } = config;

  const result: Record<string, MessageObject> = {};

  for (const locale of supportedLocales) {
    if (locale === defaultLocale) continue;

    const { messages } = await collectRuntimeMessages(
      config,
      locale,
      exts,
      customReaders,
    );
    result[locale] = messages[locale];
  }

  return result;
}
