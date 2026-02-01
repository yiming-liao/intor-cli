import { intro } from "@clack/prompts";
import pc from "picocolors";

export function printIntro() {
  intro(
    pc.cyan(`
  ▄▄ ▄▄  ▄▄ ▄▄▄▄▄▄ ▄▄▄  ▄▄▄▄  
  ██ ███▄██   ██  ██▀██ ██▄█▄ 
  ██ ██ ▀██   ██  ▀███▀ ██ ██  
`),
  );
}
