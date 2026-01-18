import type { ValidationResult } from "./validate-locale-messages";
import { italic, dim, printList, cyan, br, print, gray } from "../print";

function hasValidationIssue(result: ValidationResult): boolean {
  return (
    result.missingKeys.length > 0 ||
    result.missingReplacements.length > 0 ||
    result.missingRichTags.length > 0
  );
}

export function printSummary(
  resultsByConfig: Record<string, Record<string, ValidationResult>>,
) {
  const entries = Object.entries(resultsByConfig);

  // --------------------------------------------------
  // Config block
  // --------------------------------------------------
  entries.forEach(([configId, results], index) => {
    let hasAnyIssueInConfig = false;

    print(`${dim("Config:")} ${cyan(configId)}`);
    br();

    // --------------------------------------------------
    // Locale block
    // --------------------------------------------------
    for (const [locale, result] of Object.entries(results)) {
      if (!hasValidationIssue(result)) continue;
      hasAnyIssueInConfig = true;

      print(italic(`${dim("Locale:")} ${locale}`), 1);
      br();

      printList(gray("Missing keys:"), result.missingKeys, 2);
      if (result.missingKeys.length > 0) br();

      printList(
        gray("Missing replacements:"),
        result.missingReplacements.map((r) => `${r.key}: ${r.name}`),
        2,
      );
      if (result.missingReplacements.length > 0) br();

      printList(
        gray("Missing rich tags:"),
        result.missingRichTags.map((r) => `${r.key}: ${r.tag}`),
        2,
      );
      if (result.missingRichTags.length > 0) br();
    }

    // --------------------------------------------------
    // No issues in this config
    // --------------------------------------------------
    if (!hasAnyIssueInConfig) {
      print(dim("✔ All locales are valid"), 1);
      br();
    }

    // Separate configs visually (except last)
    if (index < entries.length - 1) br();
  });
}
