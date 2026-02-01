import type { MessageSource } from "../generate";

export function resolveMessageSource(
  source: MessageSource,
  configId: string,
): string | undefined {
  switch (source.mode) {
    case "single": {
      return source.file;
    }

    case "mapping": {
      return source.files[configId];
    }

    default: {
      return undefined;
    }
  }
}
