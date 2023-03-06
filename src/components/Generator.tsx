import { createSignal, onMount, onCleanup, Show, Index } from "solid-js";
import MessageItem from "./MessageItem";
import { generateSignature } from "@/utils/auth";
import LoadingDots from "./icons/LoadingDots";
import {
  clearCustomKey,
  getCustomKey,
  setCustomKey,
  hideKey,
  getRandomInt,
} from "@/utils";
import PromptList from "@/data/prompts.json";
import IconClear from "./icons/Clear";
import type { ChatMessage } from "@/types";
import Footer from "./Footer";

export default () => {
  let inputRef: HTMLTextAreaElement;
  let inputKeyRef: HTMLInputElement;
  let autoScrolling = true;
  const [messageList, setMessageList] = createSignal<ChatMessage[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] =
    createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(false);
  const [controller, setController] = createSignal<AbortController>(null);
  const eventTypes = ["wheel", "touchmove", "keydown"];

  onMount(() => {
    eventTypes.forEach((type) => {
      window.addEventListener(type, eventHandler, { passive: false });
    });
  });
  onCleanup(() => {
    eventTypes.forEach((type) => {
      window.removeEventListener(type, eventHandler);
    });
  });

  const eventHandler = (e) => {
    if (e.type === "keydown") {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
        return;
      }
    }
    stopAutoScroll();
  };
  const startAutoScroll = () => {
    if (autoScrolling) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  const stopAutoScroll = () => {
    if (loading) {
      autoScrolling = false;
    }
  };

  const handleButtonClick = async () => {
    const inputValue = inputRef.value;
    if (!inputValue) {
      return;
    }

    setMessageList([
      ...messageList(),
      {
        role: "user",
        content: inputValue,
      },
    ]);
    requestWithLatestMessage();
  };
  const requestWithLatestMessage = async () => {
    autoScrolling = true;
    setLoading(true);
    setCurrentAssistantMessage("");
    try {
      const controller = new AbortController();
      setController(controller);
      const requestMessageList = [...messageList()];

      setError(false);
      setCustomKey(inputKeyRef.value);
      inputKeyRef.value = "";
      inputKeyRef.placeholder =
        getCustomKey() !== ""
          ? hideKey(getCustomKey())
          : "Custom key (Optional)";

      const timestamp = Date.now();
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          messages: requestMessageList,
          customKey: getCustomKey(),
          time: timestamp,
          sign: await generateSignature({
            t: timestamp,
            m:
              requestMessageList?.[requestMessageList.length - 1]?.content ||
              "",
          }),
        }),
        signal: controller.signal,
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
          startAutoScroll();
        }
        done = readerDone;
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setController(null);
      inputRef.focus();
      return;
    }
    archiveCurrentMessage();
  };
  const archiveCurrentMessage = () => {
    if (currentAssistantMessage()) {
      setMessageList([
        ...messageList(),
        {
          role: "assistant",
          content: currentAssistantMessage(),
        },
      ]);
      setCurrentAssistantMessage("");
      setLoading(false);
      setController(null);
      inputRef.focus();
    }
  };
  const clear = () => {
    inputRef.value = "";
    inputRef.style.height = "auto";
    setMessageList([]);
    setCurrentAssistantMessage("");
    inputRef.focus();
  };

  const stopStreamFetch = () => {
    if (controller()) {
      controller().abort();
      archiveCurrentMessage();
    }
  };
  const retryLastFetch = () => {
    if (messageList().length > 0) {
      const lastMessage = messageList()[messageList().length - 1];
      if (lastMessage.role === "assistant") {
        setMessageList(messageList().slice(0, -1));
        requestWithLatestMessage();
      }
    }
  };
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.isComposing || e.shiftKey) {
      return;
    }
    if (e.key === "Enter") {
      handleButtonClick();
    }
  };
  const handleRandomPrompt = async () => {
    const _index = getRandomInt(0, PromptList.length - 1);
    inputRef.value = PromptList[_index].prompt;
    handleButtonClick();
  };

  return (
    <div class="my-6 ">
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
            <div class="mt-4 flex">
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
                rounded-l
                bg-slate
                bg-op-15
                focus:bg-op-20
                focus:ring-0
                focus:outline-none
                placeholder:text-slate-900
                placeholder:op-30
              />
              <button
                title="Clear key"
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
                bg-slate-5
                bg-op-15
                hover:bg-slate-4
                transition-colors
                text-slate
                hover:text-slate-1
                rounded-r>
                <IconClear />
              </button>
            </div>
          </details>
        </li>
      </ul>
      <div class="flex flex-col">
        <div flex-grow-2 classList={{ "mb-17": messageList().length > 0 }}>
          <Index each={messageList()}>
            {(message, index) => (
              <MessageItem
                role={message().role}
                message={message().content}
                showRetry={() =>
                  message().role === "assistant" &&
                  index === messageList().length - 1
                }
                onRetry={retryLastFetch}
              />
            )}
          </Index>
          {currentAssistantMessage() && (
            <MessageItem role="assistant" message={currentAssistantMessage} />
          )}
        </div>

        <div
          classList={{
            "fixed bottom-0 z-1 pr-8 pb-4 w-full bg-[#f5e6d8]":
              messageList().length > 0,
          }}
          style="max-width: 75ch">
          <Show
            when={!loading()}
            fallback={() => (
              <div class="flex">
                <button class="h-12 bg-[#80a39d] rounded-l text-white font-medium px-4 py-2 hover:bg-primary/80 w-full">
                  <LoadingDots style="large" />
                </button>
                <button
                  title="Stop"
                  h-12
                  px-4
                  py-2
                  bg-slate
                  bg-op-15
                  items-center
                  hover:bg-slate-500
                  transition-colors
                  text-slate
                  hover:text-slate-1
                  rounded-r
                  onClick={stopStreamFetch}>
                  <svg
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="5466"
                    w-6
                    h-6>
                    <path
                      d="M856 208.7v606.6c0 26.5-21.5 48-48 48H216c-26.5 0-48-21.5-48-48V208.7c0-26.5 21.5-48 48-48h592c26.5 0 48 21.5 48 48z"
                      p-id="5467"
                      fill="#707070"></path>
                  </svg>
                </button>
              </div>
            )}>
            <div class=" flex items-end">
              <textarea
                ref={inputRef!}
                id="input"
                placeholder="Say something..."
                rows="1"
                resize-none
                autocomplete="off"
                autofocus
                disabled={loading()}
                onKeyDown={handleKeydown}
                onInput={() => {
                  inputRef.style.height = "auto";
                  inputRef.style.height = inputRef.scrollHeight + "px";
                }}
                w-full
                px-4
                py-3
                min-h-12
                max-h-36
                text-slate-700
                rounded-l
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
                title="send"
                onClick={handleButtonClick}
                disabled={loading()}
                h-12
                px-4
                py-2
                bg-slate-5
                bg-op-15
                hover:bg-slate-4
                transition-colors
                rounded-r
                text-slate>
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
          <Footer onClear={clear} />
        </div>
      </div>
    </div>
  );
};
