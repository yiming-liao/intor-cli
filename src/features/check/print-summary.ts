import type { DiagnosticGroup } from "../../core/diagnostics/types";
import pc from "picocolors";

export function printSummary(configId: string, grouped: DiagnosticGroup[]) {
  // Log header
  console.log(pc.dim("Config:"), pc.cyan(`${configId}\n`));

  // Log no issues
  if (grouped.length === 0) {
    console.log(pc.dim("✔ Diagnostics completed with no issues.\n"));
    return;
  }

  // Log problems
  for (const group of grouped) {
    const { factory, method, messageKey, problems, file, lines } = group;

    const header = `${messageKey} ${`(${method ?? factory})`}\n`;

    const problemsLine = [
      ...problems.map((p) => pc.gray(`   - ${p}`)),
      pc.dim(`   ➜ ${file}:${lines.join(",")}`),
      "",
    ].join("\n");

    console.log(header + problemsLine);
  }
}
