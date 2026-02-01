import type { MergeOverrides } from "../../core/collect-messages/types";
import { dim, gray, print, br } from "../shared/print";

export function printOverrides(configId: string, overrides: MergeOverrides[]) {
  br();

  // Group overrides by layer
  const grouped = groupOverrides(overrides);

  const hasAny =
    grouped.client_over_server.length > 0 ||
    grouped.runtime_over_static.length > 0;
  if (!hasAny) return;

  // Print title
  print(`${configId} ${dim("Overrides:")}`, 1);

  // Print layer group
  printLayerGroup("client > server", grouped.client_over_server);
  printLayerGroup("runtime > static", grouped.runtime_over_static);

  br();
}

function groupOverrides(overrides: MergeOverrides[]) {
  const groups: Record<MergeOverrides["layer"], MergeOverrides[]> = {
    client_over_server: [],
    runtime_over_static: [],
  };
  for (const o of overrides) {
    if (o.kind !== "override") continue;
    if (typeof o.prev !== "string" && typeof o.next !== "string") continue;
    groups[o.layer].push(o);
  }
  return groups;
}

function printLayerGroup(label: string, items: MergeOverrides[]) {
  if (items.length === 0) return;
  print(dim(label), 2);
  for (const { path, prev, next } of items) {
    print(`- ${path} ${formatDiff(prev, next)}`, 3);
  }
}

const MAX_PREVIEW_LENGTH = 16;
function truncate(value: unknown, max = MAX_PREVIEW_LENGTH): string {
  if (typeof value !== "string") return "";
  if (value.length <= max) return value;
  return value.slice(0, max) + "…";
}

function formatDiff(prev: unknown, next: unknown) {
  return (
    dim("| Prev: ") +
    gray(truncate(prev)) +
    dim(" → Next: ") +
    gray(truncate(next))
  );
}
