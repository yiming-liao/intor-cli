import pc from "picocolors";

type ScanLogTag = "ok" | "warn" | "skip" | "load" | string;

const formatTag = (tag: ScanLogTag) => {
  switch (tag) {
    case "ok": {
      return pc.green(tag.padEnd(4, " "));
    }
    case "warn": {
      return pc.yellow(tag.padEnd(4, " "));
    }
    case "load": {
      return tag.padEnd(4, " ");
    }
    case "skip": {
      return pc.dim(tag.padEnd(4, " "));
    }
    default: {
      return pc.gray(tag.padEnd(4, " "));
    }
  }
};

const formatMessage = (tag: ScanLogTag, message: string) => {
  return tag === "skip" ? pc.dim(message) : message;
};

export function createScanLogger(enabled?: boolean, phaseName = "intor") {
  if (!enabled) return { header: () => {}, log: () => {}, footer: () => {} };

  return {
    header: (message?: string) => {
      const prefix = "\n" + pc.dim("┌─ ○ ") + phaseName;
      if (message) {
        console.log(prefix + " - " + message + pc.dim("\n│ "));
      } else {
        console.log(prefix + pc.dim("\n│ "));
      }
    },
    log: (tag: ScanLogTag, message: string) => {
      console.log(
        pc.dim("│  │ ") +
          formatTag(tag) +
          pc.dim(" │ ") +
          formatMessage(tag, message),
      );
    },
    footer: (message: string) => {
      console.log(pc.dim("│\n") + pc.dim("└─ ● ") + message);
    },
  };
}
