import type { AddButtonProps } from "@/types";
import { Button } from "@kishor-aracreate/ac-ui-library-test";

/**
 * AddButton Component
 * ---------------------------------------------------------------------------
 * A simple UI button that adds new items when clicked.
 *
 * ✅ Responsibilities:
 * - Render a styled button with a "+" symbol.
 * - Trigger the provided `onClick` handler when pressed.
 * - Serve as an entry point for adding new boxes/items in a grid or list.
 *
 * @param onClick - Callback fired when the button is clicked.
 *
 * @remarks
 * - Uses TailwindCSS utility classes for styling (flex, size, hover state).
 * - Rounded corners and hover transitions provide basic UI polish.
 * - Button content is currently fixed to `"+"`, but can be extended if needed.
 *
 * @example
 * ```tsx
 * import AddButton from '@/components/ui/add-button';
 *
 * export default function Example() {
 *   return (
 *     <div className="flex gap-4">
 *       <AddButton onClick={() => console.log('Add item!')} />
 *     </div>
 *   );
 * }
 * ```
 */
const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <Button type="button" className="bg-black p-10" onClick={onClick}>
      +
    </Button>
  );
};

export default AddButton;
