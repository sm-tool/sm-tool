export const STALE_TIME = {
  NEVER: Infinity,
  XLONG: 12 * 60 * 60 * 1000, // 12h
  LONG: 2 * 60 * 60 * 1000, // 2h
  MEDIUM: 30 * 60 * 1000, // 30m
  Short: 5 * 60 * 1000, // 5m
  XSHORT: 60 * 1000, // 60s
  IMMEDIATE: 0,
} as const;
