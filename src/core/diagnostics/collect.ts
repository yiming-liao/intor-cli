import type { Diagnostic } from "./types";
import type { ExtractedUsages } from "../extract-usages";
import type { InferredSchemas } from "../infer-schema/types";
import { enforceMissingReplacements } from "./rules/enforce-missing-replacements";
import { enforceMissingRich } from "./rules/enforce-missing-rich";
import { keyEmpty, keyNotFound } from "./rules/key";
import { preKeyNotFound } from "./rules/pre-key";
import {
  replacementsNotAllowed,
  replacementsMissing,
  replacementsUnused,
} from "./rules/replacement";
import { richMissing, richNotAllowed, richUnused } from "./rules/rich";
import { indexUsagesByKey } from "./utils/index-usages-by-key";

export function collectDiagnostics(
  { messagesSchema, replacementsSchema, richSchema }: InferredSchemas,
  usages: ExtractedUsages,
) {
  const diagnostics: Diagnostic[] = [];

  // PreKey
  for (const usage of usages.preKey) {
    diagnostics.push(...preKeyNotFound(usage, messagesSchema));
  }

  // Key
  for (const usage of usages.key) {
    diagnostics.push(...keyNotFound(usage, messagesSchema), ...keyEmpty(usage));
  }

  // Replacement
  for (const usage of usages.replacement) {
    diagnostics.push(
      ...replacementsNotAllowed(usage, replacementsSchema),
      ...replacementsMissing(usage, replacementsSchema),
      ...replacementsUnused(usage, replacementsSchema),
    );
  }

  // Rich
  for (const usage of usages.rich) {
    diagnostics.push(
      ...richNotAllowed(usage, richSchema),
      ...richMissing(usage, richSchema),
      ...richUnused(usage, richSchema),
    );
  }

  // Ensure required replacements / rich tags are detected even when no usage provides them
  const replacementIndex = indexUsagesByKey(usages.replacement);
  const richIndex = indexUsagesByKey(usages.rich);
  for (const usage of usages.key) {
    diagnostics.push(
      ...enforceMissingReplacements(
        usage,
        replacementIndex,
        replacementsSchema,
      ),
      ...enforceMissingRich(usage, richIndex, richSchema),
    );
  }

  return diagnostics;
}
