import type { MissingRequirements } from "./collect-missing-requirements";
import type { InferNode } from "../../../core";
import { tokenize, type MessageObject, type Token } from "intor";

export function collectMissingRich(
  schema: InferNode,
  messages: MessageObject,
  path: string,
  result: MissingRequirements,
) {
  // Only object schemas define expected rich tags
  if (schema.kind !== "object") return;

  // Traverse schema-defined keys
  for (const key of Object.keys(schema.properties)) {
    const nextPath = path ? `${path}.${key}` : key;
    const expected = schema.properties[key];
    const value = messages[key];

    // Schema requires this key, but message does not provide it
    if (value === undefined) continue;

    // --------------------------------------------------
    // Leaf string message: validate rich tags
    // --------------------------------------------------
    if (typeof value === "string") {
      if (expected.kind !== "object") continue;

      const tokens: Token[] = tokenize(value);
      const actualTags = new Set(
        tokens.filter((t) => t.type === "tag-open").map((t) => t.name),
      );

      // Report any schema-required rich tags missing in the message
      for (const tag of Object.keys(expected.properties)) {
        if (actualTags.has(tag)) continue;
        result.missingRich.push({ key: nextPath, tag });
      }

      continue;
    }

    // Recurse into nested message objects
    if (typeof value === "object" && value !== null) {
      collectMissingRich(expected, value as MessageObject, nextPath, result);
    }
  }
}
