// discover-configs
export { discoverConfigs } from "./discover-configs";

// collect-messages
export {
  collectRuntimeMessages,
  collectOtherLocaleMessages,
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

// generated
export {
  writeTypes,
  writeSchema,
  readSchema,
  writeMessagesSnapshot,
} from "./generated";

// constants
export { DEFAULT_OUT_DIR, EXTRA_EXTS, type ExtraExt } from "./constants";
