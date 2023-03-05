export default () => (
  <button
    title="scroll to top"
    onClick={() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }}
    h-10
    ml-auto
    px-4
    py-2
    bg-slate
    bg-op-15
    hover:bg-slate-4
    transition-colors
    text-slate-8
    rounded-1>
    ▼
  </button>
);
