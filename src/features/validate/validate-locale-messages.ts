import type { InferredSchemas } from "../../core";
import type { MessageObject } from "intor";
import { validateMessagesSchema } from "./messages";
import { validateReplacementsSchema } from "./replacements";
import { validateRichSchema } from "./rich";

export interface ValidationResult {
  missingKeys: string[];
  missingReplacements: Array<{ key: string; name: string }>;
  missingRichTags: Array<{ key: string; tag: string }>;
}

/**
 * Validate a locale's messages against inferred semantic schemas.
 */
export function validateLocaleMessages(
  schemas: InferredSchemas,
  localeMessages: MessageObject,
): ValidationResult {
  const result: ValidationResult = {
    missingKeys: [],
    missingReplacements: [],
    missingRichTags: [],
  };

  validateMessagesSchema(schemas.messagesSchema, localeMessages, "", result);

  validateReplacementsSchema(
    schemas.replacementsSchema,
    localeMessages,
    "",
    result,
  );

  validateRichSchema(schemas.richSchema, localeMessages, "", result);

  return result;
}
