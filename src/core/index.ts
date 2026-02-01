// discover-configs
export { discoverConfigs, type ConfigEntry } from "./discover-configs";

// collect-messages
export {
  collectRuntimeMessages,
  collectOtherLocaleMessages,
  type ReaderOptions,
  type MergeOverrides,
} from "./collect-messages";

// infer-schema
export {
  inferSchemas,
  type InferNode,
  type InferredSchemas,
  extractInterpolationNames,
} from "./infer-schema";

// extract-usages
export {
  extractUsages,
  type ExtractUsagesOptions,
  type ExtractedUsages,
  type TranslatorFactory,
  type TranslatorMethod,
  type ReplacementUsage,
  type PreKeyUsage,
  type KeyUsage,
  type RichUsage,
} from "./extract-usages";

// artifacts
export {
  writeTypes,
  writeSchema,
  readSchema,
  writeMessagesSnapshot,
} from "./artifacts";

// constants
export { DEFAULT_OUT_DIR, EXTRA_EXTS, type ExtraExt } from "./constants";
