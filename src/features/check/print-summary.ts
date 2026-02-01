import type { DiagnosticGroup } from "./diagnostics/types";
import { br, dim, printList, print, gray, printConfig } from "../shared/print";
import { toRelativePath } from "../shared/to-relative-path";

export function printSummary(configId: string, grouped: DiagnosticGroup[]) {
  br();

  printConfig(configId);
  br();

  if (grouped.length === 0) {
    print(dim("✔ All usages are valid\n"), 1);
    return;
  }

  // Print groups
  for (const group of grouped) {
    const { origin, messageKey, problems, file, lines } = group;

    // e.g. hello (t)
    print(`${messageKey} (${origin})`, 1);

    // e.g.
    // - replacements missing: name
    // - rich tags missing: a
    printList(
      null,
      problems.map((p) => gray(p)),
      1,
    );

    // e.g. ⚲ examples/extract-test.tsx:7
    print(dim(`  ⚲ ${toRelativePath(file)}:${lines.join(",")}\n`), 1);
  }
}
