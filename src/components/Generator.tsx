import { createSignal, onMount, onCleanup, Show, Index } from "solid-js";
import MessageItem from "./MessageItem";
import { generateSignature } from "@/utils/auth";
import { getCreditGrants } from "@/utils/openAI";
import {
  clearCustomKey,
  getCustomKey,
  setCustomKey,
  hideKey,
  getRandomInt,
} from "@/utils";
import PromptList from "@/data/prompts.json";
import LoadingDots from "./icons/LoadingDots";
import IconClear from "./icons/Clear";
import Toggle from "./Toggle";
import Footer from "./Footer";
import type { ChatMessage } from "@/types";

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
  const [balance, setBalance] = createSignal("--");
  const eventTypes = ["wheel", "touchmove", "keydown"];

  onMount(async () => {
    eventTypes.forEach((type) => {
      window.addEventListener(type, eventHandler, { passive: false });
    });
    if (getCustomKey() !== "") {
      getCreditGrants(getCustomKey()).then((res) => {
        setBalance(res);
      });
    }
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
  const requestKeyBalance = async () => {
    if (inputKeyRef.value !== "") {
      getCreditGrants(inputKeyRef.value).then((res) => {
        setBalance(res);
        console.log(res);
      });
    }
  };
  const requestWithLatestMessage = async () => {
    if (getCustomKey() === "" && inputKeyRef.value === "") {
      setError(true);
      return;
    }

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
          : "OpenAI API Key (Optional)";

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
    inputRef.value = "";
  };

  const handleCheckSession = (isChecked) => {
    console.log(isChecked);
  };

  return (
    <div class="my-6 ">
      <ul class="advanced-settingstree mb-4">
        <li>
          <details mb-4>
            <summary text-slate>
              Advanced settings or{" "}
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
            <div class="mt-4 ml-3">
              <div class="api-key">
                <div class="flex">
                  <input
                    ref={inputKeyRef!}
                    type="text"
                    placeholder={`${
                      getCustomKey() !== ""
                        ? hideKey(getCustomKey())
                        : "OpenAI API Key (Optional)"
                    }`}
                    onBlur={requestKeyBalance}
                    autocomplete="off"
                    w-full
                    px-4
                    py-2
                    h-10
                    min-h-10
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
                      setBalance("--");
                      inputKeyRef.value = "";
                      inputKeyRef.placeholder =
                        getCustomKey() !== ""
                          ? hideKey(getCustomKey())
                          : "OpenAI API Key (Optional)";
                    }}
                    h-10
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
                <div class="flex justify-between items-center ml-1 mt-2">
                  <p>
                    <a
                      text-sm
                      text-slate-4
                      border-b
                      border-slate
                      border-none
                      hover:border-dashed
                      href="https://platform.openai.com/account/api-keys"
                      target="_blank">
                      How to get OpenAI API key?
                    </a>
                  </p>

                  <p text-sm text-slate-4>
                    Usage:{" "}
                    <span
                      border-b
                      border-slate
                      border-none
                      hover:border-dashed
                      text-slate-5>
                      {balance()}
                    </span>
                  </p>
                </div>
              </div>

              <div class="setting-group" mt-3>
                <Toggle
                  title="Auto scroll (work in progress)"
                  value={true}
                  onCheckboxChange={handleCheckSession}
                />
                <Toggle
                  title="Auto save current session (work in progress)"
                  value={false}
                  onCheckboxChange={handleCheckSession}
                />
              </div>
            </div>
          </details>
        </li>
      </ul>

      <div class="flex flex-col">
        <div
          class="message-wrapper"
          flex-grow-2
          classList={{ "mb-17.5": messageList().length > 0 }}>
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
                🚨 Something error, please check your Api Key and try again
                later, or{" "}
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
