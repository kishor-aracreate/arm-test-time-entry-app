import { useState } from 'react';
import ColorBox from '@/components/ui/colour-box';
import AddButton from '@/components/ui/add-button';
import { calculateGridLayout } from '@/lib/utils';
import type { GridLayout } from '@/types';
import { TEXT } from '@/lib/constants';

/**
 * HelloWorld Component
 * ---------------------------------------------------------------------------
 * A demo component that renders a responsive grid of colored boxes, with
 * support for dynamically adding new boxes.
 *
 * ✅ Responsibilities:
 * - Manage the number of boxes using React state.
 * - Dynamically calculate an optimal grid layout based on box count.
 * - Render `ColorBox` components in a grid.
 * - Provide an `AddButton` to insert new boxes into the grid.
 *
 * @remarks
 * - Uses CSS Grid with dynamic `gridTemplateColumns` and `gridTemplateRows`.
 * - Relies on `calculateGridLayout` util for layout calculation logic.
 * - Demonstrates how shared types (`GridLayout`) improve readability.
 *
 * @example
 * ```tsx
 * // Usage:
 * <HelloWorld />
 * ```
 */
const HelloWorld: React.FC = () => {
  // State to track the number of boxes displayed in the grid
  const [boxes, setBoxes] = useState<number>(4);

  // Compute the grid layout (rows/columns) from the current box count
  const { cols, rows }: GridLayout = calculateGridLayout(boxes);

  return (
    <div
      className="grid gap-4 p-4"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {/* Render a ColorBox for each grid cell */}
      {Array.from({ length: boxes }).map((_, i) => (
        <ColorBox key={i} index={i} text={TEXT} />
      ))}

      {/* Add new box to the grid */}
      <AddButton onClick={() => setBoxes(boxes + 1)} />
    </div>
  );
};

export default HelloWorld;
