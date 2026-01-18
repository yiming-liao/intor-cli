import { bold, br, dim, gray, green, italic, print } from "../print";

const label = (text: string) => dim(text.padEnd(18));

export function printSummary(outDir: string, ms: number) {
  br();

  print(green(bold("✔ intor generate completed")));

  br();

  print(label("Output directory: ") + gray(outDir));
  print(label("Time elapsed: ") + gray(`${(ms / 1000).toFixed(2)}s`));

  br();

  print(
    italic(
      dim("💡 Remember to include ") +
        gray(".intor/**/*.d.ts") +
        dim(" in your tsconfig.json "),
    ),
  );

  br();
}
