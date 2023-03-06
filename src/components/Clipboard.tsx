import toast from "solid-toast";

export default function Clipboard(props: { message: string | Function }) {
  return (
    <div class="absolute top-0 right-4 z-1">
      <button
        title="Copy"
        px-2
        py-2
        bg-slate-3
        hover:bg-slate-4
        transition-colors
        text-slate
        rounded-1
        onClick={() => {
          navigator.clipboard.writeText(
            typeof props.message === "string" ? props.message : props.message()
          );
          toast("Copied to clipboard", {
            icon: "✂️",
            position: "top-center",
            duration: 2000,
          });
        }}>
        <svg
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2930"
          h-5
          w-5>
          <path
            d="M768 384h-128V241.92A114.346667 114.346667 0 0 0 526.08 128H241.92A114.346667 114.346667 0 0 0 128 241.92v284.16A114.346667 114.346667 0 0 0 241.92 640H384v128a128 128 0 0 0 128 128h256a128 128 0 0 0 128-128v-256a128 128 0 0 0-128-128z m-384 128v42.666667H241.92a28.586667 28.586667 0 0 1-28.586667-28.586667V241.92A28.586667 28.586667 0 0 1 241.92 213.333333h284.16a28.586667 28.586667 0 0 1 28.586667 28.586667V384h-42.666667a128 128 0 0 0-128 128z"
            p-id="2931"
            fill="#707070"></path>
        </svg>
      </button>
    </div>
  );
}
