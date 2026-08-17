// Content now lives in Postgres and is read through the typed data layer.
// This module is kept as a deprecated re-export shim; new code should import
// directly from `@/lib/data/content` and `@/lib/data/articles`.
export * from "./data/content"
export * from "./data/articles"
