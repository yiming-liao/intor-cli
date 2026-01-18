/* eslint-disable unicorn/no-array-sort */
import type { MessageObject } from "intor";
import path from "node:path";
import { DEFAULT_OUT_DIR, DEFAULT_MESSAGES_SNAPSHOT_DIR } from "../constants";
import { ensureAndWrite } from "./ensure-and-write";

export async function writeMessagesSnapshot(
  localeMessages: Record<string, MessageObject>,
): Promise<string[]> {
  const filePaths: string[] = [];

  for (const locale of Object.keys(localeMessages).sort()) {
    const messages = localeMessages[locale];

    const filePath = path.join(
      DEFAULT_OUT_DIR,
      DEFAULT_MESSAGES_SNAPSHOT_DIR,
      `${locale}.json`,
    );

    await ensureAndWrite(filePath, JSON.stringify(messages, null, 2));

    filePaths.push(filePath);
  }

  return filePaths;
}
