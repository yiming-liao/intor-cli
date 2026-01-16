import type { InferredSchemas } from "../core";

export interface BuildInput {
  id: string;
  locales: readonly string[];
  schemas: InferredSchemas;
}

// Schema
export interface GeneratedSchema {
  version: number;
  generatedAt: string;
  configs: GeneratedSchemaConfig[];
}
export interface GeneratedSchemaConfig {
  id: string;
  locales: readonly string[];
  schemas: InferredSchemas;
}
