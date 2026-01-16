import type { GeneratedSchema } from "../build";
import fs from "node:fs/promises";
import path from "node:path";
import { DEFAULT_OUT_DIR, DEFAULT_SCHEMA_FILE } from "./constants";

export interface ReadGeneratedSchemaOptions {
  cwd?: string;
  outDir?: string;
  fileName?: string;
}

export async function readGeneratedSchema(
  options: ReadGeneratedSchemaOptions = {},
): Promise<GeneratedSchema> {
  const {
    cwd = process.cwd(),
    outDir = DEFAULT_OUT_DIR,
    fileName = DEFAULT_SCHEMA_FILE,
  } = options;

  const schemaPath = path.resolve(cwd, outDir, fileName);

  let raw: string;

  // Try to read
  try {
    raw = await fs.readFile(schemaPath, "utf8");
  } catch {
    throw new Error(
      `Failed to read intor schema file at "${schemaPath}".\n Have you run "intor generate"?`,
    );
  }

  // Try to parse
  try {
    return JSON.parse(raw) as GeneratedSchema;
  } catch {
    throw new Error(
      `Invalid JSON format in intor schema file at "${schemaPath}".`,
    );
  }
}
