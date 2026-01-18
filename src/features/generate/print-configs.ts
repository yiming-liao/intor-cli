import { cyan, dim, print } from "../print";
import { spinner } from "../spinner";

export function printConfigs(configId: string, filePath: string) {
  spinner.stop();
  print(`${dim("Config:")} ${cyan(configId)}  ⚲ ${filePath}`);
  spinner.start();
}
