import { colors } from '@/lib/constants';
import type { ColorBoxProps } from '@/types';

/**
 * ColorBox Component
 * ---------------------------------------------------------------------------
 * A presentational UI component that renders a colored box with centered text.
 *
 * ✅ Responsibilities:
 * - Display text content inside a styled box.
 * - Apply a background color based on the given index (cycled through `colors`).
 * - Provide a simple visual element for demos, grids, or UI showcases.
 *
 * @param index - Numeric index used to select a background color.
 * @param text  - Text content to display inside the box.
 *
 * @remarks
 * - Background colors are pulled from the `colors` array in `@/lib/constants`.
 * - Colors cycle (`index % colors.length`) so that the palette repeats safely.
 * - TailwindCSS utility classes are used for styling (flex, text, rounded corners).
 *
 * @example
 * ```tsx
 * import ColorBox from '@/components/ui/color-box';
 *
 * export default function Example() {
 *   return (
 *     <div className="grid grid-cols-3 gap-4">
 *       {Array.from({ length: 5 }).map((_, i) => (
 *         <ColorBox key={i} index={i} text={`Box ${i + 1}`} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
const ColorBox: React.FC<ColorBoxProps> = ({ index, text }) => {
  return (
    <div
      className={`flex items-center justify-center h-32 text-white text-xl font-bold rounded ${colors[index % colors.length]}`}
    >
      {text}
    </div>
  );
};

export default ColorBox;
