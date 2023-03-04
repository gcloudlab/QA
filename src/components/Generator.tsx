import { createSignal, For, Show } from "solid-js";
import MessageItem from "./MessageItem";
import LoadingDots from "./LoadingDots";
import {
  clearCustomKey,
  getCustomKey,
  setCustomKey,
  hideKey,
  getRandomInt,
} from "../utils";
import PromptList from "../data/prompts.json";
import IconClear from "./icons/Clear";
import type { ChatMessage } from "../types";

export default () => {
  let inputRef: HTMLTextAreaElement;
  let inputKeyRef: HTMLInputElement;
  const [messageList, setMessageList] = createSignal<ChatMessage[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] =
    createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(false);

  const handleButtonClick = async () => {
    const inputValue = inputRef.value;
    if (!inputValue) {
      return;
    }
    setLoading(true);

    setMessageList([
      ...messageList(),
      {
        role: "user",
        content: inputValue,
      },
    ]);

    setError(false);
    setCustomKey(inputKeyRef.value);
    inputKeyRef.value = "";
    inputKeyRef.placeholder =
      getCustomKey() !== "" ? hideKey(getCustomKey()) : "Custom key (Optional)";

    const response = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        messages: messageList(),
        customKey: getCustomKey(),
      }),
    });
    if (!response.ok) {
      setLoading(false);
      setError(true);
      throw new Error(response.statusText);
    }
    const data = response.body;
    if (!data) {
      throw new Error("No data");
    }
    const reader = data.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) {
        let char = decoder.decode(value);
        if (char === "\n" && currentAssistantMessage().endsWith("\n")) {
          continue;
        }
        if (char) {
          setCurrentAssistantMessage(currentAssistantMessage() + char);
        }
      }
      done = readerDone;
    }
    setMessageList([
      ...messageList(),
      {
        role: "assistant",
        content: currentAssistantMessage(),
      },
    ]);
    setCurrentAssistantMessage("");
    setLoading(false);
    inputRef.focus();
  };

  const handleRandomPrompt = async () => {
    const _index = getRandomInt(0, PromptList.length - 1);
    inputRef.value = PromptList[_index].prompt;
    handleButtonClick();
  };

  const clear = () => {
    inputRef.value = "";
    setMessageList([]);
    setCurrentAssistantMessage("");
    inputRef.focus();
  };

  return (
    <div my-6>
      <ul class="tree">
        <li>
          <details mb-4>
            <summary text-slate>
              Advanced Options or{" "}
              <button
                title="Generate a conversation scene randomly"
                disabled={loading()}
                transition-colors
                text-slate-6
                hover:text-slate-4
                onClick={handleRandomPrompt}>
                Random prompt🎉
              </button>
            </summary>
            <div class="mt-4 flex gap-1">
              <input
                ref={inputKeyRef!}
                type="text"
                placeholder={`${
                  getCustomKey() !== ""
                    ? hideKey(getCustomKey())
                    : "Custom key (Optional)"
                }`}
                autocomplete="off"
                w-full
                px-4
                py-3
                h-12
                min-h-12
                text-slate-700
                rounded-1
                bg-slate
                bg-op-15
                focus:bg-op-20
                focus:ring-0
                focus:outline-none
                placeholder:text-slate-900
                placeholder:op-30
              />
              <Show when={getCustomKey() !== ""}>
                <button
                  title="Clear cache"
                  onClick={() => {
                    clearCustomKey();
                    inputKeyRef.value = "";
                    inputKeyRef.placeholder =
                      getCustomKey() !== ""
                        ? hideKey(getCustomKey())
                        : "Custom key (Optional)";
                  }}
                  h-12
                  px-4
                  py-2
                  bg-slate
                  bg-op-15
                  hover:bg-slate-5
                  transition-colors
                  text-slate
                  hover:text-slate-1
                  rounded-1>
                  <IconClear />
                </button>
              </Show>
            </div>
          </details>
        </li>
      </ul>

      <For each={messageList()}>
        {(message) => (
          <MessageItem role={message.role} message={message.content} />
        )}
      </For>
      {currentAssistantMessage() && (
        <MessageItem role="assistant" message={currentAssistantMessage} />
      )}

      <Show
        when={!loading()}
        fallback={() => (
          <button class="h-12 bg-[#80a39d] rounded-1 text-white font-medium px-4 py-2 sm:mt-4 mt-3 hover:bg-primary/80 w-full">
            <LoadingDots style="large" />
          </button>
        )}>
        <div class="my-4 flex items-end gap-1">
          <textarea
            ref={inputRef!}
            id="input"
            // rows={1}
            placeholder="Say something..."
            autocomplete="off"
            autofocus
            disabled={loading()}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.isComposing && !e.shiftKey) {
                e.preventDefault();
                handleButtonClick();
              } else if (e.key === "Enter" && e.shiftKey) {
                e.preventDefault();
                const start = inputRef.selectionStart;
                const end = inputRef.selectionEnd;
                const value = inputRef.value;
                inputRef.value =
                  value.substring(0, start) + "\n" + value.substring(end);
                inputRef.selectionStart = inputRef.selectionEnd = start + 1;
                inputRef.rows += 1;
              }
              // e.key === "Enter" && !e.isComposing && handleButtonClick();
            }}
            w-full
            px-4
            py-3
            h-12
            min-h-12
            text-slate-700
            rounded-1
            bg-slate
            class="ipt"
            bg-op-15
            focus:bg-op-20
            focus:ring-0
            focus:outline-none
            placeholder:text-slate-900
            placeholder:op-30
          />
          <button
            onClick={handleButtonClick}
            disabled={loading()}
            h-12
            px-4
            py-2
            bg-slate
            bg-op-15
            hover:bg-slate-4
            transition-colors
            text-slate
            rounded-1>
            <svg
              w-6
              h-6
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3659"
              width="256"
              height="256">
              <path
                d="M925.6 559.2L152 145.6c-11.2-5.6-24.8 3.2-23.2 15.2l60 714.4c0.8 11.2 12 17.6 22.4 13.6L460.8 784l136.8 155.2c8.8 9.6 24 5.6 27.2-6.4l65.6-245.6L925.6 588c11.2-5.6 12-22.4 0-28.8z m-328 305.6l-72-128-368-568 488 504-48 192z"
                p-id="3660"
                fill="#707070"></path>
            </svg>
          </button>
          <button
            title="Clear chat"
            onClick={clear}
            disabled={loading()}
            h-12
            px-4
            py-2
            bg-slate
            bg-op-15
            hover:bg-slate-500
            transition-colors
            text-slate
            hover:text-slate-1
            rounded-1>
            <IconClear />
          </button>
        </div>
        {error() && (
          <p class="text-gray-400 my-5">
            🚨 Something error, please try again later, or{" "}
            <a
              href="https://github.com/yesmore/QA/issues"
              class=" underline hover:text-black">
              contact issue
            </a>
            .{" "}
          </p>
        )}
      </Show>
    </div>
  );
};
