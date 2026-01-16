import pc from "picocolors";

const label = (text: string) => pc.dim(text.padEnd(18));

export function printSummary(outDir: string, ms: number) {
  console.log();
  console.log(pc.green(pc.bold("✔ intor generate completed")));
  console.log();
  console.log(label("Output directory: ") + pc.gray(outDir));
  console.log(label("Time elapsed: ") + pc.gray(`${(ms / 1000).toFixed(2)}s`));
  console.log();
  console.log(
    pc.dim("💡 Remember to include ") +
      pc.gray(".intor/**/*.d.ts") +
      pc.dim(" in your tsconfig.json "),
  );
  console.log();
}
