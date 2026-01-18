import type { BuildInput, Schema } from "../types";

export function buildSchemas(inputs: BuildInput[]): Schema {
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    configs: inputs.map((input) => ({
      id: input.id,
      locales: input.locales,
      schemas: input.schemas,
    })),
  };
}
