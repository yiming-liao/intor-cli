#!/usr/bin/env tsx

import { cac } from "cac";
import {
  registerDiscoverCommand,
  registerGenerateCommand,
  registerCheckCommand,
  registerValidateCommand,
} from "./commands";
import { run } from "./menu";

const VERSION = "0.1.10";

async function main() {
  // argv = [node, script, ...args]
  const args = process.argv.slice(2);

  // -------------------------------------------------------------------
  // Interactive menu bypasses CAC entirely
  // -------------------------------------------------------------------
  if (args.length === 0) {
    await run();
    return;
  }

  // -------------------------------------------------------------------
  // Command mode (original CAC behavior)
  // -------------------------------------------------------------------
  const cli = cac("intor");

  registerDiscoverCommand(cli);
  registerGenerateCommand(cli);
  registerCheckCommand(cli);
  registerValidateCommand(cli);

  cli.help();
  cli.version(VERSION);
  cli.parse(process.argv);
}

await main();
