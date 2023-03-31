import BackTop from "@/components/BackTop";
import Github from "./icons/Github";
import { Setter, createEffect, createSignal, onCleanup } from "solid-js";
import toast from "solid-toast";
import { Toaster } from "solid-toast";

interface Props {
  setWaimai: Setter<boolean>;
}
const customTosat = () => {
  const duration = 10000;
  toast.custom(
    (t) => {
      // Start with 100% life
      const [life, setLife] = createSignal(100);
      const startTime = Date.now();
      createEffect(() => {
        if (t.paused) return;
        const interval = setInterval(() => {
          const diff = Date.now() - startTime - t.pauseDuration;
          setLife(100 - (diff / duration) * 100);
        });

        onCleanup(() => clearInterval(interval));
      });

      return (
        <div
          class={`${
            t.visible ? "animate-enter" : "animate-leave"
          } bg-[#80a39d] p-3 rounded-md shadow-md min-w-[350px]`}>
          <div class="flex gap-2">
            <div class="flex flex-1 flex-col">
              <div class="font-medium text-white">
                应用市场搜索“<strong>美兔优选</strong>”并下载，即可省钱+赚钱
              </div>
              <div class="text-sm text-cyan-50">
                站长推荐 <strong></strong>
              </div>
            </div>
            <div class="flex items-center">
              <button
                class="px-2.5 flex items-center relative h-4/5 tracking-wide rounded-md text-2xl text-white bg-cyan-500/40 hover:bg-cyan-500/20"
                onClick={() => toast.dismiss(t.id)}>
                x
              </button>
            </div>
          </div>
          <div class="relative pt-4">
            <div class="w-full h-1 rounded-full bg-slate-4"></div>
            <div
              class="h-1 top-4 absolute rounded-full bg-cyan-50"
              style={{ width: `${life()}%` }}></div>
          </div>
        </div>
      );
    },
    {
      duration: duration,
    }
  );
};

export default ({ setWaimai }: Props) => (
  <footer class="mt-6 text-sm text-slate-800 op-90">
    <div class="flex" mt-3 gap-2>
      <a
        class="flex max-w-fit items-center justify-center space-x-2 rounded-1 border border-amber-300 bg-amber px-3 py-2 text-sm text-gray-600 shadow-sm transition-colors hover:border-amber-400 hover:bg-amber-300 hover:text-slate-2"
        href="https://www.buymeacoffee.com/yesmore/gallery"
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
        <span text-slate-800>二维码打赏</span>
      </a>
      <div
        class="flex max-w-fit items-center justify-center space-x-2 rounded-1 border border-amber-300 bg-amber px-3 py-2 text-sm text-gray-600 shadow-sm transition-colors hover:border-gray-500 hover:bg-gray-6 hover:text-slate-2"
        onClick={() => {
          customTosat();
        }}>
        🧧 去赚钱
      </div>
      {/*  <a
        class="flex max-w-fit items-center justify-center space-x-2 rounded-1 border border-gray-300 bg-gray-3 px-3 py-2 text-sm text-gray-600 shadow-sm transition-colors hover:border-gray-500 hover:bg-gray-6 hover:text-slate-2"
        href="https://github.com/gcloudlab/QA"
        target="_blank"
        rel="noopener noreferrer">
        <Github />
        <span>Star</span>
      </a>
*/}
      <BackTop />
    </div>
    <Toaster />
  </footer>
);
