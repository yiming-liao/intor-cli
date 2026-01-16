import type { InferNode } from "../../../core/infer-schema";
import { indent } from "./indent";

export function renderInferNode(node: InferNode, indentLevel = 4): string {
  switch (node.kind) {
    case "none": {
      return "unknown";
    }
    case "primitive": {
      return node.type;
    }
    case "array": {
      return `${renderInferNode(node.element, indentLevel)}[]`;
    }
    case "record": {
      return "Record<string, unknown>";
    }
    case "object": {
      return `{
${Object.entries(node.properties)
  .map(
    ([k, v]) =>
      `${indent(indentLevel)}  "${k}": ${renderInferNode(v, indentLevel + 1)};`,
  )
  .join("\n")}
${indent(indentLevel)}}`;
    }
  }
}
