import type { InferNode } from "../types";
import type { MessageObject, MessageValue } from "intor";

/**
 * Infer an object-like semantic node by aggregating inferred children.
 *
 * - Delegates inference to child nodes
 * - Prunes branches without semantic meaning
 * - Returns `none` if no children remain
 */
export function inferObject(
  value: MessageObject,
  inferChild: (value: MessageValue) => InferNode,
): InferNode {
  const properties: Record<string, InferNode> = {};

  for (const [key, val] of Object.entries(value)) {
    const child = inferChild(val);

    // Skip branches without semantic meaning
    if (child.kind === "none") continue;

    properties[key] = child;
  }

  // No inferred children => no semantic result
  if (Object.keys(properties).length === 0) {
    return { kind: "none" };
  }

  return { kind: "object", properties };
}
