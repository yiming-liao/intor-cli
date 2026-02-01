import type { ConfigEntry } from "../../core";
import pc from "picocolors";
import { toRelativePath } from "./to-relative-path";

export const dim = pc.dim;
export const cyan = pc.cyan;
export const green = pc.green;
export const bold = pc.bold;
export const italic = pc.italic;
export const gray = pc.gray;
export const yellow = pc.yellow;

const INDENT = "  ";

export function print(text = "", indentLevel = 0) {
  if (!text) return;
  console.log(INDENT.repeat(indentLevel) + text);
}

export function br(count = 1) {
  for (let i = 0; i < count; i++) console.log();
}

export function printTitle(title: string, lineBreaks = 0) {
  br();
  console.log(pc.bgBlack(` • ${title} `));
  br(lineBreaks);
}

export function printList(
  title: string | null,
  items: readonly string[],
  indentLevel = 0,
) {
  if (items.length === 0) return;
  if (title) print(title, indentLevel);
  for (const value of items) {
    print(`- ${value}`, indentLevel + 1);
  }
}

export function printMissingSchema(configId: string) {
  print(`${dim("Config:")} ${cyan(configId)}`);
  print(dim("✖ Missing schema: run `intor generate` and retry"), 1);
  br();
}

export function printConfigs(entries: ConfigEntry[]) {
  print(dim(`Found ${entries.length} Intor config(s):\n`));
  for (const { filePath, config } of entries) {
    print(`${cyan(config.id)}  ${dim(`⚲ ${toRelativePath(filePath)}`)}`, 1);
  }
}

export function printConfig(configId: string) {
  print(`${dim("Config:")} ${cyan(configId)}`);
}
