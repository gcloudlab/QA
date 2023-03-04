import { createSignal, For, Show } from "solid-js";
import MessageItem from "./MessageItem";
import { clearCustomKey, getCustomKey, setCustomKey } from "../utils/cache";
import IconClear from "./icons/Clear";
import type { ChatMessage } from "../types";

export default () => {
  let inputRef: HTMLTextAreaElement;
  let inputKeyRef: HTMLInputElement;
  const [messageList, setMessageList] = createSignal<ChatMessage[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] =
    createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [cacheKey, setCacheKey] = createSignal(getCustomKey());

  const handleButtonClick = async () => {
    const inputValue = inputRef.value;
    if (!inputValue) {
      return;
    }
    setLoading(true);

    inputRef.value = "";
    setMessageList([
      ...messageList(),
      {
        role: "user",
        content: inputValue,
      },
    ]);

    setCustomKey(inputKeyRef.value);

    const response = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        messages: messageList(),
        customKey: inputKeyRef.value,
      }),
    });
    if (!response.ok) {
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

  const clear = () => {
    inputRef.value = "";
    setMessageList([]);
    setCurrentAssistantMessage("");
    inputRef.focus();
  };

  return (
    <div my-6>
      <div class="my-4 flex gap-2">
        <input
          ref={inputKeyRef!}
          type="text"
          placeholder={`${
            cacheKey() !== ""
              ? cacheKey().slice(0, 2) +
                "*".repeat(cacheKey().length - 5) +
                cacheKey().slice(cacheKey().length - 3)
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
        <Show when={cacheKey() !== ""}>
          <button
            title="Clear cache"
            onClick={() => {
              clearCustomKey();
              inputKeyRef.value = "";
              setCacheKey("");
            }}
            disabled={loading()}
            h-12
            px-4
            py-2
            bg-slate
            bg-op-15
            hover:bg-op-20
            text-slate
            rounded-1>
            <IconClear />
          </button>
        </Show>
      </div>
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
          <div class="h-12 my-4 flex items-center justify-center bg-slate bg-op-15 text-slate-500 rounded-sm">
            thinking...
          </div>
        )}>
        <div class="my-4 flex items-end gap-2">
          <textarea
            ref={inputRef!}
            id="input"
            // rows={1}
            placeholder="Talk with me..."
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
            hover:bg-op-20
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
            title="Clear caht"
            onClick={clear}
            disabled={loading()}
            h-12
            px-4
            py-2
            bg-slate
            bg-op-15
            hover:bg-op-20
            text-slate
            rounded-1>
            <IconClear />
          </button>
        </div>
      </Show>
    </div>
  );
};
