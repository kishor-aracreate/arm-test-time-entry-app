/**
 * ---------------------------------------------------------------------------
 * 📂 Centralized Type Re-Exports
 * ---------------------------------------------------------------------------
 *
 * This file re-exports all TypeScript type definitions from related UI
 * components and utilities. It serves as a **single entry point** for
 * consumers of shared types, instead of importing from individual files.
 *
 * ✅ Benefits:
 * - Simplifies imports (one source of truth for types).
 * - Reduces coupling between components and their internal type files.
 * - Provides a clear registry of available types in the project.
 * - Keeps the codebase maintainable and consistent.
 *
 * @example
 * ```ts
 * // ❌ Avoid
 * import type { GridLayoutProps } from '@/components/grid-layout';
 * import type { ColourBoxProps } from '@/components/colour-box';
 *
 * // ✅ Recommended
 * import type { GridLayoutProps, ColourBoxProps } from '@/types';
 * ```
 *
 * @remarks
 * - This file should only re-export **types** (no runtime values).
 * - Keep exports **alphabetically ordered** to improve scan-ability and
 *   avoid unnecessary merge conflicts.
 * - Group exports by domain (e.g., UI components, utilities) if the file
 *   grows large.
 */
export type * from './add-button';
export type * from './colour-box';
export type * from './grid-layout';
