/**
 * ---------------------------------------------------------------------------
 * 🎨 UI Constants
 * ---------------------------------------------------------------------------
 * This module defines reusable constants for styling and content across
 * the application. Keeping them centralized improves maintainability and
 * ensures consistent usage throughout the UI.
 */

/**
 * A set of background color utility classes (TailwindCSS).
 * 
 * ✅ Usage:
 * - Applied to UI components (e.g., ColorBox) to provide distinct visual
 *   variations.
 * - Ensures consistent styling and easy theme adjustments.
 *
 * @example
 * ```tsx
 * <div className={colors[0]}>Red Box</div>
 * ```
 *
 * @remarks
 * - Colors are defined as TailwindCSS utility classes.
 * - Extend this array if more variations are required.
 */
export const colors: string[] = [
  'bg-red-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-teal-400',
  'bg-orange-400',
];

/**
 * Default text used in demo components (e.g., ColorBox).
 *
 * ✅ Usage:
 * - Acts as placeholder/demo content in UI components.
 * - Can be replaced or localized as the project evolves.
 *
 * @example
 * ```tsx
 * <ColorBox text={TEXT} />
 * ```
 */
export const TEXT = 'Hello, World!';
