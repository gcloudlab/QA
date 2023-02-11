import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import DropDown2, { VibeType2 } from "../components/DropDown2";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Github from "../components/GitHub";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [desc, setDesc] = useState("");
  const [lang, setLang] = useState<VibeType>("中文");
  const [difficulty, setDifficulty] = useState<VibeType2>("Easy");
  const [generatedDescs, setGeneratedDescs] = useState<string>("");
  const defultDesc = "什么是小黑子？";

  console.log("Streamed response: ", { generatedDescs });
  let promptObj = {
    中文: "Simplified Chinese",
    English: "UK English",
    繁體中文: "Traditional Chinese",
    日本語: "Japanese",
    Italiano: "Italian",
    Deutsch: "German",
    Español: "Spanish",
    Français: "French",
    Nederlands: "Dutch",
    한국어: "Korean",
    ភាសាខ្មែរ: "Khmer",
    हिंदी: "Hindi",
  };
  let difficultyObj = {
    Easy: "Easy",
    Profession: "Profession",
  };
  let text = desc || defultDesc;

  const generateDesc = async (e: any) => {
    let prompt;
    if (difficultyObj[difficulty] == "Easy") {
      prompt = `Explain ${text}${
        text.slice(-1) === "." ? "" : "."
      } to a 6nd grader in ${promptObj[lang]} with a simple example.`;
    } else {
      prompt = `Explain ${text}${text.slice(-1) === "." ? "" : "."} in ${
        promptObj[lang]
      }  in technical terms, divided into two paragraphs, principles and applications. Output format, Principle:, Application.`;
    }
    e.preventDefault();
    setGeneratedDescs("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      setError(true);
      setLoading(false);
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedDescs((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="bg-fan flex flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>问 · 即答</title>
        <link
          className="text-primary"
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>

      <Header />

      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-2 sm:mt-4">
        <h1 className="text-primary sm:text-3xl text-2xl max-w-1xl font-bold ">
          问
        </h1>
        <div className="max-w-xl w-full">
          <div className="flex mt-4 items-center space-x-3 mb-3">
            <span className="bg-secondary w-7 h-7 rounded-full text-white text-center leading-7">
              1
            </span>
            <p className="text-secondary text-left font-medium">输入你的问题</p>
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            className="w-full rounded-md bg-fan border-gray-400 shadow-sm focus:border-secondary focus:ring-secondary my-2"
            placeholder={"e.g. " + defultDesc}
          />
          <div className="flex mb-5 items-center space-x-3">
            <span className="bg-secondary w-7 h-7 rounded-full text-white text-center leading-7">
              2
            </span>
            <p className="text-secondary text-left font-medium">选择语言</p>
          </div>
          <div className="block">
            <DropDown vibe={lang} setVibe={(newLang) => setLang(newLang)} />
          </div>

          <div className="flex mb-5 items-center space-x-3 mt-3">
            <span className="bg-secondary w-7 h-7 rounded-full text-white text-center leading-7">
              3
            </span>
            <p className="text-secondary text-left font-medium">选择难度</p>
          </div>
          <div className="block">
            <DropDown2
              vibe2={difficulty}
              setVibe2={(newDifficulty) => setDifficulty(newDifficulty)}
            />
          </div>

          {!loading && (
            <button
              className="bg-primary rounded-xl text-white font-medium px-4 py-2 sm:mt-4 mt-3 hover:bg-primary/80 w-full"
              onClick={(e) => generateDesc(e)}>
              获取回答 &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-primary rounded-xl text-white font-medium px-4 py-2 sm:mt-4 mt-3 hover:bg-primary/80 w-full"
              disabled>
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-4">
              {generatedDescs && (
                <>
                  <div>
                    <h2 className="text-primary sm:text-4xl text-3xl font-bold mx-auto">
                      即答
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto  whitespace-pre-wrap">
                    <div
                      className="bg-fan1 rounded-xl shadow-md p-4 hover:bg-fan transition cursor-copy border text-left"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedDescs);
                        toast("已复制到剪切板", {
                          icon: "✂️",
                        });
                      }}>
                      <p>{generatedDescs}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
        {error && (
          <p className="text-gray-400 my-5">
            🚨 服务器错误, 请稍后再试, 或者{" "}
            <a
              href="https://github.com/yesmore"
              className=" underline hover:text-black">
              联系站长
            </a>
            .{" "}
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
