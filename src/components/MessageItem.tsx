import { Accessor, createSignal } from "solid-js";
import { Toaster } from "solid-toast";
import type { ChatMessage } from "../types";
import MarkdownIt from "markdown-it";
// @ts-ignore
import mdKatex from "markdown-it-katex";
import mdHighlight from "markdown-it-highlightjs";
import IconRefresh from "./icons/Refresh";
import Clipboard from "./Clipboard";

interface Props {
  role: ChatMessage["role"];
  message: Accessor<string> | string;
  showRetry?: Accessor<boolean>;
  onRetry?: () => void;
}

export default ({ role, message, showRetry, onRetry }: Props) => {
  const [showCopy, setShowCopy] = createSignal(false);

  const roleClass = {
    system: "bg-gradient-to-r from-gray-300 via-gray-200 to-[#80a39d]",
    user: "bg-gradient-to-r from-[#cd5348] to-[#80a39d]",
    assistant: "bg-gradient-to-r from-cyan-200  to-[#80a39d]",
  };
  const htmlString = () => {
    const md = MarkdownIt({ html: true }).use(mdKatex).use(mdHighlight);

    if (typeof message === "function") {
      return md.render(message());
    } else if (typeof message === "string") {
      return md.render(message);
    }
    return "";
  };

  return (
    <div class="relative -mx-4 px-4 transition-colors md:hover:bg-slate/3">
      <div
        class="flex py-2 gap-3 px-4 rounded-sm transition-colors bg-[#80a39d] hover:bg-op-80"
        class:op-75={role === "user"}
        onMouseEnter={() => setShowCopy(true)}
        onMouseLeave={() => setShowCopy(false)}>
        <div
          class={`shrink-0 w-7 h-7 mt-4 rounded-full op-80 ${roleClass[role]}`}></div>
        <div
          class="message prose text-slate-900 break-words overflow-hidden"
          innerHTML={htmlString()}
        />
        {showCopy() && <Clipboard message={message} />}
        {showRetry?.() && onRetry && (
          <button
            class="absolute"
            bottom-0
            right-4
            z-1
            title="重试"
            onClick={onRetry}
            style={{ "margin-top": "-25px" }}
            text-center
            float-right
            px-2
            py-1
            bg-op-15
            hover:bg-slate-400
            transition-colors
            text-slate-7
            hover:text-slate-1
            rounded-1>
            <IconRefresh />
          </button>
        )}
        <Toaster />
      </div>
    </div>
  );
};
