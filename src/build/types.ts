import type { InferredSchemas } from "../core";

export interface BuildInput {
  id: string;
  locales: readonly string[];
  schemas: InferredSchemas;
}

// Schema
export interface Schema {
  version: number;
  generatedAt: string;
  configs: SchemaConfig[];
}

export interface SchemaConfig {
  id: string;
  locales: readonly string[];
  schemas: InferredSchemas;
}
