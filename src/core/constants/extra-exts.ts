export const EXTRA_EXTS = ["md", "yaml"] as const;
export type ExtraExt = (typeof EXTRA_EXTS)[number];
