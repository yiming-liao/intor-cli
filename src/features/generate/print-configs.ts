import pc from "picocolors";
import { spinner } from "../spinner";

export function printConfigs(id: string, filePath: string) {
  spinner.stop();
  console.log(pc.dim("- Config ") + pc.cyan(id) + pc.dim(` ${filePath}`));
  spinner.start();
}
