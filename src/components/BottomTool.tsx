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
        title="随机生成预设场景"
        disabled={loading()}
        transition-colors
        hover:text-slate-5
        onClick={onRandom}>
        随机预设场景 🎉
      </button>
      <button
        class="flex items-center justify-between"
        title="清空当前会话"
        w-18
        disabled={loading()}
        onClick={onClear}
        transition-colors
        hover:text-slate-5>
        <IconClear />
        清空会话
      </button>
    </div>
  );
};
