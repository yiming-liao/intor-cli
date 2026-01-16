import type { MergeOverrides } from "../../core/collect-messages/types";
import pc from "picocolors";
import { spinner } from "../spinner";

export function printOverrides(overrides: MergeOverrides[]) {
  const printable = overrides.filter(
    (o) =>
      o.kind === "override" &&
      (typeof o.prev === "string" || typeof o.next === "string"),
  );
  if (printable.length === 0) return;

  spinner.stop();

  console.log(pc.dim("   ↳ Overrides"));

  // Print deduplicated override entries
  for (const { kind, layer, path, prev, next } of overrides) {
    if (kind === "add") continue;

    console.log(
      pc.dim("     - ") + pc.dim(`(${formatLayer(layer)}) `) + pc.gray(path),
      formatDiff(prev, next),
    );
  }

  console.log();
  spinner.start();
}

function formatLayer(layer: "client_over_server" | "runtime_over_static") {
  if (layer === "client_over_server") return "client > server";
  return "runtime > static";
}

function formatDiff(prev: unknown, next: unknown): string | undefined {
  if (typeof prev !== "string" && typeof next !== "string") return;
  return (
    pc.dim("| Prev: ") +
    pc.gray(typeof prev === "string" ? prev : "") +
    pc.dim(", Next: ") +
    pc.gray(typeof next === "string" ? next : "")
  );
}
