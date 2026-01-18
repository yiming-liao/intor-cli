import pc from "picocolors";

export const dim = pc.dim;
export const cyan = pc.cyan;
export const green = pc.green;
export const bold = pc.bold;
export const italic = pc.italic;
export const gray = pc.gray;

const INDENT = "  ";

export function print(text = "", indentLevel = 0) {
  if (!text) return;
  console.log(INDENT.repeat(indentLevel) + text);
}

export function br(count = 1) {
  for (let i = 0; i < count; i++) console.log();
}

export function printTitle(title: string) {
  console.log();
  console.log(pc.bgBlack(` • ${title} `));
  console.log();
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
