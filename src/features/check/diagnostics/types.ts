import type { TranslatorFactory, TranslatorMethod } from "../../../core";

export interface Diagnostic {
  severity: "error" | "warn";
  factory?: TranslatorFactory;
  method?: TranslatorMethod;
  messageKey: string;
  code: string;
  message: string;
  file: string;
  line: number;
  column: number;
}

export interface DiagnosticGroup {
  severity: "error" | "warn";
  factory?: TranslatorFactory;
  method?: TranslatorMethod;
  messageKey: string;
  problems: string[]; // list of bullet messages
  file: string;
  lines: number[]; // sorted, unique
}
