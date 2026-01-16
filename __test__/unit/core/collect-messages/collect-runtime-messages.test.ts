/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "intor";
import { loadMessages } from "intor/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { collectRuntimeMessages } from "../../../../src/core";

vi.mock("intor/server", () => ({
  loadMessages: vi.fn(),
}));
vi.mock(
  "../../../../src/core/collect-messages/resolve-messages-reader",
  () => ({
    resolveMessagesReader: vi.fn(async () => async () => ({ custom: true })),
  }),
);

const createConfig = (overrides: Partial<IntorResolvedConfig> = {}) =>
  ({
    id: "test",
    defaultLocale: "en",
    messages: { en: { static: true } },
    ...overrides,
  }) as IntorResolvedConfig;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("collectRuntimeMessages", () => {
  it("returns static messages when no loaders exist", async () => {
    const config = createConfig();
    const result = await collectRuntimeMessages(config, "en");
    expect(result).toEqual({ en: { static: true } });
    expect(loadMessages).not.toHaveBeenCalled();
  });

  it("merges server runtime messages over static messages", async () => {
    const config = createConfig({ loader: true } as any);
    (loadMessages as any).mockResolvedValueOnce({
      en: { server: true },
    });
    const result = await collectRuntimeMessages(config, "en");
    expect(loadMessages).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      en: { static: true, server: true },
    });
  });

  it("merges client runtime messages over server messages", async () => {
    const config = createConfig({
      loader: true as any,
      client: { loader: true } as any,
    });
    (loadMessages as any)
      .mockResolvedValueOnce({ en: { server: true } })
      .mockResolvedValueOnce({ en: { client: true } });
    const result = await collectRuntimeMessages(config, "en");
    expect(loadMessages).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      en: {
        static: true,
        server: true,
        client: true,
      },
    });
  });

  it("passes resolved readers when exts are provided", async () => {
    const config = createConfig({ loader: true } as any);
    (loadMessages as any).mockResolvedValueOnce({ en: {} });
    await collectRuntimeMessages(config, "en", ["md", "yaml"]);
    const call = (loadMessages as any).mock.calls[0][0];
    expect(call.readers).toHaveProperty("md");
    expect(call.readers).toHaveProperty("yaml");
  });

  it("resolves and passes custom readers", async () => {
    const config = createConfig({ loader: true } as any);
    (loadMessages as any).mockResolvedValueOnce({ en: {} });
    await collectRuntimeMessages(config, "en", [], {
      foo: "/custom/reader.ts",
    });
    const call = (loadMessages as any).mock.calls[0][0];
    expect(call.readers).toHaveProperty("foo");
  });

  it("skips server and client loaders when none are defined", async () => {
    const config = createConfig({ loader: false, client: undefined } as any);
    const result = await collectRuntimeMessages(config, "en");
    expect(result).toEqual({ en: { static: true } });
  });
});
