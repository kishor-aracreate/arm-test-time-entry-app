import type { GridLayout } from '@/types';

/**
 * Calculate a responsive grid layout (rows × columns) for a given number of boxes.
 * ---------------------------------------------------------------------------
 * Ensures that the boxes are arranged in a roughly square grid by:
 * - Using the square root of the box count to determine column count.
 * - Dividing the total box count by the number of columns to determine row count.
 *
 * ✅ Example:  
 * - 4 boxes → 2×2 grid  
 * - 5 boxes → 3×2 grid  
 * - 10 boxes → 4×3 grid  
 *
 * @param boxes - Total number of boxes to render in the grid.
 * @returns A {@link GridLayout} object containing the number of columns (`cols`)
 * and rows (`rows`) required to fit the boxes.
 *
 * @example
 * ```ts
 * import { calculateGridLayout } from '@/lib/utils';
 *
 * const layout = calculateGridLayout(7);
 * // layout → { cols: 3, rows: 3 }
 * ```
 *
 * @remarks
 * - The grid aims for the most balanced (square-like) layout possible.
 * - For zero or negative input, behavior depends on consumer — ensure input validation upstream.
 */
export const calculateGridLayout = (boxes: number): GridLayout => {
  const cols: number = Math.ceil(Math.sqrt(boxes));
  const rows: number = Math.ceil(boxes / cols);
  return { cols, rows };
};
