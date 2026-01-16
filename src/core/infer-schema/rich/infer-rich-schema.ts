import type { InferNode } from "../types";
import type { MessageObject, MessageValue } from "intor";
import { tokenize, type Token } from "intor";
import { inferObject } from "../utils/infer-object";
import { isMessageObject } from "../utils/is-message-object";

/**
 * Infer rich tag schema from a message object.
 *
 * Traverses message values and extracts rich tag names
 * into a semantic schema tree.
 */
export function inferRichSchema(messages: MessageObject): InferNode {
  if (!isMessageObject(messages) || Object.keys(messages).length === 0) {
    return { kind: "none" };
  }
  return inferValue(messages);
}

/**
 * Infer rich tag information from a single message value.
 *
 * - Strings are tokenized and analyzed for rich tags
 * - Objects are traversed recursively
 * - Arrays and unsupported values are ignored
 */
function inferValue(value: MessageValue): InferNode {
  // ----------------------------------------------------------------------
  // String values (rich source)
  // ----------------------------------------------------------------------
  if (typeof value === "string") {
    const tokens: Token[] = tokenize(value);

    // Collect unique rich tag names
    const properties: Record<string, InferNode> = {};

    for (const token of tokens) {
      if (token.type !== "tag-open") continue;
      properties[token.name] = { kind: "none" };
    }

    // No rich tags found
    if (Object.keys(properties).length === 0) {
      return { kind: "none" };
    }

    return { kind: "object", properties };
  }

  // ----------------------------------------------------------------------
  // Array values (semantically irrelevant for rich tags)
  // ----------------------------------------------------------------------
  if (Array.isArray(value)) {
    return { kind: "none" };
  }

  // ----------------------------------------------------------------------
  // Object values (delegate aggregation & pruning)
  // ----------------------------------------------------------------------
  if (isMessageObject(value)) {
    return inferObject(value, inferValue);
  }

  // Fallback
  return { kind: "none" };
}
