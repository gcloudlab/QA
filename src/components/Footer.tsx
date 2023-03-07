import Github from "./icons/Github";
import IconClear from "./icons/Clear";

interface Props {
  onClear?: () => void;
}

export default ({ onClear }: Props) => (
  <footer op-60>
    <div mt-6 text-sm text-slate-800>
      <div class="flex" justify-between>
        <p>
          <span>By</span>{" "}
          <a
            border-b
            border-slate
            border-none
            hover:border-dashed
            href="https://yesmore.cc"
            target="_blank">
            yesmore
          </a>
        </p>

        <button
          class="flex items-center justify-between"
          title="Clear current session"
          w-26
          onClick={onClear}
          transition-colors
          text-slate-7
          hover:text-slate-5>
          <IconClear />
          Clear session
        </button>
      </div>

      <div class="flex" mt-3 gap-2>
        <a
          class="flex max-w-fit items-center justify-center space-x-2 rounded-1 border border-amber-300 bg-amber px-3 py-2 text-sm text-gray-600 shadow-sm transition-colors hover:border-amber-400 hover:bg-amber-300 hover:text-slate-2"
          href="https://www.buymeacoffee.com/yesmore"
          target="_blank"
          rel="noopener noreferrer">
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 512 512"
            class="text-[#e53e3e]"
            height="18"
            width="18"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
          </svg>
          <span text-slate-800>Buy me a coffee</span>
        </a>
        <a
          class="flex max-w-fit items-center justify-center space-x-2 rounded-1 border border-gray-300 bg-gray-3 px-3 py-2 text-sm text-gray-600 shadow-sm transition-colors hover:border-gray-500 hover:bg-gray-6 hover:text-slate-2"
          href="https://github.com/yesmore/QA"
          target="_blank"
          rel="noopener noreferrer">
          <Github />
          <span>Star on GitHub</span>
        </a>
      </div>
    </div>
  </footer>
);
