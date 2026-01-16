import fs from "node:fs/promises";
import path from "node:path";
import {
  DEFAULT_OUT_DIR,
  DEFAULT_TYPES_FILE,
  DEFAULT_SCHEMA_FILE,
} from "./constants";

export interface WriteOptions {
  cwd?: string;
  outDir?: string;
  typesFileName?: string;
  schemaFileName?: string;
}

export interface WriteGeneratedFilesResult {
  outDir: string;
  typesPath: string;
  schemaPath: string;
}

export async function writeGeneratedFiles(
  { types, schema }: { types: string; schema: unknown },
  options: WriteOptions = {},
): Promise<WriteGeneratedFilesResult> {
  const {
    cwd = process.cwd(),
    outDir = DEFAULT_OUT_DIR,
    typesFileName = DEFAULT_TYPES_FILE,
    schemaFileName = DEFAULT_SCHEMA_FILE,
  } = options;

  const resolvedOutDir = path.resolve(cwd, outDir);
  const typesPath = path.join(resolvedOutDir, typesFileName);
  const schemaPath = path.join(resolvedOutDir, schemaFileName);

  // Ensure .intor directory exists
  await fs.mkdir(resolvedOutDir, { recursive: true });

  // Write types (as-is)
  await fs.writeFile(typesPath, types, "utf8");

  // Write schema (pretty JSON for diff / debug)
  await fs.writeFile(schemaPath, JSON.stringify(schema, null, 2), "utf8");

  return {
    outDir: resolvedOutDir,
    typesPath,
    schemaPath,
  };
}
