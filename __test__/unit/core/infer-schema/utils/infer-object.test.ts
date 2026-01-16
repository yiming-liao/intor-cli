import type { InferNode } from "../../../../../src/core/infer-schema";
import { describe, it, expect, vi } from "vitest";
import { inferObject } from "../../../../../src/core/infer-schema/utils/infer-object";

describe("inferObject", () => {
  it("delegates inference to child nodes", () => {
    const inferChild = vi.fn<(value: unknown) => InferNode>().mockReturnValue({
      kind: "primitive",
      type: "string",
    });
    inferObject({ a: "hello", b: "world" }, inferChild);
    expect(inferChild).toHaveBeenCalledTimes(2);
    expect(inferChild).toHaveBeenCalledWith("hello");
    expect(inferChild).toHaveBeenCalledWith("world");
  });

  it("collects inferred children into an object node", () => {
    const inferChild = vi
      .fn<(value: unknown) => InferNode>()
      .mockImplementation((value) => {
        if (value === "keep") {
          return { kind: "primitive", type: "string" };
        }
        return { kind: "none" };
      });
    const result = inferObject({ a: "keep", b: "drop" }, inferChild);
    expect(result).toEqual({
      kind: "object",
      properties: {
        a: { kind: "primitive", type: "string" },
      },
    });
  });

  it("prunes branches with kind 'none'", () => {
    const inferChild = vi
      .fn<(value: unknown) => InferNode>()
      .mockReturnValue({ kind: "none" });
    const result = inferObject({ a: "x", b: "y" }, inferChild);
    expect(result).toEqual({ kind: "none" });
  });

  it("returns 'none' when all children are pruned", () => {
    const inferChild = vi
      .fn<(value: unknown) => InferNode>()
      .mockReturnValue({ kind: "none" });
    const result = inferObject({ a: "x" }, inferChild);
    expect(result).toEqual({ kind: "none" });
  });

  it("returns an object node with multiple inferred properties", () => {
    const inferChild = vi
      .fn<(value: unknown) => InferNode>()
      .mockImplementation((value) => {
        if (value === 1) {
          return { kind: "primitive", type: "number" };
        }
        if (value === true) {
          return { kind: "primitive", type: "boolean" };
        }
        return { kind: "none" };
      });
    const result = inferObject({ a: 1, b: true, c: null }, inferChild);
    expect(result).toEqual({
      kind: "object",
      properties: {
        a: { kind: "primitive", type: "number" },
        b: { kind: "primitive", type: "boolean" },
      },
    });
  });
});
