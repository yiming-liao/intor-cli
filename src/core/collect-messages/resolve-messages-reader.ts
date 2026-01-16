import type { MessagesReader } from "intor";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Resolve a MessagesReader from a module path.
 *
 * Resolution order:
 * 1. Default export
 * 2. First exported function (fallback)
 */
export async function resolveMessagesReader(
  filePath?: string,
): Promise<MessagesReader | undefined> {
  if (!filePath) return;

  const absolutePath = path.resolve(process.cwd(), filePath);

  // ----------------------------------------------------------------------
  // Ensure the file exists before attempting dynamic import
  // ----------------------------------------------------------------------
  try {
    await fs.access(absolutePath);
  } catch {
    throw new Error(`[intor] Reader file not found: ${filePath}`);
  }

  // ----------------------------------------------------------------------
  // Resolve reader module exports
  // ----------------------------------------------------------------------
  // Dynamically import the reader module
  const moduleExports = await import(absolutePath);

  // Prefer default export
  let reader = moduleExports.default;

  // Fallback to the first exported function
  if (typeof reader !== "function") {
    for (const value of Object.values(moduleExports)) {
      if (typeof value === "function") {
        reader = value;
        break;
      }
    }
  }

  // ----------------------------------------------------------------------
  // Validate resolved reader
  // ----------------------------------------------------------------------
  if (typeof reader !== "function") {
    throw new Error(
      `[intor] No function export found in reader module: ${filePath}`,
    );
  }

  return reader;
}
