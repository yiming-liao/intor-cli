import type { KeyUsage } from "../../../extract-usages";
import type { Diagnostic } from "../../types";
import { DIAGNOSTIC_MESSAGES } from "../../messages";

/**
 * @example
 * ```ts
 * // Expected:
 * t("hello")
 *
 * // Received:
 * t("")
 * ```
 */
export function keyEmpty(usage: KeyUsage): Diagnostic[] {
  const { method, key, file, line, column } = usage;

  if (!key) {
    return [
      {
        severity: "warn",
        method,
        messageKey: key,
        code: DIAGNOSTIC_MESSAGES.KEY_EMPTY.code,
        message: DIAGNOSTIC_MESSAGES.KEY_EMPTY.message(),
        file,
        line,
        column,
      },
    ];
  }

  return [];
}
