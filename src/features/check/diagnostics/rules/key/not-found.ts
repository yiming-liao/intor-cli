import type { KeyUsage, InferNode } from "../../../../../core";
import type { Diagnostic } from "../../types";
import { DIAGNOSTIC_MESSAGES } from "../../messages";
import { getSchemaNodeAtPath } from "../../utils/get-schema-node-at-path";
import { resolveKeyPath } from "../../utils/resolve-key-path";

/**
 * @example
 * ```ts
 * // Expected:
 * t("hello")
 *
 * // Received:
 * t("missing")
 * ```
 */
export function keyNotFound(
  usage: KeyUsage,
  messagesSchema: InferNode,
): Diagnostic[] {
  const { method, key, preKey, file, line, column } = usage;

  if (!key) return [];

  const keyPath = resolveKeyPath(key, preKey);
  if (!getSchemaNodeAtPath(messagesSchema, keyPath)) {
    return [
      {
        severity: "warn",
        method,
        messageKey: key,
        code: DIAGNOSTIC_MESSAGES.KEY_NOT_FOUND.code,
        message: DIAGNOSTIC_MESSAGES.KEY_NOT_FOUND.message(),
        file,
        line,
        column,
      },
    ];
  }

  return [];
}
