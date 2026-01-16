import type { BuildInput, GeneratedSchema } from "../types";

export function buildSchemas(inputs: BuildInput[]): GeneratedSchema {
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
