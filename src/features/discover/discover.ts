import { features } from "../../constants";
import { discoverConfigs } from "../../core";
import { br, print, printConfigs, printTitle } from "../shared/print";

export interface DiscoverOptions {
  debug?: boolean;
}

export async function discover({ debug }: DiscoverOptions) {
  printTitle(features.discover.title);

  const entries = await discoverConfigs(debug);

  if (entries.length === 0) {
    br();
    print("No Intor config found.\n", 1);
    return;
  }

  br();
  printConfigs(entries);

  br();
}
