import type { InferredSchemas } from "./types";
import type { MessageObject } from "intor";
import { inferMessagesSchema } from "./messages";
import { inferReplacementsSchema } from "./replacements";
import { inferRichSchema } from "./rich";

/**
 * Infer all semantic schemas from messages.
 */
export function inferSchemas(messages: MessageObject): InferredSchemas {
  return {
    messagesSchema: inferMessagesSchema(messages),
    replacementsSchema: inferReplacementsSchema(messages),
    richSchema: inferRichSchema(messages),
  };
}
