import type { DiagnosticGroup } from "./diagnostics/types";
import { br, dim, printList, cyan, print, gray } from "../print";

export function printSummary(configId: string, grouped: DiagnosticGroup[]) {
  print(`${dim("Config:")} ${cyan(configId)}`);
  br();

  // No issues
  if (grouped.length === 0) {
    print(dim("✔ All usages are valid\n"), 1);
    return;
  }

  // Problems
  for (const group of grouped) {
    const { origin, messageKey, problems, file, lines } = group;

    const header = `${messageKey} (${origin})`;

    print(header, 1);
    printList(
      null,
      problems.map((p) => gray(p)),
      1,
    );
    print(dim(`  ⚲ ${file}:${lines.join(",")}\n`), 1);
  }
}
