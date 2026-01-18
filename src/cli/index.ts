#!/usr/bin/env tsx

import { cac } from "cac";
import { registerCheckCommand } from "./commands/check";
import { registerGenerateCommand } from "./commands/generate";
import { registerValidateCommand } from "./commands/validate";

const cli = cac("intor");

// ---------------------------------------------------------------------
// Register commands
// ---------------------------------------------------------------------
registerGenerateCommand(cli);
registerCheckCommand(cli);
registerValidateCommand(cli);

// ---------------------------------------------------------------------
// Global options / help
// ---------------------------------------------------------------------
cli.help();
cli.version("0.1.10");

// ---------------------------------------------------------------------
// Parse argv
// ---------------------------------------------------------------------
cli.parse();
