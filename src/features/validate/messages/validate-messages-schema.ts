import type { InferNode } from "../../../core";
import type { ValidationResult } from "../validate-locale-messages";
import type { MessageObject } from "intor";

export function validateMessagesSchema(
  schema: InferNode,
  messages: MessageObject,
  path: string,
  result: ValidationResult,
) {
  // Only object schemas define required message keys
  if (schema.kind !== "object") return;

  // Traverse schema-defined keys and validate message presence
  for (const key of Object.keys(schema.properties)) {
    const nextPath = path ? `${path}.${key}` : key;
    const expected = schema.properties[key];
    const value = messages[key];

    // Schema requires this key, but message does not provide it
    if (value === undefined) {
      result.missingKeys.push(nextPath);
      continue;
    }

    // Recurse into nested message objects
    if (typeof value === "object" && value !== null) {
      validateMessagesSchema(
        expected,
        value as MessageObject,
        nextPath,
        result,
      );
    }
  }
}
