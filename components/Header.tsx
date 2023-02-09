import Image from "next/image";
import Link from "next/link";
import Github from "../components/GitHub";

export default function Header() {
  return (
    <header className="md:flex text-center justify-between items-center w-full mt-5 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-3 mb-10 md:mb-0 justify-center">
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
          问 · 即答
        </h1>
      </Link>
      <div>
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <a
            className="flex max-w-fit items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition-colors hover:bg-gray-100"
            href="https://github.com/yesmore/QA"
            target="_blank"
            rel="noopener noreferrer">
            <Github />
            <p>Star on GitHub</p>
          </a>
          <a
            className="flex max-w-fit items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition-colors hover:bg-gray-100"
            href="https://www.buymeacoffee.com/yesmore"
            target="_blank"
            rel="noopener noreferrer">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              focusable="false"
              className="text-[#e53e3e]"
              height="18"
              width="18"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
            </svg>
            <p>Sponsor</p>
          </a>
        </div>
      </div>
    </header>
  );
}
