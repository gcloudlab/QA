import { Accessor } from "solid-js";
import IconClear from "./icons/Clear";

interface Props {
  loading: Accessor<boolean>;
  onClear: () => void;
  onRandom: () => void;
}

export default ({ loading, onClear, onRandom }: Props) => {
  return (
    <div class="mt-3 flex justify-between text-sm text-slate-4">
      <button
        title="Generate a conversation scene randomly"
        disabled={loading()}
        transition-colors
        hover:text-slate-5
        onClick={onRandom}>
        Random prompt🎉
      </button>
      <button
        class="flex items-center justify-between"
        title="Clear current session"
        w-26
        onClick={onClear}
        transition-colors
        hover:text-slate-5>
        <IconClear />
        Clear session
      </button>
    </div>
  );
};
