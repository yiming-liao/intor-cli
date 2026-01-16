import pc from "picocolors";

export function printTitle(title: string) {
  console.log();
  console.log(pc.bgBlack(` • ${title} `));
  console.log();
}
