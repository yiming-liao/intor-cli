import type { ExtractedUsages, PreKeyMap } from "./types";
import type { SourceFile } from "ts-morph";
import {
  collectTranslatorBindings,
  collectKeyUsages,
  collectReplacementUsages,
  collectRichUsages,
  collectPreKeys,
} from "./collectors";

function attachPreKey<T extends { localName: string; preKey?: string }>(
  usages: T[],
  preKeyMap: PreKeyMap,
) {
  for (const usage of usages) usage.preKey = preKeyMap.get(usage.localName);
}

/**
 * Extract all static translator usages from a single source file.
 *
 * This is a pure, file-level extractor suitable for editor extensions
 * and incremental analysis.
 */
export function extractUsagesFromSourceFile(
  sourceFile: SourceFile,
): ExtractedUsages {
  // -----------------------------------------------------------------------
  // Translator binding
  // -----------------------------------------------------------------------
  const translatorBindingMap = collectTranslatorBindings(sourceFile);
  if (translatorBindingMap.size === 0) {
    return { preKey: [], key: [], replacement: [], rich: [] };
  }

  // -----------------------------------------------------------------------
  // Key usages
  // -----------------------------------------------------------------------
  const keyUsages = collectKeyUsages(sourceFile, translatorBindingMap);

  // -----------------------------------------------------------------------
  // Replacement usages
  // -----------------------------------------------------------------------
  const replacementUsages = collectReplacementUsages(
    sourceFile,
    translatorBindingMap,
  );

  // -----------------------------------------------------------------------
  // Rich usages
  // -----------------------------------------------------------------------
  const richUsages = collectRichUsages(sourceFile, translatorBindingMap);

  // -----------------------------------------------------------------------
  // PreKey values
  // -----------------------------------------------------------------------
  const { preKeyMap, usages } = collectPreKeys(
    sourceFile,
    translatorBindingMap,
  );

  // Attach preKey to all usages that support it
  attachPreKey(keyUsages, preKeyMap);
  attachPreKey(replacementUsages, preKeyMap);
  attachPreKey(richUsages, preKeyMap);

  return {
    preKey: usages,
    key: keyUsages,
    replacement: replacementUsages,
    rich: richUsages,
  };
}
