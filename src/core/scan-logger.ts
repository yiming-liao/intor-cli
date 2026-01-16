import pc from "picocolors";

const log = (tag: string, message: string) => {
  console.log(pc.dim(` (${tag})`) + pc.gray(` ${message}`));
};

export function createLogger(enabled?: boolean) {
  if (!enabled) return () => {};
  return log;
}
