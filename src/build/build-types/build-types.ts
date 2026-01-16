import type { BuildInput } from "../types";
import { appendHeader, appendConfigBlock, appendFooter } from "./output";
import { renderInferNode } from "./utils/render-infer-node";

const GENERATED_INTERFACE_NAME = "IntorGeneratedTypes";

/**
 * Builds the global TypeScript declaration from inferred typegen inputs.
 */
export function buildTypes(inputs: BuildInput[]): string {
  const lines: string[] = [];

  // Global declaration header
  appendHeader(lines, GENERATED_INTERFACE_NAME);

  // Per-config processing
  for (const [index, input] of inputs.entries()) {
    const localesType = input.locales.map((l) => `"${l}"`).join(" | ");
    const messagesType = renderInferNode(input.schemas.messagesSchema);
    const replacementsType = renderInferNode(input.schemas.replacementsSchema);
    const richType = renderInferNode(input.schemas.richSchema);

    if (index === 0) {
      appendConfigBlock(lines, {
        id: "__default__",
        locales: localesType,
        messages: messagesType,
        replacements: replacementsType,
        rich: richType,
      });
    }

    appendConfigBlock(lines, {
      id: `"${input.id}"`,
      locales: localesType,
      messages: messagesType,
      replacements: replacementsType,
      rich: richType,
    });
  }

  // Global declaration footer
  appendFooter(lines);

  return lines.join("\n");
}
