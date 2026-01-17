import type { InferredSchemas } from "./types";
import type { MessageObject } from "intor";
import { inferMessagesSchema } from "./messages";
import { inferReplacementsSchema } from "./replacements";
import { inferRichSchema } from "./rich";
import { stripInternalKeys } from "./utils/strip-internal-keys";

/**
 * Infer all semantic schemas from messages.
 */
export function inferSchemas(messages: MessageObject): InferredSchemas {
  const schemas = {
    messagesSchema: inferMessagesSchema(messages),
    replacementsSchema: inferReplacementsSchema(messages),
    richSchema: inferRichSchema(messages),
  };

  stripInternalKeys(schemas);
  return schemas;
}
