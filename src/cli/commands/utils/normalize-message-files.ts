import type { MessageSource } from "../../../features";

/**
 * Normalize message file CLI options into a MessageSource.
 */
export function normalizeMessageFiles(
  messageFile?: string,
  messageFiles: string[] = [],
): MessageSource {
  if (messageFile && messageFiles.length > 0) {
    throw new Error(
      "Cannot use --message-file and --message-files at the same time.",
    );
  }

  // --------------------------------------------------
  // single mode
  // --------------------------------------------------
  if (messageFile) {
    return {
      mode: "single",
      file: messageFile,
    };
  }

  // --------------------------------------------------
  // mapping mode
  // --------------------------------------------------
  if (messageFiles.length > 0) {
    const files: Record<string, string> = {};

    for (const messageFile of messageFiles) {
      const [id, path] = messageFile.split("=", 2);
      if (!id || !path) {
        throw new Error(
          `Invalid --message-files entry: "${messageFile}". Each entry must be in the form: <configId=path>`,
        );
      }
      files[id] = path;
    }

    return {
      mode: "mapping",
      files,
    };
  }

  return { mode: "none" };
}
