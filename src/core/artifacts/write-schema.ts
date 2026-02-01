import type { Schema } from "../../build";
import path from "node:path";
import { DEFAULT_OUT_DIR, DEFAULT_SCHEMA_FILE_NAME } from "../constants";
import { ensureAndWrite } from "./ensure-and-write";

export async function writeSchema(schema: Schema): Promise<string> {
  const filePath = path.join(DEFAULT_OUT_DIR, DEFAULT_SCHEMA_FILE_NAME);
  return await ensureAndWrite(filePath, JSON.stringify(schema, null, 2));
}
